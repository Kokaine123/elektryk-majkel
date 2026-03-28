import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import About from '@/components/About'

// Lazy load below-the-fold components
const Projects = dynamic(() => import('@/components/Projects'))
const Contact = dynamic(() => import('@/components/Contact'))
const MapWrapper = dynamic(() => import('@/components/MapWrapper'))
const Reviews = dynamic(() => import('@/components/Reviews'))
const FAQ = dynamic(() => import('@/components/FAQ'))
const Footer = dynamic(() => import('@/components/Footer'))

import {
	getContactInfo,
	getReviews,
	getMapCities,
	getSeoSettings,
	getFaqItems,
	getSiteSettings,
	getHeroSection,
} from '@/lib/queries'
import { urlFor } from '@/lib/sanity'

function buildJsonLd(seo: Awaited<ReturnType<typeof getSeoSettings>>) {
	const businessName = seo?.businessName || 'Elektryk Majkel'
	const businessType = seo?.businessType || 'Electrician'
	const businessUrl = seo?.businessUrl || 'https://elektrykmajkel.pl'
	const businessPhone = seo?.businessPhone || '+48537751820'
	const businessEmail = seo?.businessEmail || 'elektryk.majkel@gmail.com'
	const addressCity = seo?.addressCity || 'Radomyśl nad Sanem'
	const addressStreet = seo?.addressStreet || ''
	const addressPostalCode = seo?.addressPostalCode || ''
	const addressCountry = seo?.addressCountry || 'PL'
	const geoLat = seo?.geoLatitude || 50.6808
	const geoLng = seo?.geoLongitude || 21.9447
	const serviceRadius = seo?.serviceRadius || 50
	const priceRange = seo?.priceRange || '$$'
	const socialProfiles = seo?.socialProfiles || []
	const logoUrl = seo?.logo?.asset ? urlFor(seo.logo).width(400).url() : '/logo.webp'

	// Opening hours
	const openingHours =
		seo?.openingHours?.length && seo.openingHours.length > 0
			? seo.openingHours.map(h => ({
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
				]

	// Full services catalog (synced with Google Business Profile)
	const gbpServices = [
		'Instalacje elektryczne',
		'Montaż instalacji elektrycznej',
		'Montaż gniazdek elektrycznych i przełączników',
		'Montaż przewodu uziemiającego',
		'Montaż części elektrycznych',
		'Zmiana okablowania',
		'Naprawy awaryjne 24/7',
		'Naprawa instalacji elektrycznej',
		'Naprawa gniazdek elektrycznych i włączników',
		'Naprawa paneli elektrycznych',
		'Naprawa urządzeń elektrycznych',
		'Przywracanie zasilania elektrycznego',
		'Modernizacja instalacji',
		'Wymiana lub modernizacja panelu elektrycznego',
		'Wymiana bezpieczników elektrycznych',
		'Wymiana elektrycznego opornika cieplnego',
		'Przenoszenie gniazdek elektrycznych i włączników',
		'Przeglądy instalacji elektrycznej',
		'Pomiary elektryczne',
		'Oświetlenie LED',
		'Instalacja oświetlenia',
		'Instalacja oświetlenia zewnętrznego',
		'Naprawa oświetlenia',
		'Montaż wentylatora',
		'Naprawa wentylatorów',
		'Smart Home',
		'Instalacja alarmu ogólnego',
		'Instalacja systemu zabezpieczeń',
		'Montaż ładowarki do samochodów elektrycznych',
		'Bramy automatyczne',
	]

	const serviceItems =
		seo?.servicesList?.length && seo.servicesList.length > 0
			? seo.servicesList.map(s => ({
					'@type': 'Offer',
					itemOffered: { '@type': 'Service', name: s },
				}))
			: gbpServices.map(s => ({
					'@type': 'Offer',
					itemOffered: { '@type': 'Service', name: s },
				}))

	return {
		'@context': 'https://schema.org',
		'@type': businessType,
		name: businessName,
		description:
			seo?.siteDescription ||
			'Profesjonalne usługi elektryczne - instalacje, naprawy, modernizacje. Certyfikowany elektryk z uprawnieniami SEP.',
		url: businessUrl,
		telephone: businessPhone,
		email: businessEmail,
		address: {
			'@type': 'PostalAddress',
			...(addressStreet && { streetAddress: addressStreet }),
			addressLocality: addressCity,
			...(addressPostalCode && { postalCode: addressPostalCode }),
			addressCountry: addressCountry,
		},
		geo: {
			'@type': 'GeoCoordinates',
			latitude: geoLat,
			longitude: geoLng,
		},
		areaServed: {
			'@type': 'GeoCircle',
			geoMidpoint: {
				'@type': 'GeoCoordinates',
				latitude: geoLat,
				longitude: geoLng,
			},
			geoRadius: `${serviceRadius * 1000}`,
		},
		openingHoursSpecification: openingHours,
		priceRange,
		image: logoUrl,
		logo: logoUrl,
		sameAs: socialProfiles,
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: 'Usługi elektryczne',
			itemListElement: serviceItems,
		},
	}
}

export default async function Home() {
	// Fetch data for client components in parallel
	const [contactInfo, reviews, mapCities, seoSettings, faqItems, siteSettings, heroSection] = await Promise.all([
		getContactInfo().catch(() => null),
		getReviews().catch(() => []),
		getMapCities().catch(() => []),
		getSeoSettings().catch(() => null),
		getFaqItems().catch(() => []),
		getSiteSettings().catch(() => null),
		getHeroSection().catch(() => null),
	])

	// Section visibility (default: show all)
	const show = {
		hero: siteSettings?.showHero !== false,
		services: siteSettings?.showServices !== false,
		about: siteSettings?.showAbout !== false,
		projects: siteSettings?.showProjects !== false,
		contact: siteSettings?.showContact !== false,
		map: siteSettings?.showMap !== false,
		reviews: siteSettings?.showReviews !== false,
		faq: siteSettings?.showFaq !== false,
	}

	const navItems = siteSettings?.navItems?.length ? siteSettings.navItems : undefined

	const phone = contactInfo?.phone
	const jsonLd = buildJsonLd(seoSettings)

	// AggregateRating + Review JSON-LD
	const reviewsForSchema = reviews.length > 0 ? reviews : null
	const reviewJsonLd = reviewsForSchema
		? {
				'@context': 'https://schema.org',
				'@type': 'LocalBusiness',
				name: seoSettings?.businessName || 'Elektryk Majkel',
				url: seoSettings?.businessUrl || 'https://elektrykmajkel.pl',
				aggregateRating: {
					'@type': 'AggregateRating',
					ratingValue: (reviewsForSchema.reduce((sum, r) => sum + r.rating, 0) / reviewsForSchema.length).toFixed(1),
					bestRating: '5',
					worstRating: '1',
					ratingCount: reviewsForSchema.length,
					reviewCount: reviewsForSchema.length,
				},
				review: reviewsForSchema.map(r => ({
					'@type': 'Review',
					author: {
						'@type': 'Person',
						name: r.author,
					},
					reviewRating: {
						'@type': 'Rating',
						ratingValue: r.rating,
						bestRating: '5',
						worstRating: '1',
					},
					reviewBody: r.text,
					...(r.date && { datePublished: r.date }),
				})),
			}
		: null

	// FAQPage JSON-LD
	const faqsForSchema = faqItems.length > 0 ? faqItems : null
	const faqJsonLd = faqsForSchema
		? {
				'@context': 'https://schema.org',
				'@type': 'FAQPage',
				mainEntity: faqsForSchema.map(faq => ({
					'@type': 'Question',
					name: faq.question,
					acceptedAnswer: {
						'@type': 'Answer',
						text: faq.answer,
					},
				})),
			}
		: null

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			{reviewJsonLd && (
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewJsonLd) }} />
			)}
			{faqJsonLd && (
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
			)}
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-amber-500 focus:text-gray-950 focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold">
				Przejdź do treści
			</a>
			<Navbar phone={phone || undefined} navItems={navItems} />
			<main id="main-content">
				{show.hero && <Hero data={heroSection} />}
				{show.services && <Services />}
				{show.about && <About />}
				{show.projects && <Projects />}
				{show.contact && <Contact contactInfo={contactInfo || undefined} />}
				{show.map && <MapWrapper cities={mapCities.length > 0 ? mapCities : undefined} />}
				{show.reviews && <Reviews initialReviews={reviews.length > 0 ? reviews : undefined} />}
				{show.faq && <FAQ initialFaqs={faqItems.length > 0 ? faqItems : undefined} />}
			</main>
			<Footer />
		</>
	)
}
