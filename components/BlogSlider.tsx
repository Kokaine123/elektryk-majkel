'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface BlogPost {
	_id: string
	title: string
	slug: { current: string }
	excerpt: string
	coverImage?: {
		asset: { _ref: string }
		alt?: string
	}
	publishedAt: string
	category: string
}

const categoryLabels: Record<string, string> = {
	instalacje: 'Instalacje',
	naprawy: 'Naprawy',
	bramy: 'Bramy automatyczne',
	'smart-home': 'Smart Home',
	oswietlenie: 'Oświetlenie',
	porady: 'Porady',
}

export default function BlogSlider({ posts, imageUrls }: { posts: BlogPost[]; imageUrls: Record<string, string> }) {
	const [current, setCurrent] = useState(0)
	const [paused, setPaused] = useState(false)
	const total = posts.length

	const next = useCallback(() => setCurrent(i => (i + 1) % total), [total])
	const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total])

	// Auto-slide every 5s
	useEffect(() => {
		if (paused || total <= 1) return
		const timer = setInterval(next, 5000)
		return () => clearInterval(timer)
	}, [paused, next, total])

	if (posts.length === 0) return null

	const post = posts[current]
	const imgUrl = imageUrls[post._id]

	return (
		<section id="blog" aria-label="Blog" className="py-24 bg-[#faf9f6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section header */}
				<div className="text-center mb-12">
					<span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Blog</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4">
						Porady i{' '}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
							Aktualności
						</span>
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto text-lg">
						Praktyczna wiedza o instalacjach elektrycznych, bramach automatycznych i nie tylko.
					</p>
				</div>

				{/* Slider */}
				<div
					className="relative bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
					onMouseEnter={() => setPaused(true)}
					onMouseLeave={() => setPaused(false)}>
					<div className="grid grid-cols-1 lg:grid-cols-2">
						{/* Image */}
						<div className="relative h-64 sm:h-80 lg:h-full lg:min-h-[400px]">
							{imgUrl ? (
								<Image
									src={imgUrl}
									alt={post.coverImage?.alt || post.title}
									fill
									className="object-cover transition-opacity duration-500"
									sizes="(max-width: 1024px) 100vw, 50vw"
								/>
							) : (
								<div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
									<svg className="w-16 h-16 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
								</div>
							)}
							{/* Category badge */}
							<div className="absolute top-4 left-4">
								<span className="text-xs bg-amber-500 text-white px-3 py-1 rounded-full font-semibold shadow-sm">
									{categoryLabels[post.category] || post.category}
								</span>
							</div>
						</div>

						{/* Content */}
						<div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
							<time className="text-sm text-gray-400 mb-3" dateTime={post.publishedAt}>
								{new Date(post.publishedAt).toLocaleDateString('pl-PL', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</time>
							<h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">{post.title}</h3>
							<p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
							<Link
								href={`/blog/${post.slug.current}`}
								className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors group w-fit">
								Czytaj więcej
								<svg
									className="w-4 h-4 group-hover:translate-x-1 transition-transform"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</Link>
						</div>
					</div>

					{/* Navigation arrows */}
					{total > 1 && (
						<>
							<button
								onClick={prev}
								aria-label="Poprzedni wpis"
								className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-amber-600 hover:bg-white shadow-sm transition-all cursor-pointer">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<button
								onClick={next}
								aria-label="Następny wpis"
								className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-amber-600 hover:bg-white shadow-sm transition-all cursor-pointer">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</>
					)}
				</div>

				{/* Dots indicator + CTA */}
				<div className="flex items-center justify-between mt-6">
					{/* Dots */}
					{total > 1 ? (
						<div className="flex gap-2">
							{posts.map((p, i) => (
								<button
									key={p._id}
									onClick={() => setCurrent(i)}
									aria-label={`Przejdź do wpisu ${i + 1}`}
									className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
										i === current ? 'w-8 bg-amber-500' : 'w-2 bg-gray-300 hover:bg-amber-300'
									}`}
								/>
							))}
						</div>
					) : (
						<div />
					)}

					<Link
						href="/blog"
						className="inline-flex items-center gap-2 text-gray-600 hover:text-amber-600 font-medium text-sm transition-colors group">
						Wszystkie wpisy
						<svg
							className="w-4 h-4 group-hover:translate-x-1 transition-transform"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</Link>
				</div>
			</div>
		</section>
	)
}
