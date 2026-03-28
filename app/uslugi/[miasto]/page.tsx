import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCityBySlug, getAllCitySlugs, getServices, getContactInfo, getSeoSettings } from '@/lib/queries'

// ─── Static generation for all cities ────────────────────
export async function generateStaticParams() {
	const slugs = await getAllCitySlugs()
	return slugs.map(slug => ({
		miasto: `elektryk-${slug}`,
	}))
}

// ─── Dynamic metadata per city ───────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ miasto: string }> }): Promise<Metadata> {
	const { miasto } = await params
	const slug = miasto.replace(/^elektryk-/, '')
	const city = await getCityBySlug(slug)

	if (!city) {
		return { title: 'Nie znaleziono miasta' }
	}

	const title = city.metaTitle || `Elektryk ${city.name} - Usługi Elektryczne | Elektryk Majkel`
	const description =
		city.metaDescription ||
		`Profesjonalne usługi elektryczne w mieście ${city.name}. Instalacje, naprawy, modernizacje. Certyfikowany elektryk SEP. Dojazd z Radomyśla nad Sanem.`

	const keywords = [
		`elektryk ${city.name}`,
		`usługi elektryczne ${city.name}`,
		`instalacje elektryczne ${city.name}`,
		`elektryk awaryjny ${city.name}`,
		`naprawa instalacji ${city.name}`,
		`pomiary elektryczne ${city.name}`,
		`modernizacja instalacji ${city.name}`,
		`elektryk z dojazdem ${city.name}`,
		`podłączenie AGD ${city.name}`,
		`oświetlenie LED ${city.name}`,
		'elektryk Radomyśl nad Sanem',
		'certyfikowany elektryk SEP',
		'usługi elektryczne podkarpackie',
	]

	return {
		title,
		description,
		keywords,
		alternates: {
			canonical: `https://elektrykmajkel.pl/uslugi/elektryk-${slug}`,
		},
		openGraph: {
			title,
			description,
			type: 'website',
			locale: 'pl_PL',
			url: `https://elektrykmajkel.pl/uslugi/elektryk-${slug}`,
			siteName: 'Elektryk Majkel',
		},
		robots: { index: true, follow: true },
	}
}

// ─── Page component ──────────────────────────────────────
export default async function CityPage({ params }: { params: Promise<{ miasto: string }> }) {
	const { miasto } = await params
	const slug = miasto.replace(/^elektryk-/, '')
	const [city, services, contactInfo, seoSettings] = await Promise.all([
		getCityBySlug(slug).catch(() => null),
		getServices().catch(() => []),
		getContactInfo().catch(() => null),
		getSeoSettings().catch(() => null),
	])

	if (!city) notFound()

	const phone = contactInfo?.phone || '+48 537 751 820'
	const email = contactInfo?.email || 'elektryk.majkel@gmail.com'
	const phoneHref = `tel:${phone.replace(/\s/g, '')}`
	const businessName = seoSettings?.businessName || 'Elektryk Majkel'
	const heading = city.pageHeading || `Elektryk ${city.name}`
	const distanceText = city.distanceKm ? `${city.distanceKm} km od Radomyśla nad Sanem` : null

	const description =
		city.pageDescription ||
		`Szukasz zaufanego elektryka w mieście ${city.name}? ${businessName} oferuje profesjonalne usługi elektryczne z dojazdem do ${city.name}${distanceText ? ` (${distanceText})` : ''}. Posiadamy uprawnienia SEP i gwarantujemy solidne wykonanie każdego zlecenia.`

	// JSON-LD for this city
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Electrician',
		name: `${businessName} - ${city.name}`,
		description,
		url: `https://elektrykmajkel.pl/uslugi/elektryk-${slug}`,
		telephone: phone,
		email,
		address: {
			'@type': 'PostalAddress',
			addressLocality: city.name,
			addressCountry: 'PL',
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: city.lat,
			longitude: city.lng,
		},
		areaServed: {
			'@type': 'City',
			name: city.name,
		},
		openingHoursSpecification: seoSettings?.openingHours?.length
			? seoSettings.openingHours.map((h: { days?: string[]; opens?: string; closes?: string }) => ({
					'@type': 'OpeningHoursSpecification',
					dayOfWeek: h.days || [],
					opens: h.opens || '07:00',
					closes: h.closes || '18:00',
				}))
			: [
					{
						'@type': 'OpeningHoursSpecification',
						dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
						opens: '07:00',
						closes: '18:00',
					},
					{
						'@type': 'OpeningHoursSpecification',
						dayOfWeek: 'Saturday',
						opens: '08:00',
						closes: '14:00',
					},
				],
		hasOfferCatalog:
			services.length > 0
				? {
						'@type': 'OfferCatalog',
						name: `Usługi elektryczne - ${city.name}`,
						itemListElement: services.map(s => ({
							'@type': 'Offer',
							itemOffered: {
								'@type': 'Service',
								name: s.title,
								description: s.description,
								areaServed: { '@type': 'City', name: city.name },
								provider: { '@type': 'Electrician', name: businessName },
							},
						})),
					}
				: undefined,
		parentOrganization: {
			'@type': 'Electrician',
			name: businessName,
			url: 'https://elektrykmajkel.pl',
		},
	}

	// BreadcrumbList JSON-LD
	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Strona główna',
				item: 'https://elektrykmajkel.pl',
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: 'Usługi',
				item: 'https://elektrykmajkel.pl/#uslugi',
			},
			{
				'@type': 'ListItem',
				position: 3,
				name: city.name,
				item: `https://elektrykmajkel.pl/uslugi/elektryk-${slug}`,
			},
		],
	}

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

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
				<section className="bg-gray-900 text-white py-16 sm:py-24">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
								/>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
								/>
							</svg>
							{city.name}
							{distanceText && <span className="text-amber-400/70">• {distanceText}</span>}
						</div>
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">{heading}</h1>
						<p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">{description}</p>
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
								Formularz kontaktowy
							</Link>
						</div>
					</div>
				</section>

				{/* Services in this city */}
				<section className="py-16 sm:py-20">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
							Usługi elektryczne — <span className="text-amber-700">{city.name}</span>
						</h2>
						<p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
							Oferujemy pełen zakres usług elektrycznych z dojazdem do {city.name} i okolic.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{services.map(service => (
								<div
									key={service._id}
									className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-amber-200 transition-all">
									<div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
										<svg
											className="w-6 h-6 text-amber-700"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
									</div>
									<h3 className="font-bold text-lg mb-2">{service.title}</h3>
									<p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Why choose us */}
				<section className="py-16 sm:py-20 bg-[#f3f2ef]">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
							Dlaczego warto wybrać <span className="text-amber-700">{businessName}</span>?
						</h2>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
							{[
								{
									title: 'Uprawnienia SEP',
									icon: (
										<svg
											className="w-7 h-7 text-amber-700"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
											/>
										</svg>
									),
								},
								{
									title: 'Szybki dojazd',
									icon: (
										<svg
											className="w-7 h-7 text-amber-700"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M13 10V3L4 14h7v7l9-11h-7z"
											/>
										</svg>
									),
								},
								{
									title: 'Uczciwe ceny',
									icon: (
										<svg
											className="w-7 h-7 text-amber-700"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									),
								},
								{
									title: 'Awaryjne 24/7',
									icon: (
										<svg
											className="w-7 h-7 text-amber-700"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
									),
								},
							].map(item => (
								<div
									key={item.title}
									className="flex flex-col items-center text-center bg-white rounded-xl p-6 shadow-sm">
									<div className="w-14 h-14 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mb-3">
										{item.icon}
									</div>
									<h3 className="font-bold text-sm">{item.title}</h3>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="py-16 sm:py-20 bg-gray-900 text-white text-center">
					<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-2xl sm:text-3xl font-bold mb-4">
							Potrzebujesz elektryka w <span className="text-amber-400">{city.name}</span>?
						</h2>
						<p className="text-gray-300 mb-8 text-lg">Skontaktuj się z nami — wycena gratis, dojazd w cenie!</p>
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
									<span className="text-gray-700 font-medium">Elektryk {city.name}</span>
								</li>
							</ol>
						</nav>
					</div>
				</section>
			</main>

			{/* Simple footer */}
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
