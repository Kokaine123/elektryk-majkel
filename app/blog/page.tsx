import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'

export const metadata: Metadata = {
	title: 'Blog | Elektryk Majkel — Porady i Realizacje',
	description:
		'Porady elektryka SEP: instalacje, awarie, modernizacje, bramy automatyczne i smart home. Praktyczne wskazówki dla właścicieli domów i firm.',
	alternates: {
		canonical: 'https://elektrykmajkel.pl/blog',
	},
	openGraph: {
		title: 'Blog | Elektryk Majkel',
		description: 'Porady elektryczne, realizacje i aktualności od elektryka SEP.',
		type: 'website',
		locale: 'pl_PL',
		url: 'https://elektrykmajkel.pl/blog',
		siteName: 'Elektryk Majkel',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Blog | Elektryk Majkel',
		description: 'Porady elektryczne, realizacje i aktualności od elektryka SEP.',
	},
}

const categoryLabels: Record<string, string> = {
	instalacje: 'Instalacje',
	naprawy: 'Naprawy',
	bramy: 'Bramy automatyczne',
	'smart-home': 'Smart Home',
	oswietlenie: 'Oświetlenie',
	porady: 'Porady',
}

export default async function BlogPage() {
	const posts = await getBlogPosts().catch(() => [])
	const blogSchema =
		posts.length > 0
			? {
					'@context': 'https://schema.org',
					'@type': 'Blog',
					name: 'Blog Elektryk Majkel',
					url: 'https://elektrykmajkel.pl/blog',
					description:
						'Porady i aktualności o instalacjach elektrycznych, awariach, smart home oraz realizacjach.',
					publisher: {
						'@type': 'Organization',
						name: 'Elektryk Majkel',
						url: 'https://elektrykmajkel.pl',
					},
				}
			: null

	const itemListSchema =
		posts.length > 0
			? {
					'@context': 'https://schema.org',
					'@type': 'ItemList',
					itemListElement: posts.map((post, index) => ({
						'@type': 'ListItem',
						position: index + 1,
						url: `https://elektrykmajkel.pl/blog/${post.slug.current}`,
						name: post.title,
					})),
				}
			: null

	return (
		<>
			{blogSchema && (
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
			)}
			{itemListSchema && (
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
			)}
			{/* Navigation */}
			<nav className="bg-gray-950 text-white" aria-label="Nawigacja">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
					<Link
						href="/"
						className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-semibold">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Strona główna
					</Link>
				</div>
			</nav>

			<main className="bg-[#f7f6f3] min-h-screen">
				{/* Header */}
				<section className="bg-gray-900 text-white py-16 sm:py-20">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Blog</span>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-3 mb-4">
							Porady i{' '}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
								Realizacje
							</span>
						</h1>
						<p className="text-lg text-gray-300 max-w-2xl mx-auto">
							Praktyczna wiedza o instalacjach elektrycznych, bramach automatycznych i smart home.
						</p>
					</div>
				</section>

				{/* Posts grid */}
				<section className="py-16 sm:py-20">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						{posts.length === 0 ? (
							<p className="text-center text-gray-500 text-lg">Wkrótce pojawią się nowe wpisy.</p>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{posts.map(post => (
									<Link
										key={post._id}
										href={`/blog/${post.slug.current}`}
										className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:border-amber-200 transition-all">
										{post.coverImage?.asset && (
											<div className="relative aspect-[16/10] overflow-hidden">
												<Image
													src={urlFor(post.coverImage).width(600).height(375).url()}
													alt={post.coverImage.alt || post.title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-300"
												/>
											</div>
										)}
										<div className="p-6">
											<div className="flex items-center gap-3 mb-3">
												<span className="text-xs bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-0.5 rounded-full font-medium">
													{categoryLabels[post.category] || post.category}
												</span>
												<time className="text-xs text-gray-400" dateTime={post.publishedAt}>
													{new Date(post.publishedAt).toLocaleDateString('pl-PL', {
														year: 'numeric',
														month: 'long',
														day: 'numeric',
													})}
												</time>
											</div>
											<h2 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-2 line-clamp-2">
												{post.title}
											</h2>
											<p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
											<span className="inline-flex items-center gap-1 text-amber-600 font-semibold text-sm mt-4 group-hover:gap-2 transition-all">
												Czytaj więcej
												<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
												</svg>
											</span>
										</div>
									</Link>
								))}
							</div>
						)}
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-gray-950 text-gray-400 text-center py-8 text-sm">
				<p>&copy; {new Date().getFullYear()} Elektryk Majkel. Wszelkie prawa zastrzeżone.</p>
				<p className="mt-2">
					<Link href="/" className="hover:text-amber-400 transition-colors">
						← Wróć na stronę główną
					</Link>
				</p>
			</footer>
		</>
	)
}
