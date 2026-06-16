import { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import {
	getCityBySlug,
	getAllCitySlugs,
	getServices,
	getContactInfo,
	getSeoSettings,
	getBlogPosts,
	getServicePageBySlug,
	getAllServicePageSlugs,
} from '@/lib/queries'
import { urlFor } from '@/lib/sanity'
import ServiceCard from '@/components/ServiceCard'
import ServicePageView from './ServicePageView'

const BlogSlider = dynamic(() => import('@/components/BlogSlider'))

const siteUrl = 'https://elektrykmajkel.pl'

async function getGlobalOgImage(): Promise<{ url: string; alt: string }> {
	let url = `${siteUrl}/logo.webp`
	let alt = 'Elektryk Majkel'
	try {
		const seo = await getSeoSettings()
		if (seo?.ogImage?.asset) {
			url = urlFor(seo.ogImage).width(1200).height(630).url()
			alt = seo.ogImage.alt || alt
		}
	} catch {
		// fallback to logo.webp
	}
	return { url, alt }
}

// Sub-services grouped by main category (synced with GBP)
const serviceSubItems: Record<string, string[]> = {
	'Instalacje elektryczne': [
		'Montaż instalacji elektrycznej',
		'Montaż gniazdek i przełączników',
		'Montaż przewodu uziemiającego',
		'Montaż części elektrycznych',
		'Zmiana okablowania',
	],
	'Naprawy awaryjne 24/7': [
		'Naprawa instalacji elektrycznej',
		'Naprawa gniazdek i włączników',
		'Naprawa paneli elektrycznych',
		'Naprawa urządzeń elektrycznych',
		'Przywracanie zasilania',
	],
	'Modernizacja instalacji': [
		'Wymiana panelu elektrycznego',
		'Wymiana bezpieczników',
		'Wymiana opornika cieplnego',
		'Przenoszenie gniazdek',
		'Przeglądy instalacji',
	],
	'Pomiary elektryczne': [
		'Pomiary ochronne',
		'Rezystancja izolacji',
		'Impedancja pętli zwarcia',
		'Protokoły i certyfikaty',
	],
	'Oświetlenie LED': ['Instalacja oświetlenia', 'Oświetlenie zewnętrzne', 'Naprawa oświetlenia', 'Montaż wentylatorów'],
	'Smart Home': ['Instalacja alarmu', 'System zabezpieczeń', 'Ładowarka EV', 'Bramy automatyczne'],
}

// Slug mapping for service subpages
const servicePageSlugs: Record<string, string> = {
	'Instalacje elektryczne': 'instalacje-elektryczne',
	'Naprawy awaryjne 24/7': 'naprawy-awaryjne-24-7',
	'Modernizacja instalacji': 'modernizacja-instalacji',
	'Pomiary elektryczne': 'pomiary-elektryczne',
	'Oświetlenie LED': 'oswietlenie-led',
	'Naprawa maszyn elektrycznych': 'naprawa-maszyn-elektrycznych',
}

// Polish locative case (miejscownik) for city names — "w [mieście]"
const cityLocative: Record<string, string> = {
	Rzeszów: 'Rzeszowie',
	Lublin: 'Lublinie',
	Kielce: 'Kielcach',
	Tarnów: 'Tarnowie',
	Zamość: 'Zamościu',
	Przemyśl: 'Przemyślu',
	Tarnobrzeg: 'Tarnobrzegu',
	Sandomierz: 'Sandomierzu',
	Mielec: 'Mielcu',
	Jarosław: 'Jarosławiu',
	Dębica: 'Dębicy',
	Kraśnik: 'Kraśniku',
	Nisko: 'Nisku',
	'Stalowa Wola': 'Stalowej Woli',
	'Radomyśl nad Sanem': 'Radomyślu nad Sanem',
}

// Polish genitive case (dopełniacz) for city names — "do [miasta]"
const cityGenitive: Record<string, string> = {
	Rzeszów: 'Rzeszowa',
	Lublin: 'Lublina',
	Kielce: 'Kielc',
	Tarnów: 'Tarnowa',
	Zamość: 'Zamościa',
	Przemyśl: 'Przemyśla',
	Tarnobrzeg: 'Tarnobrzega',
	Sandomierz: 'Sandomierza',
	Mielec: 'Mielca',
	Jarosław: 'Jarosławia',
	Dębica: 'Dębicy',
	Kraśnik: 'Kraśnika',
	Nisko: 'Niska',
	'Stalowa Wola': 'Stalowej Woli',
	'Radomyśl nad Sanem': 'Radomyśla nad Sanem',
}

const citySeoOverrides: Record<
	string,
	{
		title: string
		description: string
	}
> = {
	'stalowa-wola': {
		title: 'Elektryk Stalowa Wola | Elektryk SEP, szybki dojazd i wycena',
		description:
			'Elektryk SEP w Stalowej Woli: instalacje, naprawy awaryjne, modernizacje i pomiary. Szybki dojazd, bezpłatna wycena i terminowa realizacja.',
	},
	sandomierz: {
		title: 'Elektryk Sandomierz | Instalacje i naprawy elektryczne SEP',
		description:
			'Profesjonalny elektryk SEP w Sandomierzu: instalacje, awarie, pomiary i modernizacje. Szybki termin, dojazd i bezpłatna wycena.',
	},
	nisko: {
		title: 'Elektryk Nisko | Instalacje, awarie i pomiary SEP',
		description:
			'Elektryk SEP w Nisku: instalacje elektryczne, naprawy awaryjne, modernizacje i pomiary z protokołem. Szybki dojazd i bezpłatna wycena.',
	},
	tarnobrzeg: {
		title: 'Elektryk Tarnobrzeg | Szybki dojazd i bezpłatna wycena',
		description:
			'Profesjonalne usługi elektryczne w Tarnobrzegu: instalacje, naprawy, pomiary i modernizacje. Certyfikowany elektryk SEP, szybki termin realizacji.',
	},
}

// Helpers: get declined form, fallback to original name
function getLocative(name: string): string {
	return cityLocative[name] || name
}
function getGenitive(name: string): string {
	return cityGenitive[name] || name
}

function getCityVariantSeed(name: string): number {
	return Array.from(name).reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

// Icon helper for service cards
function ServiceIcon({ icon }: { icon?: string }) {
	switch (icon) {
		case 'home':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
					/>
				</svg>
			)
		case 'alert':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
					/>
				</svg>
			)
		case 'bolt':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			)
		case 'beaker':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
					/>
				</svg>
			)
		case 'lightbulb':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
					/>
				</svg>
			)
		case 'house':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
					/>
				</svg>
			)
		default:
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			)
	}
}

// ─── Static generation for all cities + service pages ────
export async function generateStaticParams() {
	const [citySlugs, serviceSlugs] = await Promise.all([
		getAllCitySlugs().catch(() => []),
		getAllServicePageSlugs().catch(() => []),
	])
	return [
		...citySlugs.map(slug => ({ miasto: `elektryk-${slug}` })),
		...serviceSlugs.map(slug => ({ miasto: slug })),
	]
}

// ─── Dynamic metadata per city or service page ──────────
export async function generateMetadata({ params }: { params: Promise<{ miasto: string }> }): Promise<Metadata> {
	const { miasto } = await params

	// Service page (slug doesn't start with "elektryk-")
	if (!miasto.startsWith('elektryk-')) {
		const servicePage = await getServicePageBySlug(miasto).catch(() => null)
		if (!servicePage) return { title: 'Nie znaleziono strony', robots: { index: false, follow: false } }

		const title = servicePage.metaTitle || `${servicePage.title} | Elektryk Majkel`
		const description =
			servicePage.metaDescription ||
			`${servicePage.title} — profesjonalna realizacja usługi przez elektryka SEP. Szybki termin, bezpieczne wykonanie i bezpłatna wycena.`

		return {
			title,
			description,
			keywords: servicePage.keywords || [],
			alternates: { canonical: `https://elektrykmajkel.pl/uslugi/${miasto}` },
			openGraph: {
				title,
				description,
				type: 'website',
				locale: 'pl_PL',
				url: `https://elektrykmajkel.pl/uslugi/${miasto}`,
				siteName: 'Elektryk Majkel',
				...(servicePage.heroImage?.asset && {
					images: [{
						url: urlFor(servicePage.heroImage).width(1200).height(630).url(),
						width: 1200,
						height: 630,
						alt: servicePage.heroImage.alt || servicePage.title,
					}],
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

	// City page
	const slug = miasto.replace(/^elektryk-/, '')
	const city = await getCityBySlug(slug)

	if (!city) {
		return { title: 'Nie znaleziono miasta', robots: { index: false, follow: false } }
	}

	const override = citySeoOverrides[slug]
	const title = city.metaTitle || override?.title || `Elektryk ${city.name} - Usługi Elektryczne | Elektryk Majkel`
	const description =
		city.metaDescription ||
		override?.description ||
		`Elektryk w ${getLocative(city.name)}: instalacje, naprawy awaryjne, modernizacje i pomiary. Certyfikowany elektryk SEP z szybkim dojazdem i bezpłatną wyceną.`

	const keywords = [
		`elektryk ${city.name}`,
		`usługi elektryczne ${city.name}`,
		`elektryk awaryjny ${city.name}`,
		`instalacje elektryczne ${city.name}`,
		`pomiary elektryczne ${city.name}`,
		'certyfikowany elektryk SEP',
		'elektryk z dojazdem',
	]

	const ogImage = await getGlobalOgImage()

	return {
		title,
		description,
		keywords,
		alternates: {
			canonical: `${siteUrl}/uslugi/elektryk-${slug}`,
		},
		openGraph: {
			title,
			description,
			type: 'website',
			locale: 'pl_PL',
			url: `${siteUrl}/uslugi/elektryk-${slug}`,
			siteName: 'Elektryk Majkel',
			images: [
				{
					url: ogImage.url,
					width: 1200,
					height: 630,
					alt: ogImage.alt,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage.url],
		},
		robots: { index: true, follow: true },
	}
}

// ─── Page component ──────────────────────────────────────
export default async function CityPage({ params }: { params: Promise<{ miasto: string }> }) {
	const { miasto } = await params

	// Service page route
	if (!miasto.startsWith('elektryk-')) {
		const servicePage = await getServicePageBySlug(miasto).catch(() => null)
		if (!servicePage) notFound()
		return <ServicePageView page={servicePage} />
	}

	// City page route
	const slug = miasto.replace(/^elektryk-/, '')
	const [city, services, contactInfo, seoSettings, blogPosts] = await Promise.all([
		getCityBySlug(slug).catch(() => null),
		getServices().catch(() => []),
		getContactInfo().catch(() => null),
		getSeoSettings().catch(() => null),
		getBlogPosts().catch(() => []),
	])

	if (!city) notFound()

	// Pre-build blog image URLs server-side
	const blogImageUrls: Record<string, string> = {}
	for (const post of blogPosts) {
		if (post.coverImage?.asset) {
			blogImageUrls[post._id] = urlFor(post.coverImage).width(800).height(500).url()
		}
	}

	const phone = contactInfo?.phone || '+48 537 751 820'
	const email = contactInfo?.email || 'elektryk.majkel@gmail.com'
	const phoneHref = `tel:${phone.replace(/\s/g, '')}`
	const businessName = seoSettings?.businessName || 'Elektryk Majkel'
	const heading = city.pageHeading || `Elektryk ${city.name}`
	const distanceText = city.distanceKm ? `${city.distanceKm} km od Radomyśla nad Sanem` : null
	const variant = getCityVariantSeed(city.name) % 3
	const locativeCity = getLocative(city.name)
	const genitiveCity = getGenitive(city.name)

	const description =
		city.pageDescription ||
		[
			`Szukasz zaufanego elektryka w ${locativeCity}? ${businessName} oferuje profesjonalne usługi elektryczne z dojazdem do ${genitiveCity}${distanceText ? ` (${distanceText})` : ''}. Posiadamy uprawnienia SEP i gwarantujemy solidne wykonanie każdego zlecenia.`,
			`Realizujemy zlecenia elektryczne w ${locativeCity} i okolicy: od szybkich napraw awaryjnych po pełne modernizacje instalacji. Dojazd do ${genitiveCity}${distanceText ? ` (${distanceText})` : ''} organizujemy sprawnie, a wycena jest bezpłatna.`,
			`Potrzebny elektryk w ${locativeCity}? ${businessName} zapewnia bezpieczne instalacje, pomiary i serwis awaryjny z dojazdem do ${genitiveCity}${distanceText ? ` (${distanceText})` : ''}. Pracujemy terminowo, zgodnie z normami i z pełną odpowiedzialnością za efekt.`,
		][variant]

	const localProofPoints = [
		{
			title: `Dojazd do ${genitiveCity}`,
			description: distanceText
				? `Obsługujemy ${genitiveCity} regularnie. Typowy czas dojazdu przy awarii to ${city.distanceKm && city.distanceKm <= 30 ? '1-2 godziny' : '2-3 godziny'}.`
				: `Obsługujemy ${genitiveCity} i najbliższe miejscowości w trybie planowym oraz awaryjnym.`,
		},
		{
			title: 'Zakres lokalnych realizacji',
			description:
				'Najczęściej wykonujemy modernizacje instalacji, rozbudowę obwodów, montaż zabezpieczeń, pomiary i usuwanie usterek.',
		},
		{
			title: 'Transparentna wycena',
			description:
				'Przed rozpoczęciem prac przekazujemy zakres, koszt i orientacyjny termin realizacji. Dzięki temu klient zna warunki z góry.',
		},
	]

	// Full GBP services list for JSON-LD
	const gbpDetailedServices = [
		'Instalacja oświetlenia',
		'Instalacja oświetlenia zewnętrznego',
		'Montaż gniazdek elektrycznych i przełączników',
		'Naprawa gniazdek elektrycznych i włączników',
		'Przenoszenie gniazdek elektrycznych i włączników',
		'Instalacja alarmu ogólnego',
		'Instalacja systemu zabezpieczeń',
		'Montaż części elektrycznych',
		'Montaż instalacji elektrycznej',
		'Montaż ładowarki do samochodów elektrycznych',
		'Montaż przewodu uziemiającego',
		'Montaż wentylatora',
		'Naprawa instalacji elektrycznej',
		'Naprawa oświetlenia',
		'Naprawa paneli elektrycznych',
		'Naprawa wentylatorów',
		'Naprawa urządzeń elektrycznych',
		'Przeglądy instalacji elektrycznej',
		'Przywracanie zasilania elektrycznego',
		'Wymiana bezpieczników elektrycznych',
		'Wymiana elektrycznego opornika cieplnego',
		'Wymiana lub modernizacja panelu elektrycznego',
		'Zmiana okablowania',
		'Bramy automatyczne',
	]

	const allServiceItems = [
		...services.map(s => ({
			'@type': 'Offer' as const,
			itemOffered: {
				'@type': 'Service' as const,
				name: s.title,
				description: s.description,
				areaServed: { '@type': 'City' as const, name: city.name },
				provider: { '@type': 'Electrician' as const, name: businessName },
			},
		})),
		...gbpDetailedServices
			.filter(name => !services.some(s => s.title === name))
			.map(name => ({
				'@type': 'Offer' as const,
				itemOffered: {
					'@type': 'Service' as const,
					name,
					areaServed: { '@type': 'City' as const, name: city.name },
					provider: { '@type': 'Electrician' as const, name: businessName },
				},
			})),
	]

	const hasOfferCatalog =
		allServiceItems.length > 0
			? {
					'@type': 'OfferCatalog',
					name: `Usługi elektryczne - ${city.name}`,
					itemListElement: allServiceItems,
				}
			: undefined

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
					opens: h.opens || '00:00',
					closes: h.closes || '23:59',
				}))
			: [
					{
						'@type': 'OpeningHoursSpecification',
						dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
						opens: '00:00',
						closes: '23:59',
					},
				],
		hasOfferCatalog,
		parentOrganization: {
			'@type': 'Electrician',
			name: businessName,
			url: 'https://elektrykmajkel.pl',
		},
	}

	// City-specific FAQ (based on main FAQ, localized per city)
	const cityFaqs = [
		{
			question: `Ile kosztuje elektryk w ${getLocative(city.name)}?`,
			answer: `Koszt usługi elektrycznej w ${getLocative(city.name)} zależy od rodzaju zlecenia. Dojazd z Radomyśla nad Sanem${distanceText ? ` (${distanceText})` : ''} jest wliczony w cenę. Wycena jest zawsze bezpłatna — zadzwoń, opisz problem, a podamy orientacyjny koszt przed przyjazdem.`,
		},
		{
			question: `Jak szybko dojedzie elektryk do ${getGenitive(city.name)}?`,
			answer: `W przypadku awarii staramy się dotrzeć do ${getGenitive(city.name)} w ciągu ${city.distanceKm && city.distanceKm <= 30 ? '1-2 godzin' : '2-3 godzin'}. Przy planowanych zleceniach umawiamy się na konkretny, dogodny termin. Jesteśmy dostępni awaryjnie 24/7.`,
		},
		{
			question: `Czy elektryk pracuje w weekendy w ${getLocative(city.name)}?`,
			answer: `Tak — jesteśmy czynni całą dobę od poniedziałku do soboty, również z dojazdem do ${getGenitive(city.name)}. W niedziele nie pracujemy.`,
		},
		{
			question: `Jakie usługi elektryczne oferujecie w ${getLocative(city.name)}?`,
			answer: `W ${getLocative(city.name)} oferujemy pełen zakres usług: instalacje elektryczne, naprawy awaryjne, modernizację instalacji, pomiary elektryczne z protokołami, oświetlenie LED, smart home, montaż ładowarek EV, bramy automatyczne, alarmy i systemy zabezpieczeń.`,
		},
		{
			question: `Czy wystawiacie fakturę za usługi w ${getLocative(city.name)}?`,
			answer:
				'Tak, wystawiamy faktury VAT za wszystkie wykonane prace. Na życzenie klienta przygotowujemy również szczegółowy kosztorys przed rozpoczęciem zlecenia.',
		},
		{
			question: `Czy elektryk w ${getLocative(city.name)} posiada uprawnienia?`,
			answer: `Tak — posiadamy pełne uprawnienia SEP (Stowarzyszenie Elektryków Polskich) do prac przy instalacjach do 1 kV. Wszystkie usługi w ${getLocative(city.name)} wykonujemy zgodnie z aktualnymi normami i przepisami.`,
		},
		{
			question: `Czy wykonujecie pomiary elektryczne w ${getLocative(city.name)} z protokołem?`,
			answer: `Tak. W ${getLocative(city.name)} realizujemy pomiary instalacji elektrycznych i przygotowujemy protokoły pomiarowe. Zakres pomiarów dobieramy do typu obiektu i celu przeglądu.`,
		},
		{
			question: `Czy mogę dostać wycenę przed przyjazdem do ${getGenitive(city.name)}?`,
			answer: `Tak — po krótkiej rozmowie i opisie problemu przekazujemy orientacyjną wycenę oraz możliwy termin dojazdu do ${getGenitive(city.name)}. Ostateczny koszt potwierdzamy po oględzinach na miejscu.`,
		},
	]

	// FAQPage JSON-LD for city
	const faqJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: cityFaqs.map(faq => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer,
			},
		})),
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
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

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
							Oferujemy pełen zakres usług elektrycznych z dojazdem do {getGenitive(city.name)} i okolic.
						</p>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{services.map(service => (
								<ServiceCard
									key={service._id}
									icon={<ServiceIcon icon={service.icon || undefined} />}
									title={service.title}
									description={service.description}
									subItems={serviceSubItems[service.title]}
									href={servicePageSlugs[service.title] ? `/uslugi/${servicePageSlugs[service.title]}` : undefined}
								/>
							))}
						</div>
					</div>
				</section>

				{/* Local proof section */}
				<section className="py-16 sm:py-20 bg-white">
					<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-10">
							<span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Lokalnie</span>
							<h2 className="text-2xl sm:text-3xl font-bold mt-3">
								Realna obsługa klientów w <span className="text-amber-700">{locativeCity}</span>
							</h2>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
							{localProofPoints.map(point => (
								<div key={point.title} className="rounded-2xl border border-gray-200 p-6 bg-[#faf9f6]">
									<h3 className="text-lg font-bold text-gray-900 mb-2">{point.title}</h3>
									<p className="text-gray-600 text-sm leading-relaxed">{point.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Why choose us */}
				<section className="py-16 sm:py-20 bg-[#f3f2ef]">
					<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-12">
							<span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Dlaczego my</span>
							<h2 className="text-2xl sm:text-3xl font-bold mt-3">
								Dlaczego warto wybrać{' '}
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
									{businessName}
								</span>
								?
							</h2>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{[
								{
									title: 'Uprawnienia SEP',
									description: `Posiadamy pełne uprawnienia SEP do prac przy instalacjach elektrycznych do 1 kV. Każde zlecenie w ${getLocative(city.name)} wykonujemy zgodnie z normami.`,
									icon: (
										<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
									title: `Szybki dojazd do ${getGenitive(city.name)}`,
									description: distanceText
										? `Dojedziemy do ${getGenitive(city.name)} (${distanceText}) szybko i sprawnie. Przy awariach czas reakcji to ${city.distanceKm && city.distanceKm <= 30 ? '1-2 godziny' : '2-3 godziny'}.`
										: `Dojedziemy do ${getGenitive(city.name)} szybko i sprawnie. Dojazd jest wliczony w cenę usługi.`,
									icon: (
										<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
									title: 'Uczciwe ceny i wycena gratis',
									description:
										'Bezpłatna wycena przed rozpoczęciem prac. Faktura VAT, brak ukrytych kosztów. Szczegółowy kosztorys na życzenie.',
									icon: (
										<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
									title: 'Pogotowie elektryczne 24/7',
									description: `Awaria prądu w ${getLocative(city.name)}? Zwarcie, przepięcie, wybite korki — przyjedziemy o każdej porze, również w weekendy i święta.`,
									icon: (
										<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
									className="flex gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-amber-200 hover:shadow-md transition-all">
									<div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 shrink-0">
										{item.icon}
									</div>
									<div>
										<h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
										<p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="py-16 sm:py-20 bg-gray-900 text-white text-center">
					<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-2xl sm:text-3xl font-bold mb-4">
							Potrzebujesz elektryka w <span className="text-amber-400">{getLocative(city.name)}</span>?
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

				{/* Blog slider */}
				{blogPosts.length > 0 && <BlogSlider posts={blogPosts} imageUrls={blogImageUrls} />}

				{/* FAQ section */}
				<section className="py-16 sm:py-20 bg-[#f3f2ef]">
					<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
						<h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
							Najczęściej zadawane{' '}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
								pytania
							</span>
						</h2>
						<p className="text-gray-600 text-center mb-10">
							Elektryk {city.name} — odpowiedzi na najważniejsze pytania
						</p>
						<div className="space-y-3">
							{cityFaqs.map((faq, i) => (
								<details key={i} className="group bg-white rounded-xl border border-gray-200 overflow-hidden">
									<summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer font-semibold text-gray-900 hover:text-amber-700 transition-colors list-none [&::-webkit-details-marker]:hidden">
										<span>{faq.question}</span>
										<svg
											className="w-5 h-5 text-amber-500 shrink-0 transition-transform group-open:rotate-180"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
