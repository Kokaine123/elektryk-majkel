import type { Metadata, Viewport } from 'next'
import { metadata as studioMetadata, viewport as studioViewport } from 'next-sanity/studio'

export const metadata: Metadata = {
	...studioMetadata,
	title: 'Sanity Studio | Elektryk Majkel',
}

export const viewport: Viewport = {
	...studioViewport,
	interactiveWidget: 'resizes-content',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
	return children
}
