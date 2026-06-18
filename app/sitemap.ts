import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'

export const revalidate = 3600

const indexableCitySlugs = new Set(['stalowa-wola', 'sandomierz'])

async function fetchSlugs(type: string): Promise<string[]> {
	try {
		const slugs = await client.fetch<string[]>(
			`*[_type == $type && defined(slug.current)].slug.current`,
			{ type },
			{ next: { revalidate: 3600, tags: [type, 'sitemap'] } },
		)

		if (!Array.isArray(slugs)) return []

		return [...new Set(slugs.filter((slug): slug is string => typeof slug === 'string' && slug.length > 0))]
	} catch {
		return []
	}
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = 'https://elektrykmajkel.pl'
	const staticLastModified = new Date()

	const [citySlugs, blogSlugs, serviceSlugs] = await Promise.all([
		fetchSlugs('mapCity'),
		fetchSlugs('blogPost'),
		fetchSlugs('servicePage'),
	])

	const cityPages = citySlugs
		.filter(slug => indexableCitySlugs.has(slug))
		.map(slug => ({
			url: `${baseUrl}/uslugi/elektryk-${slug}`,
			lastModified: staticLastModified,
			changeFrequency: 'monthly' as const,
			priority: 0.7,
		}))

	const blogPages = blogSlugs.map(slug => ({
		url: `${baseUrl}/blog/${slug}`,
		lastModified: staticLastModified,
		changeFrequency: 'weekly' as const,
		priority: 0.6,
	}))

	const servicePages = serviceSlugs.map(slug => ({
		url: `${baseUrl}/uslugi/${slug}`,
		lastModified: staticLastModified,
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
