import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: true,
})

// Preview client — no CDN, uses token, shows draft documents
export const previewClient = client.withConfig({
	useCdn: false,
	token: process.env.SANITY_API_READ_TOKEN,
	perspective: 'previewDrafts',
})

const builder = createImageUrlBuilder({ projectId: projectId!, dataset: dataset! })

export function urlFor(source: Parameters<typeof builder.image>[0]) {
	return builder.image(source)
}
