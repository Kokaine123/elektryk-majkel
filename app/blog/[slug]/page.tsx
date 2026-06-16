import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { getBlogPostBySlug, getAllBlogSlugs, getRelatedBlogPosts } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'

// ─── Static generation ───────────────────────────────────
export async function generateStaticParams() {
	const slugs = await getAllBlogSlugs()
	return slugs.map(slug => ({ slug }))
}

// ─── Dynamic metadata ────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params
	const post = await getBlogPostBySlug(slug)
	if (!post) return { title: 'Nie znaleziono wpisu', robots: { index: false, follow: false } }

	const title = post.metaTitle || `${post.title} | Blog Elektryk Majkel`
	const description =
		post.metaDescription ||
		`${post.excerpt.slice(0, 130).trim()} — praktyczne wskazówki od Elektryk Majkel.`

	return {
		title,
		description,
		alternates: {
			canonical: `https://elektrykmajkel.pl/blog/${slug}`,
		},
		openGraph: {
			title,
			description,
			type: 'article',
			locale: 'pl_PL',
			url: `https://elektrykmajkel.pl/blog/${slug}`,
			siteName: 'Elektryk Majkel',
			publishedTime: post.publishedAt,
			...(post.coverImage?.asset && {
				images: [
					{
						url: urlFor(post.coverImage).width(1200).height(630).url(),
						width: 1200,
						height: 630,
						alt: post.coverImage.alt || post.title,
					},
				],
			}),
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
		},
		robots: { index: true, follow: true },
	}
}

const categoryLabels: Record<string, string> = {
	instalacje: 'Instalacje',
	naprawy: 'Naprawy',
	bramy: 'Bramy automatyczne',
	'smart-home': 'Smart Home',
	oswietlenie: 'Oświetlenie',
	porady: 'Porady',
}

// ─── Portable Text components for rich content ───────────
const portableTextComponents = {
	types: {
		image: ({ value }: { value: { asset: { _ref: string }; alt?: string; caption?: string } }) => (
			<figure className="my-8">
				<div className="relative aspect-[16/10] rounded-xl overflow-hidden">
					<Image src={urlFor(value).width(900).height(563).url()} alt={value.alt || ''} fill className="object-cover" />
				</div>
				{value.caption && <figcaption className="text-center text-sm text-gray-500 mt-3">{value.caption}</figcaption>}
			</figure>
		),
	},
	block: {
		h2: ({ children }: { children?: React.ReactNode }) => (
			<h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>
		),
		h3: ({ children }: { children?: React.ReactNode }) => (
			<h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-3">{children}</h3>
		),
		blockquote: ({ children }: { children?: React.ReactNode }) => (
			<div className="border-l-4 border-amber-500 pl-4 my-6 text-gray-700 italic">{children}</div>
		),
		normal: ({ children }: { children?: React.ReactNode }) => (
			<p className="text-gray-700 leading-relaxed mb-4">{children}</p>
		),
	},
}

// ─── Page component ──────────────────────────────────────
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	const post = await getBlogPostBySlug(slug)
	if (!post) notFound()

	const relatedPosts = await getRelatedBlogPosts(slug, post.category)

	const publishDate = new Date(post.publishedAt).toLocaleDateString('pl-PL', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	// Article JSON-LD
	const articleJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: post.title,
		description: post.excerpt,
		datePublished: post.publishedAt,
		author: {
			'@type': 'Person',
			name: 'Elektryk Majkel',
			url: 'https://elektrykmajkel.pl',
		},
		publisher: {
			'@type': 'Organization',
			name: 'Elektryk Majkel',
			url: 'https://elektrykmajkel.pl',
		},
		mainEntityOfPage: `https://elektrykmajkel.pl/blog/${slug}`,
		...(post.coverImage?.asset && {
			image: urlFor(post.coverImage).width(1200).height(630).url(),
		}),
	}

	// BreadcrumbList JSON-LD
	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://elektrykmajkel.pl' },
			{ '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://elektrykmajkel.pl/blog' },
			{
				'@type': 'ListItem',
				position: 3,
				name: post.title,
				item: `https://elektrykmajkel.pl/blog/${slug}`,
			},
		],
	}

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

			{/* Navigation */}
			<nav className="bg-gray-950 text-white" aria-label="Nawigacja">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
					<Link
						href="/blog"
						className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-semibold">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Blog
					</Link>
					<Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">
						Strona główna
					</Link>
				</div>
			</nav>

			<main className="bg-[#f7f6f3] min-h-screen">
				{/* Cover image */}
				{post.coverImage?.asset && (
					<div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
						<Image
							src={urlFor(post.coverImage).width(1600).height(600).url()}
							alt={post.coverImage.alt || post.title}
							fill
							className="object-cover"
							priority
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
					</div>
				)}

				{/* Article */}
				<article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
					<div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
						{/* Meta */}
						<div className="flex items-center gap-3 mb-6">
							<span className="text-xs bg-amber-50 text-amber-700 border border-amber-200/60 px-3 py-1 rounded-full font-medium">
								{categoryLabels[post.category] || post.category}
							</span>
							<time className="text-sm text-gray-400" dateTime={post.publishedAt}>
								{publishDate}
							</time>
						</div>

						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>

						<p className="text-lg text-gray-600 mb-8 leading-relaxed border-b border-gray-100 pb-8">{post.excerpt}</p>

						{/* Content */}
						{post.content && (
							<div className="prose-custom">
								<PortableText value={post.content} components={portableTextComponents} />
							</div>
						)}

						{/* CTA */}
						<div className="mt-12 pt-8 border-t border-gray-100 bg-amber-50/50 -mx-8 sm:-mx-12 -mb-8 sm:-mb-12 px-8 sm:px-12 pb-8 sm:pb-12 rounded-b-2xl">
							<h3 className="text-xl font-bold text-gray-900 mb-2">Potrzebujesz elektryka?</h3>
							<p className="text-gray-600 mb-4">
								Montaż, naprawa, przegląd — skontaktuj się z nami po bezpłatną wycenę.
							</p>
							<div className="flex flex-col sm:flex-row gap-3">
								<a
									href="tel:+48537751820"
									className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-6 py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
										/>
									</svg>
									+48 537 751 820
								</a>
								<Link
									href="/#kontakt"
									className="border-2 border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-gray-950 font-semibold px-6 py-3 rounded-xl transition-colors text-center">
									Formularz kontaktowy
								</Link>
							</div>
						</div>
					</div>
				</article>

				{/* Breadcrumb */}
				<section className="py-8">
					<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
						<nav aria-label="Breadcrumb" className="text-sm text-gray-500">
							<ol className="flex items-center gap-2">
								<li>
									<Link href="/" className="hover:text-amber-700 transition-colors">
										Strona główna
									</Link>
								</li>
								<li aria-hidden="true">/</li>
								<li>
									<Link href="/blog" className="hover:text-amber-700 transition-colors">
										Blog
									</Link>
								</li>
								<li aria-hidden="true">/</li>
								<li className="text-gray-700 font-medium truncate max-w-[200px]">{post.title}</li>
							</ol>
						</nav>
					</div>
				</section>

				{/* Related posts */}
				{relatedPosts.length > 0 && (
					<section className="pb-16">
						<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
							<h2 className="text-2xl font-bold text-gray-900 mb-8">Przeczytaj również</h2>
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{relatedPosts.map(rp => (
									<Link
										key={rp._id}
										href={`/blog/${rp.slug.current}`}
										className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
										{rp.coverImage?.asset ? (
											<div className="relative h-44 overflow-hidden">
												<Image
													src={urlFor(rp.coverImage).width(500).height(280).url()}
													alt={rp.coverImage.alt || rp.title}
													fill
													className="object-cover group-hover:scale-105 transition-transform duration-500"
												/>
											</div>
										) : (
											<div className="h-44 bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
												<svg className="w-12 h-12 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
													/>
												</svg>
											</div>
										)}
										<div className="p-5">
											<span className="text-xs text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full font-medium">
												{categoryLabels[rp.category] || rp.category}
											</span>
											<h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors line-clamp-2">
												{rp.title}
											</h3>
											<p className="mt-2 text-sm text-gray-500 line-clamp-2">{rp.excerpt}</p>
										</div>
									</Link>
								))}
							</div>
						</div>
					</section>
				)}
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
