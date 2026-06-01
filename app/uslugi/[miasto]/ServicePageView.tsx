import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SanityServicePage, getContactInfo, getSeoSettings, getBlogPosts } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import dynamic from 'next/dynamic'

const BlogSlider = dynamic(() => import('@/components/BlogSlider'))

export default async function ServicePageView({ page }: { page: SanityServicePage }) {
	const [contactInfo, seoSettings, blogPosts] = await Promise.all([
		getContactInfo().catch(() => null),
		getSeoSettings().catch(() => null),
		getBlogPosts().catch(() => []),
	])

	const phone = contactInfo?.phone || '+48 537 751 820'
	const email = contactInfo?.email || 'elektryk.majkel@gmail.com'
	const phoneHref = `tel:${phone.replace(/\s/g, '')}`
	const businessName = seoSettings?.businessName || 'Elektryk Majkel'

	// Pre-build blog image URLs
	const blogImageUrls: Record<string, string> = {}
	for (const post of blogPosts) {
		if (post.coverImage?.asset) {
			blogImageUrls[post._id] = urlFor(post.coverImage).width(800).height(500).url()
		}
	}

	const heroImageUrl = page.heroImage?.asset
		? urlFor(page.heroImage).width(1200).height(600).url()
		: null

	// JSON-LD Service schema
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Service',
		name: page.title,
		description: page.metaDescription || page.intro,
		url: `https://elektrykmajkel.pl/uslugi/${page.slug.current}`,
		provider: {
			'@type': 'Electrician',
			name: businessName,
			url: 'https://elektrykmajkel.pl',
			telephone: phone,
			email,
			areaServed: [
				{ '@type': 'City', name: 'Stalowa Wola' },
				{ '@type': 'City', name: 'Sandomierz' },
				{ '@type': 'City', name: 'Nisko' },
				{ '@type': 'City', name: 'Radomyśl nad Sanem' },
				{ '@type': 'City', name: 'Tarnobrzeg' },
			],
		},
		...(page.heroImage?.asset && {
			image: urlFor(page.heroImage).width(1200).height(630).url(),
		}),
	}

	// FAQ JSON-LD
	const faqJsonLd = page.faq?.length
		? {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: page.faq.map(f => ({
					'@type': 'Question',
					name: f.question,
					acceptedAnswer: { '@type': 'Answer', text: f.answer },
				})),
			}
		: null

	// BreadcrumbList JSON-LD
	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://elektrykmajkel.pl' },
			{ '@type': 'ListItem', position: 2, name: 'Usługi', item: 'https://elektrykmajkel.pl/#uslugi' },
			{
				'@type': 'ListItem',
				position: 3,
				name: page.title,
				item: `https://elektrykmajkel.pl/uslugi/${page.slug.current}`,
			},
		],
	}

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
			{faqJsonLd && (
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
			)}

			{/* Navigation bar */}
			<nav className="bg-gray-950 text-white" aria-label="Nawigacja powrót">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
					<Link
						href="/"
						className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors font-semibold">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						Strona główna
					</Link>
					<a
						href={phoneHref}
						className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-4 py-2 rounded-lg transition-colors text-sm inline-flex items-center gap-1.5">
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
							/>
						</svg>
						Zadzwoń
					</a>
				</div>
			</nav>

			<main className="bg-[#f7f6f3] min-h-screen">
				{/* Hero section */}
				<section className="relative bg-gray-900 text-white overflow-hidden">
					{heroImageUrl && (
						<div className="absolute inset-0">
							<Image
								src={heroImageUrl}
								alt={page.heroImage?.alt || page.title}
								fill
								className="object-cover opacity-25"
								priority
								sizes="100vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-b from-gray-900/60 to-gray-900/90" />
						</div>
					)}
					<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
						<div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
							{page.heroBadge || 'Stalowa Wola • Sandomierz • Nisko i okolice'}
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{page.title}</h1>
						<p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">{page.intro}</p>
						<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href={phoneHref}
								className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-8 py-3.5 rounded-xl transition-colors text-lg shadow-lg shadow-amber-500/25 inline-flex items-center justify-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
									/>
								</svg>
								{phone}
							</a>
							<Link
								href="/#kontakt"
								className="border-2 border-white/30 hover:border-amber-400 hover:text-amber-400 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
								{page.heroCtaSecondary || 'Bezpłatna wycena'}
							</Link>
						</div>
					</div>
				</section>

				{/* Korzyści — Dlaczego warto */}
				{page.benefits && page.benefits.length > 0 && (
					<section className="py-16 sm:py-20">
						<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="text-center mb-12">
								<span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">
									{page.benefitsLabel || 'Dlaczego my'}
								</span>
								<h2 className="text-2xl sm:text-3xl font-bold mt-3">
									{page.benefitsHeading ? (
										<>{page.benefitsHeading}</>
									) : (
										<>Dlaczego warto wybrać{' '}
											<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
												Elektryka Majkla
											</span>
											?
										</>
									)}
								</h2>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
								{page.benefits.map((benefit, i) => (
									<div
										key={i}
										className="flex gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all">
										<div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
											<svg
												className="w-6 h-6"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<div>
											<h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
											<p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Jak działamy — indywidualna ścieżka procesu */}
				{page.howWeWork && page.howWeWork.length > 0 && (
					<section className="bg-gray-950 py-20 sm:py-28 overflow-hidden">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="text-center mb-16">
								<span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">
									{page.howWeWorkLabel || 'Proces realizacji'}
								</span>
								<h2 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-4 text-white">
									{page.howWeWorkHeading ? (
										<>{page.howWeWorkHeading}</>
									) : (
										<>Jak wygląda{' '}
											<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
												nasza praca
											</span>
											?
										</>
									)}
								</h2>
								<p className="text-gray-400 max-w-2xl mx-auto text-lg">
									{page.howWeWorkDescription || 'Przejrzysty proces od zgłoszenia do gotowego efektu — bez niespodzianek.'}
								</p>
							</div>

							{/* Sequential animation: squares pulse → arrows draw in → all arrows vanish after last square → loop */}
							<style>{`
								@media(min-width:1024px){
									[data-hw-sep]{display:flex!important}
									[data-hw-sep-mob]{display:none!important}
									[data-hw-arrow] .hw-line,[data-hw-arrow] .hw-head{opacity:0}
									${(() => {
										const n = page.howWeWork!.length
										// Each step pulse = 1.2s, each arrow draw = 0.8s, reset phase = 0.8s
										const totalDur = n * 1.2 + (n - 1) * 0.8 + 0.8
										let css = ''

										// Per-step pulse keyframes
										for (let i = 0; i < n; i++) {
											const t = (s: number) => (s / totalDur * 100).toFixed(1)
											const pulseStart = i * 2.0
											const pulseMid = pulseStart + 0.6
											const pulseEnd = pulseStart + 1.2
											const idle = 'transform:scale(1);border-color:rgba(245,158,11,0.2);background:rgba(245,158,11,0.1);box-shadow:none'
											const active = 'transform:scale(1.15);border-color:rgba(245,158,11,0.6);background:rgba(245,158,11,0.25);box-shadow:0 0 20px rgba(245,158,11,0.3)'
											css += `@keyframes hw-p${i}{0%,${t(pulseStart)}%{${idle}}${t(pulseMid)}%{${active}}${t(pulseEnd)}%,100%{${idle}}}`
											css += `[data-hw-step="${i}"] .hw-icon{animation:hw-p${i} ${totalDur}s ease-in-out infinite}`
										}

										// Per-arrow keyframes: invisible → draw in → stay visible → vanish at reset
										const resetStart = n * 1.2 + (n - 1) * 0.8  // right after last step pulse ends
										const resetEnd = totalDur                     // end of cycle

										for (let i = 0; i < n - 1; i++) {
											const t = (s: number) => (s / totalDur * 100).toFixed(1)
											const drawStart = i * 2.0 + 1.2           // after step i pulse
											const drawEnd = drawStart + 0.8

											// Line: invisible → dashoffset 40→0 + opacity 0→1 → stays → fades at reset
											css += `@keyframes hw-l${i}{`
											css += `0%,${t(drawStart)}%{stroke-dashoffset:40;opacity:0}`
											css += `${t(drawEnd)}%{stroke-dashoffset:0;opacity:1}`
											css += `${t(resetStart)}%{stroke-dashoffset:0;opacity:1}`
											css += `${t(resetStart + 0.3)}%{stroke-dashoffset:0;opacity:0}`
											css += `100%{stroke-dashoffset:40;opacity:0}}`
											css += `[data-hw-arrow="${i}"] .hw-line{animation:hw-l${i} ${totalDur}s ease-in-out infinite}`

											// Arrow head: invisible → fade in → stays → fades at reset
											css += `@keyframes hw-h${i}{`
											css += `0%,${t(drawStart + 0.3)}%{opacity:0}`
											css += `${t(drawEnd)}%{opacity:1}`
											css += `${t(resetStart)}%{opacity:1}`
											css += `${t(resetStart + 0.3)}%{opacity:0}`
											css += `100%{opacity:0}}`
											css += `[data-hw-arrow="${i}"] .hw-head{animation:hw-h${i} ${totalDur}s ease-in-out infinite}`
										}

										return css
									})()}
								}
							`}</style>

							<div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-0">
								{page.howWeWork.map((step, i) => {
									const stepIcons = [
										<svg key="i1" className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>,
										<svg key="i2" className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
										<svg key="i3" className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" /></svg>,
										<svg key="i4" className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
										<svg key="i5" className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
									]

									return (
										<React.Fragment key={i}>
											{/* Step card */}
											<div data-hw-step={i} className="group text-center flex-1 min-w-0">
												<div className="relative inline-flex flex-col items-center">
													<div className="hw-icon w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 transition-all duration-300">
														{stepIcons[i % stepIcons.length]}
													</div>
													<span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 text-gray-950 rounded-full text-xs font-bold flex items-center justify-center shadow-lg shadow-amber-500/30">
														{String(i + 1).padStart(2, '0')}
													</span>
												</div>
												<h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
													{step.title}
												</h3>
												<p className="text-gray-400 text-sm leading-relaxed max-w-[260px] mx-auto">
													{step.description}
												</p>
											</div>

											{/* Separator between steps */}
											{i < page.howWeWork!.length - 1 && (
												<>
													{/* Desktop: animated dashed arrow */}
													<div
														data-hw-sep=""
														data-hw-arrow={i}
														className="items-center shrink-0"
														style={{ display: 'none', paddingTop: '2rem' }}
													>
														<svg width="40" height="12" viewBox="0 0 40 12" fill="none" style={{ overflow: 'visible' }}>
															<line className="hw-line" x1="0" y1="6" x2="30" y2="6" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" strokeDashoffset="40" style={{ opacity: 0 }} />
															<path className="hw-head" d="M28 2l6 4-6 4" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ opacity: 0 }} />
														</svg>
													</div>
													{/* Mobile: vertical dashed line + arrow */}
													<div data-hw-sep-mob="" className="flex flex-col items-center">
														<div className="h-6" style={{ borderLeft: '2px dashed rgba(245,158,11,0.3)' }} />
														<svg className="w-4 h-4 -mt-0.5" style={{ color: '#f59e0b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
														</svg>
													</div>
												</>
											)}
										</React.Fragment>
									)
								})}
							</div>
						</div>
					</section>
				)}

				{/* Galeria zdjęć — rozmieszczona w ciekawy sposób */}
				{page.galleryImages && page.galleryImages.length > 0 && (
					<section className="py-16 sm:py-20 bg-[#f3f2ef]">
						<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
							<h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
								{page.galleryHeading ? (
									<>{page.galleryHeading}</>
								) : (
									<>Nasze{' '}
										<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
											realizacje
										</span>
									</>
								)}
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{page.galleryImages.map((img, i) => {
									const imgUrl = urlFor(img).width(600).height(400).url()
									const isLarge = i === 0 || i === 3
									return (
										<figure
											key={i}
											className={`relative overflow-hidden rounded-2xl shadow-md group ${
												isLarge ? 'sm:col-span-2 sm:row-span-2' : ''
											}`}>
											<Image
												src={imgUrl}
												alt={img.alt || `${page.title} - realizacja ${i + 1}`}
												width={isLarge ? 800 : 600}
												height={isLarge ? 600 : 400}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												sizes={isLarge ? '(max-width: 640px) 100vw, 66vw' : '(max-width: 640px) 100vw, 33vw'}
											/>
											{img.caption && (
												<figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
													{img.caption}
												</figcaption>
											)}
										</figure>
									)
								})}
							</div>
						</div>
					</section>
				)}

				{/* Zakres usługi */}
				{page.scopeItems && page.scopeItems.length > 0 && (
					<section className="py-16 sm:py-20">
						<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="text-center mb-12">
								<span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">{page.scopeLabel || 'Szczegóły'}</span>
								<h2 className="text-2xl sm:text-3xl font-bold mt-3">
									{page.scopeHeading ? (
										<>{page.scopeHeading}</>
									) : (
										<>Co wchodzi w{' '}
											<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
												zakres usługi
											</span>
											?
										</>
									)}
								</h2>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
								{page.scopeItems.map((item, i) => (
									<div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
										<div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
											<svg
												className="w-3.5 h-3.5 text-amber-600"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2.5}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										</div>
										<span className="text-gray-700 font-medium">{item}</span>
									</div>
								))}
							</div>
						</div>
					</section>
				)}

				{/* CTA */}
				<section className="py-16 sm:py-20 bg-gray-900 text-white text-center">
					<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-2xl sm:text-3xl font-bold mb-4">
							{page.ctaHeading ? (
								<>{page.ctaHeading}</>
							) : (
								<>Potrzebujesz pomocy z{' '}
									<span className="text-amber-400">{page.title.toLowerCase()}</span>?
								</>
							)}
						</h2>
						<p className="text-gray-300 mb-8 text-lg">
							{page.ctaDescription || 'Skontaktuj się z nami — wycena gratis! Działamy w Stalowej Woli, Sandomierzu, Nisku i okolicach.'}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href={phoneHref}
								className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-8 py-4 rounded-xl transition-colors text-lg shadow-lg shadow-amber-500/25 inline-flex items-center justify-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
									/>
								</svg>
								Zadzwoń: {phone}
							</a>
							<a
								href={`mailto:${email}`}
								className="border-2 border-white/30 hover:border-amber-400 hover:text-amber-400 font-semibold px-8 py-4 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
									/>
								</svg>
								{email}
							</a>
						</div>
					</div>
				</section>

				{/* Blog slider */}
				{blogPosts.length > 0 && <BlogSlider posts={blogPosts} imageUrls={blogImageUrls} />}

				{/* FAQ */}
				{page.faq && page.faq.length > 0 && (
					<section className="py-16 sm:py-20 bg-[#f3f2ef]">
						<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
							<h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
								{page.faqHeading ? (
									<>{page.faqHeading}</>
								) : (
									<>Najczęściej zadawane{' '}
										<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
											pytania
										</span>
									</>
								)}
							</h2>
							<p className="text-gray-600 text-center mb-10">{page.faqDescription || `${page.title} — odpowiedzi na ważne pytania`}</p>
							<div className="space-y-3">
								{page.faq.map((faq, i) => (
									<details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
										<summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:text-amber-700 transition-colors list-none [&::-webkit-details-marker]:hidden">
											<span>{faq.question}</span>
											<svg
												className="w-5 h-5 text-amber-500 shrink-0 transition-transform group-open:rotate-180"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</svg>
										</summary>
										<div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
											{faq.answer}
										</div>
									</details>
								))}
							</div>
						</div>
					</section>
				)}

				{/* Breadcrumb / Back link */}
				<section className="py-8 bg-[#f7f6f3]">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<nav aria-label="Breadcrumb" className="text-sm text-gray-500">
							<ol className="flex items-center gap-2">
								<li>
									<Link href="/" className="hover:text-amber-700 transition-colors">
										Strona główna
									</Link>
								</li>
								<li aria-hidden="true">/</li>
								<li>
									<Link href="/#uslugi" className="hover:text-amber-700 transition-colors">
										Usługi
									</Link>
								</li>
								<li aria-hidden="true">/</li>
								<li>
									<span className="text-gray-700 font-medium">{page.title}</span>
								</li>
							</ol>
						</nav>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="bg-gray-950 text-gray-400 text-center py-8 text-sm">
				<p>
					&copy; {new Date().getFullYear()} {businessName}. Wszelkie prawa zastrzeżone.
				</p>
				<p className="mt-2">
					<Link href="/" className="hover:text-amber-400 transition-colors">
						← Wróć na stronę główną
					</Link>
				</p>
			</footer>
		</>
	)
}
