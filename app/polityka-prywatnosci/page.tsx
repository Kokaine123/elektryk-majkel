import { Metadata } from 'next'
import Link from 'next/link'
import { getLegalPageBySlug } from '@/lib/queries'
import LegalPageLayout from '@/components/LegalPageLayout'

const SLUG = 'polityka-prywatnosci'

export async function generateMetadata(): Promise<Metadata> {
	const page = await getLegalPageBySlug(SLUG)
	return {
		title: page?.metaTitle || 'Polityka prywatności | Elektryk Majkel',
		description:
			page?.metaDescription ||
			'Polityka prywatności serwisu elektrykmajkel.pl. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.',
		alternates: {
			canonical: 'https://elektrykmajkel.pl/polityka-prywatnosci',
		},
		robots: { index: true, follow: true },
	}
}

export default async function PolitykaPrywatnosci() {
	const page = await getLegalPageBySlug(SLUG)

	if (!page?.content) {
		return (
			<div className="min-h-screen bg-[#f7f6f3] flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 mb-4">Strona w przygotowaniu</h1>
					<Link href="/" className="text-amber-700 hover:text-amber-600 font-semibold">
						← Wróć na stronę główną
					</Link>
				</div>
			</div>
		)
	}

	return <LegalPageLayout title={page.title} lastUpdated={page.lastUpdated} content={page.content} />
}
