import type { MetadataRoute } from 'next'
import { getAllCitySlugs } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = 'https://elektrykmajkel.pl'
	const now = new Date()

	const citySlugs = await getAllCitySlugs().catch(() => [])

	const cityPages = citySlugs.map(slug => ({
		url: `${baseUrl}/uslugi/elektryk-${slug}`,
		lastModified: now,
		changeFrequency: 'monthly' as const,
		priority: 0.7,
	}))

	return [
		{
			url: baseUrl,
			lastModified: now,
			changeFrequency: 'weekly',
			priority: 1,
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
	]
}
