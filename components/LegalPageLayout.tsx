import Link from 'next/link'
import { PortableText, PortableTextComponents } from '@portabletext/react'

const portableTextComponents: PortableTextComponents = {
	block: {
		h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mb-3 mt-8 first:mt-0">{children}</h2>,
		h3: ({ children }) => <h3 className="text-lg font-bold text-gray-900 mb-2 mt-6">{children}</h3>,
		normal: ({ children }) => <p className="mb-3">{children}</p>,
	},
	list: {
		bullet: ({ children }) => <ul className="list-disc pl-6 space-y-1 mb-3">{children}</ul>,
		number: ({ children }) => <ol className="list-decimal pl-6 space-y-2 mb-3">{children}</ol>,
	},
	listItem: {
		bullet: ({ children }) => <li>{children}</li>,
		number: ({ children }) => <li>{children}</li>,
	},
	marks: {
		strong: ({ children }) => <strong>{children}</strong>,
		em: ({ children }) => <em>{children}</em>,
		link: ({ value, children }) => {
			const href = value?.href || '#'
			const blank = value?.blank
			if (blank) {
				return (
					<a href={href} target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800">
						{children}
					</a>
				)
			}
			// Internal links (starting with /)
			if (href.startsWith('/')) {
				return (
					<Link href={href} className="text-amber-700 hover:text-amber-800 font-semibold">
						{children}
					</Link>
				)
			}
			return (
				<a href={href} className="text-amber-700 hover:text-amber-800">
					{children}
				</a>
			)
		},
	},
}

interface LegalPageLayoutProps {
	title: string
	lastUpdated?: string
	content: any[]
}

export default function LegalPageLayout({ title, lastUpdated, content }: LegalPageLayoutProps) {
	const formattedDate = lastUpdated
		? new Date(lastUpdated).toLocaleDateString('pl-PL', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			})
		: null

	return (
		<>
			<nav className="bg-gray-950 text-white" aria-label="Nawigacja powrót">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<Link
						href="/"
						className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-semibold w-fit">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Strona główna
					</Link>
				</div>
			</nav>

			<main className="bg-[#f7f6f3] min-h-screen py-16 sm:py-24">
				<article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">{title}</h1>
					{formattedDate && <p className="text-sm text-gray-500 mb-10">Ostatnia aktualizacja: {formattedDate}</p>}

					<div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
						<PortableText value={content} components={portableTextComponents} />
					</div>

					<div className="mt-12 pt-8 border-t border-gray-200">
						<Link href="/" className="text-amber-700 hover:text-amber-800 font-semibold transition-colors">
							← Wróć na stronę główną
						</Link>
					</div>
				</article>
			</main>

			<footer className="bg-gray-950 text-gray-400 text-center py-8 text-sm">
				<p>&copy; {new Date().getFullYear()} Elektryk Majkel. Wszelkie prawa zastrzeżone.</p>
			</footer>
		</>
	)
}
