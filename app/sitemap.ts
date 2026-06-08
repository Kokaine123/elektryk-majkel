import type { MetadataRoute } from 'next'
import { getAllCitySlugs, getAllBlogSlugs, getAllServicePageSlugs } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = 'https://elektrykmajkel.pl'
	const staticLastModified = new Date('2026-01-01T00:00:00.000Z')

	const [citySlugs, blogSlugs, serviceSlugs] = await Promise.all([
		getAllCitySlugs().catch(() => []),
		getAllBlogSlugs().catch(() => []),
		getAllServicePageSlugs().catch(() => []),
	])

	const cityPages = citySlugs.map(slug => ({
		url: `${baseUrl}/uslugi/elektryk-${slug}`,
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	}))

	const blogPages = blogSlugs.map(slug => ({
		url: `${baseUrl}/blog/${slug}`,
		changeFrequency: 'weekly' as const,
		priority: 0.6,
	}))

	const servicePages = serviceSlugs.map(slug => ({
		url: `${baseUrl}/uslugi/${slug}`,
		changeFrequency: 'monthly' as const,
		priority: 0.8,
	}))

	return [
		{
			url: baseUrl,
			lastModified: staticLastModified,
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${baseUrl}/blog`,
			lastModified: staticLastModified,
			changeFrequency: 'weekly',
			priority: 0.8,
		},
		{
			url: `${baseUrl}/polityka-prywatnosci`,
			lastModified: staticLastModified,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		{
			url: `${baseUrl}/regulamin`,
			lastModified: staticLastModified,
			changeFrequency: 'yearly',
			priority: 0.3,
		},
		...servicePages,
		...cityPages,
		...blogPages,
	]
}
