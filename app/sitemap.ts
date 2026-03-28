import type { MetadataRoute } from 'next'
import { getAllCitySlugs, getAllBlogSlugs } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = 'https://elektrykmajkel.pl'
	const now = new Date()

	const [citySlugs, blogSlugs] = await Promise.all([
		getAllCitySlugs().catch(() => []),
		getAllBlogSlugs().catch(() => []),
	])

	const cityPages = citySlugs.map(slug => ({
		url: `${baseUrl}/uslugi/elektryk-${slug}`,
		lastModified: now,
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	}))

	const blogPages = blogSlugs.map(slug => ({
		url: `${baseUrl}/blog/${slug}`,
		lastModified: now,
		changeFrequency: 'weekly' as const,
		priority: 0.6,
	}))

	return [
		{
			url: baseUrl,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/polityka-prywatnosci`,
			lastModified: now,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${baseUrl}/regulamin`,
			lastModified: now,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		...cityPages,
		...blogPages,
	]
}
