/**
 * Sanity Seed Script
 * Populates Sanity with all default data from the components.
 *
 * Usage:
 *   1. Create a write token at https://www.sanity.io/manage
 *   2. Run: SANITY_API_WRITE_TOKEN=<token> npx tsx scripts/seed.ts
 *      or on Windows:
 *      $env:SANITY_API_WRITE_TOKEN="<token>"; npx tsx scripts/seed.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) {
	console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
	process.exit(1)
}
if (!token) {
	console.error(
		'Missing SANITY_API_WRITE_TOKEN. Create one at https://www.sanity.io/manage → API → Tokens (Editor role)',
	)
	process.exit(1)
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: '2024-01-01',
	useCdn: false,
})

// ─────────────────────────────────────────────────────────
// Helper: createOrReplace — idempotent, safe to re-run
// ─────────────────────────────────────────────────────────
async function seed(doc: Record<string, unknown>) {
	const id = doc._id as string
	const type = doc._type as string
	try {
		await client.createOrReplace(doc as any)
		console.log(`  ✔ ${type} → ${id}`)
	} catch (err: any) {
		console.error(`  ✘ ${type} → ${id}: ${err.message}`)
	}
}

async function main() {
	console.log(`\nSeeding Sanity [${projectId}/${dataset}] …\n`)

	// ── Hero Section (singleton) ──────────────────────────
	await seed({
		_id: 'heroSection',
		_type: 'heroSection',
		badgeText: 'Certyfikowany elektryk z uprawnieniami SEP',
		headingLine1: 'Profesjonalne',
		headingLine2: 'Usługi Elektryczne',
		description:
			'Instalacje, naprawy i modernizacje elektryczne. Działamy szybko, solidnie i\u00a0bezpiecznie. Ponad 10 lat doświadczenia w branży.',
		ctaText: 'Bezpłatna wycena →',
		ctaLink: '#kontakt',
		phoneNumber: '+48 537 751 820',
		stats: [
			{ _key: 'stat1', value: '10+', label: 'Lat doświadczenia' },
			{ _key: 'stat2', value: '500+', label: 'Zrealizowanych projektów' },
			{ _key: 'stat3', value: '24/7', label: 'Awaryjne naprawy' },
			{ _key: 'stat4', value: '100%', label: 'Zadowolonych klientów' },
		],
	})

	// ── About Section (singleton) ─────────────────────────
	await seed({
		_id: 'aboutSection',
		_type: 'aboutSection',
		yearsExperience: '10+',
		description:
			'Jestem certyfikowanym elektrykiem z wieloletnim doświadczeniem. Specjalizuję się w instalacjach elektrycznych dla domów jednorodzinnych, mieszkań oraz obiektów komercyjnych. Każde zlecenie traktuję indywidualnie, dbając o najwyższą jakość wykonania i bezpieczeństwo.',
		clientsCount: '500+',
		projectsCount: '1000+',
		certifications: ['Uprawnienia SEP E i D', 'Ubezpieczenie OC'],
		features: [
			{
				_key: 'f1',
				icon: '🛡️',
				title: 'Uprawnienia SEP',
				description: 'Posiadamy pełne uprawnienia do eksploatacji i dozoru urządzeń elektrycznych.',
			},
			{
				_key: 'f2',
				icon: '⚡',
				title: 'Szybka realizacja',
				description: 'Większość zleceń realizujemy w ciągu 24-48 godzin od zgłoszenia.',
			},
			{
				_key: 'f3',
				icon: '📋',
				title: 'Gwarancja na prace',
				description: 'Na wszystkie wykonane prace udzielamy pisemnej gwarancji do 5 lat.',
			},
			{
				_key: 'f4',
				icon: '💰',
				title: 'Uczciwe ceny',
				description: 'Transparentna wycena przed rozpoczęciem prac. Bez ukrytych kosztów.',
			},
		],
	})

	// ── Contact Info (singleton) ──────────────────────────
	await seed({
		_id: 'contactInfo',
		_type: 'contactInfo',
		phone: '+48 537 751 820',
		email: 'elektryk.majkel@gmail.com',
		location: 'Radomyśl nad Sanem i okolice',
		workingHoursWeekday: 'Pon - Pt: 7:00 - 18:00',
		workingHoursSaturday: 'Sob: 8:00 - 14:00',
		emergencyNote: 'Awarie: całodobowo',
		emergencyAvailable: 'Dostępny 24/7 w nagłych wypadkach',
		emailResponseTime: 'Odpowiadamy w ciągu 24h',
	})

	// ── Site Settings (singleton) ─────────────────────────
	await seed({
		_id: 'siteSettings',
		_type: 'siteSettings',
		showHero: true,
		showServices: true,
		showAbout: true,
		showProjects: true,
		showContact: true,
		showMap: true,
		showReviews: true,
		showFaq: true,
		navItems: [
			{ _key: 'n1', label: 'Start', href: '#start' },
			{ _key: 'n2', label: 'Usługi', href: '#uslugi' },
			{ _key: 'n3', label: 'O nas', href: '#o-nas' },
			{ _key: 'n4', label: 'Realizacje', href: '#realizacje' },
			{ _key: 'n5', label: 'Kontakt', href: '#kontakt' },
		],
	})

	// ── Services ──────────────────────────────────────────
	const services = [
		{
			_id: 'service-instalacje',
			icon: 'home',
			title: 'Instalacje elektryczne',
			description:
				'Kompleksowe instalacje elektryczne w domach, mieszkaniach i obiektach komercyjnych. Nowe budynki i remonty.',
			order: 1,
		},
		{
			_id: 'service-naprawy',
			icon: 'alert',
			title: 'Naprawy awaryjne 24/7',
			description:
				'Szybka reakcja na awarie elektryczne o każdej porze dnia i nocy. Zwarcia, przepięcia, brak prądu — przyjadę natychmiast.',
			order: 2,
		},
		{
			_id: 'service-modernizacja',
			icon: 'bolt',
			title: 'Modernizacja instalacji',
			description:
				'Wymiana starych instalacji aluminiowych na miedziane. Dostosowanie do aktualnych norm i zwiększenie bezpieczeństwa.',
			order: 3,
		},
		{
			_id: 'service-pomiary',
			icon: 'beaker',
			title: 'Pomiary elektryczne',
			description:
				'Profesjonalne pomiary ochronne, rezystancji izolacji, impedancji pętli zwarcia. Protokoły i certyfikaty.',
			order: 4,
		},
		{
			_id: 'service-led',
			icon: 'lightbulb',
			title: 'Oświetlenie LED',
			description:
				'Projektowanie i montaż nowoczesnego oświetlenia LED. Inteligentne sterowanie, oświetlenie dekoracyjne i energooszczędne.',
			order: 5,
		},
		{
			_id: 'service-smarthome',
			icon: 'house',
			title: 'Smart Home',
			description:
				'Instalacja systemów inteligentnego domu. Sterowanie oświetleniem, roletami i ogrzewaniem z poziomu smartfona.',
			order: 6,
		},
	]
	for (const s of services) {
		await seed({ ...s, _type: 'service' })
	}

	// ── Projects ──────────────────────────────────────────
	const projects = [
		{
			_id: 'project-dom',
			title: 'Instalacja w domu jednorodzinnym',
			category: 'Instalacje',
			description:
				'Kompleksowa instalacja elektryczna w nowym domu o pow. 180m². Inteligentne oświetlenie, gniazdka w każdym pokoju.',
			order: 1,
		},
		{
			_id: 'project-biuro',
			title: 'Modernizacja biura',
			category: 'Modernizacja',
			description:
				'Wymiana całej instalacji w biurze 300m². Nowa rozdzielnica, okablowanie strukturalne, oświetlenie LED.',
			order: 2,
		},
		{
			_id: 'project-smarthome',
			title: 'System Smart Home',
			category: 'Smart Home',
			description: 'Wdrożenie systemu inteligentnego domu. Sterowanie oświetleniem, roletami i klimatyzacją.',
			order: 3,
		},
		{
			_id: 'project-brama',
			title: 'Automatyka bramowa',
			category: 'Automatyka',
			description:
				'Montaż i konfiguracja napędów do bram wjazdowych i garażowych. Piloty, fotokomórki, sterowanie z telefonu.',
			order: 4,
		},
		{
			_id: 'project-awaria',
			title: 'Naprawa awaryjna',
			category: 'Awaria',
			description: 'Szybka lokalizacja i naprawa zwarcia w instalacji mieszkania. Wymiana uszkodzonego odcinka.',
			order: 5,
		},
		{
			_id: 'project-foto',
			title: 'Montaż fotowoltaiki',
			category: 'Fotowoltaika',
			description: 'Instalacja paneli fotowoltaicznych 10kW z podłączeniem do sieci i optymalizacja zużycia energii.',
			order: 6,
		},
	]
	for (const p of projects) {
		await seed({ ...p, _type: 'project' })
	}

	// ── Reviews ───────────────────────────────────────────
	const reviews = [
		{
			_id: 'review-1',
			author: 'Marcin Kowalski',
			rating: 5,
			text: 'Profesjonalna obsługa od A do Z. Pan Michał wykonał całą instalację elektryczną w nowym domu. Wszystko sprawnie, czysto i terminowo. Polecam gorąco!',
			date: '2 miesiące temu',
			order: 1,
		},
		{
			_id: 'review-2',
			author: 'Anna Nowak',
			rating: 5,
			text: 'Szybka reakcja na awarię — przyjechał w ciągu godziny wieczorem. Naprawił zwarcie i wymienił uszkodzony odcinek instalacji. Cena uczciwa, fachowa robota.',
			date: '3 miesiące temu',
			order: 2,
		},
		{
			_id: 'review-3',
			author: 'Tomasz Wiśniewski',
			rating: 5,
			text: 'Montaż oświetlenia LED w całym biurze. Efekt przeszedł nasze oczekiwania. Doradził najlepsze rozwiązania, a cena była konkurencyjna. Będziemy wracać!',
			date: '1 miesiąc temu',
			order: 3,
		},
		{
			_id: 'review-4',
			author: 'Katarzyna Zielińska',
			rating: 5,
			text: 'Modernizacja instalacji w starym mieszkaniu. Pan Michał wyjaśnił każdy etap prac, zadbał o bezpieczeństwo i porządek. Polecam z czystym sumieniem.',
			date: '4 miesiące temu',
			order: 4,
		},
		{
			_id: 'review-5',
			author: 'Piotr Mazur',
			rating: 5,
			text: 'Instalacja systemu Smart Home — sterowanie światłem i roletami z telefonu działa bez zarzutu. Bardzo profesjonalne podejście i świetny kontakt.',
			date: '2 tygodnie temu',
			order: 5,
		},
		{
			_id: 'review-6',
			author: 'Ewa Krawczyk',
			rating: 4,
			text: 'Szybko i sprawnie wymienił tablicę rozdzielczą. Wszystko działa jak należy. Jedyny minus to lekkie opóźnienie, ale efekt końcowy bez zastrzeżeń.',
			date: '5 miesięcy temu',
			order: 6,
		},
		{
			_id: 'review-7',
			author: 'Robert Dąbrowski',
			rating: 5,
			text: 'Pomiary elektryczne w firmie — pełna dokumentacja, protokoły i certyfikaty dostarczone następnego dnia. Bardzo solidna firma, polecam przedsiębiorcom.',
			date: '3 tygodnie temu',
			order: 7,
		},
		{
			_id: 'review-8',
			author: 'Monika Lewandowska',
			rating: 5,
			text: 'Podłączenie fotowoltaiki do sieci. Świetne doradztwo, szybka realizacja. Rachunki za prąd spadły o 70%! Dziękujemy za profesjonalizm.',
			date: '1 miesiąc temu',
			order: 8,
		},
	]
	for (const r of reviews) {
		await seed({ ...r, _type: 'review' })
	}

	// ── FAQ Items ─────────────────────────────────────────
	const faqs = [
		{
			_id: 'faq-1',
			question: 'Jaki jest koszt dojazdu?',
			answer:
				'Dojazd na terenie Radomyśla nad Sanem i w promieniu 30 km jest bezpłatny. Dla dalszych lokalizacji koszt ustalamy indywidualnie.',
			order: 1,
		},
		{
			_id: 'faq-2',
			question: 'Czy pracujecie w weekendy i święta?',
			answer:
				'Tak — w soboty pracujemy w godzinach 8:00-14:00. W nagłych awariach jesteśmy dostępni 24/7, również w niedziele i święta.',
			order: 2,
		},
		{
			_id: 'faq-3',
			question: 'Jakie posiadacie uprawnienia?',
			answer:
				'Posiadamy pełne uprawnienia SEP (Stowarzyszenie Elektryków Polskich) do wykonywania prac przy instalacjach elektrycznych do 1 kV. Wszystkie prace wykonujemy zgodnie z aktualnymi normami.',
			order: 3,
		},
		{
			_id: 'faq-4',
			question: 'Jak szybko możecie przyjechać na awarię?',
			answer:
				'W przypadku awarii staramy się dotrzeć w ciągu 1-2 godzin na terenie Radomyśla nad Sanem i najbliższych okolic. Dla dalszych lokalizacji czas reakcji wynosi do 3 godzin.',
			order: 4,
		},
		{
			_id: 'faq-5',
			question: 'Czy wystawiacie fakturę?',
			answer:
				'Tak, wystawiamy faktury VAT. Na życzenie klienta przygotowujemy również szczegółowy kosztorys przed rozpoczęciem prac.',
			order: 5,
		},
		{
			_id: 'faq-6',
			question: 'Jak często należy robić przegląd instalacji elektrycznej?',
			answer:
				'Zgodnie z przepisami, przegląd instalacji elektrycznej w budynkach mieszkalnych należy wykonywać co najmniej raz na 5 lat. W obiektach komercyjnych — co 1-5 lat, w zależności od typu obiektu.',
			order: 6,
		},
		{
			_id: 'faq-7',
			question: 'Co zrobić, gdy wybiło korki?',
			answer:
				'Najpierw sprawdź, czy nie doszło do przeciążenia (zbyt wiele urządzeń na jednym obwodzie). Spróbuj załączyć bezpiecznik. Jeśli ponownie wybija — nie próbuj naprawiać samodzielnie i zadzwoń do nas.',
			order: 7,
		},
		{
			_id: 'faq-8',
			question: 'Jaki jest zakres obsługiwanych miejscowości?',
			answer:
				'Obsługujemy Radomyśl nad Sanem i okolice w promieniu ok. 50 km, w tym: Stalową Wolę, Tarnobrzeg, Nisko, Rudnik nad Sanem, Sandomierz, Janów Lubelski i wiele innych. Dla większych zleceń dojeżdżamy dalej.',
			order: 8,
		},
	]
	for (const f of faqs) {
		await seed({ ...f, _type: 'faqItem' })
	}

	// ── Map Cities ────────────────────────────────────────
	const cities = [
		{ _id: 'city-rzeszow', name: 'Rzeszów', lat: 50.0412, lng: 21.9991, slug: { _type: 'slug', current: 'rzeszow' } },
		{ _id: 'city-lublin', name: 'Lublin', lat: 51.2465, lng: 22.5684, slug: { _type: 'slug', current: 'lublin' } },
		{ _id: 'city-kielce', name: 'Kielce', lat: 50.8661, lng: 20.6286, slug: { _type: 'slug', current: 'kielce' } },
		{ _id: 'city-tarnow', name: 'Tarnów', lat: 50.0121, lng: 20.9858, slug: { _type: 'slug', current: 'tarnow' } },
		{ _id: 'city-zamosc', name: 'Zamość', lat: 50.7231, lng: 23.2519, slug: { _type: 'slug', current: 'zamosc' } },
		{
			_id: 'city-przemysl',
			name: 'Przemyśl',
			lat: 49.7838,
			lng: 22.7678,
			slug: { _type: 'slug', current: 'przemysl' },
		},
		{
			_id: 'city-tarnobrzeg',
			name: 'Tarnobrzeg',
			lat: 50.5731,
			lng: 21.679,
			slug: { _type: 'slug', current: 'tarnobrzeg' },
		},
		{
			_id: 'city-sandomierz',
			name: 'Sandomierz',
			lat: 50.6826,
			lng: 21.7489,
			slug: { _type: 'slug', current: 'sandomierz' },
		},
		{ _id: 'city-mielec', name: 'Mielec', lat: 50.2874, lng: 21.4249, slug: { _type: 'slug', current: 'mielec' } },
		{
			_id: 'city-jaroslaw',
			name: 'Jarosław',
			lat: 50.0162,
			lng: 22.6933,
			slug: { _type: 'slug', current: 'jaroslaw' },
		},
		{ _id: 'city-debica', name: 'Dębica', lat: 50.05, lng: 21.4119, slug: { _type: 'slug', current: 'debica' } },
		{ _id: 'city-krasnik', name: 'Kraśnik', lat: 50.9247, lng: 22.2267, slug: { _type: 'slug', current: 'krasnik' } },
		{ _id: 'city-nisko', name: 'Nisko', lat: 50.5197, lng: 22.1397, slug: { _type: 'slug', current: 'nisko' } },
		{
			_id: 'city-stalowa-wola',
			name: 'Stalowa Wola',
			lat: 50.5829,
			lng: 22.0537,
			slug: { _type: 'slug', current: 'stalowa-wola' },
		},
	]
	for (const c of cities) {
		await seed({ ...c, _type: 'mapCity' })
	}

	// ── SEO Settings (singleton) ──────────────────────────
	await seed({
		_id: 'seoSettings',
		_type: 'seoSettings',
		siteTitle: 'Elektryk Majkel — Profesjonalne usługi elektryczne',
		siteDescription:
			'Profesjonalne usługi elektryczne - instalacje, naprawy, modernizacje. Certyfikowany elektryk z uprawnieniami SEP.',
		canonicalUrl: 'https://elektrykmajkel.pl',
		ogType: 'website',
		twitterCard: 'summary_large_image',
		businessName: 'Elektryk Majkel',
		businessType: 'Electrician',
		businessPhone: '+48537751820',
		businessEmail: 'elektryk.majkel@gmail.com',
		businessUrl: 'https://elektrykmajkel.pl',
		addressCity: 'Radomyśl nad Sanem',
		addressCountry: 'PL',
		geoLatitude: 50.6808,
		geoLongitude: 21.9447,
		serviceRadius: 50,
		priceRange: '$$',
		robotsIndex: true,
		robotsFollow: true,
		robotsNoarchive: false,
		openingHours: [
			{
				_key: 'oh1',
				days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
				opens: '07:00',
				closes: '18:00',
			},
			{
				_key: 'oh2',
				days: ['Saturday'],
				opens: '08:00',
				closes: '14:00',
			},
		],
		servicesList: [
			'Instalacje elektryczne',
			'Naprawy awaryjne 24/7',
			'Modernizacja instalacji',
			'Pomiary elektryczne',
			'Oświetlenie LED',
			'Smart Home',
		],
	})

	console.log('\n✅ Seed complete!\n')
}

main().catch(err => {
	console.error('Seed failed:', err)
	process.exit(1)
})
