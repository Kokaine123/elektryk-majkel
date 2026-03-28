import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2024-01-01',
	useCdn: false,
})

const keywords = [
	// Lokalne frazy główne
	'elektryk Radomyśl nad Sanem',
	'elektryk Stalowa Wola',
	'elektryk Tarnobrzeg',
	'elektryk Nisko',
	'elektryk Sandomierz',
	'elektryk podkarpackie',
	'usługi elektryczne Radomyśl nad Sanem',
	'usługi elektryczne Stalowa Wola',

	// Usługi kluczowe
	'instalacje elektryczne',
	'naprawy elektryczne',
	'modernizacja instalacji elektrycznej',
	'wymiana instalacji elektrycznej',
	'montaż instalacji elektrycznej',
	'przyłącze elektryczne',
	'instalacja elektryczna w domu',
	'instalacja elektryczna w mieszkaniu',

	// Awaryjne / pilne
	'elektryk 24/7',
	'elektryk awaryjny',
	'awaria prądu',
	'naprawa awaryjna instalacji elektrycznej',
	'pogotowie elektryczne',

	// Smart home / nowoczesne
	'smart home',
	'inteligentny dom instalacja',
	'automatyka domowa',
	'sterowanie oświetleniem',

	// Oświetlenie
	'oświetlenie LED',
	'montaż oświetlenia',
	'oświetlenie ogrodowe',
	'oświetlenie zewnętrzne',
	'wymiana oświetlenia',

	// Pomiary / certyfikacja
	'pomiary elektryczne',
	'przegląd instalacji elektrycznej',
	'protokół pomiarów elektrycznych',
	'badanie instalacji elektrycznej',
	'uprawnienia SEP',
	'certyfikowany elektryk',

	// Rozdzielnice / tablice
	'montaż rozdzielnicy',
	'wymiana tablicy elektrycznej',
	'rozdzielnia elektryczna',
	'wymiana bezpieczników',

	// AGD / gniazdka
	'podłączenie kuchenki indukcyjnej',
	'podłączenie płyty indukcyjnej',
	'montaż gniazdek',
	'wymiana gniazdek i włączników',
	'podłączenie AGD',

	// Fotowoltaika / ładowarki
	'podłączenie fotowoltaiki',
	'instalacja wallbox',
	'ładowarka samochodu elektrycznego',

	// Long-tail
	'elektryk do domu',
	'elektryk cennik',
	'tani elektryk',
	'dobry elektryk w okolicy',
	'elektryk z dojazdem',
	'usługi elektryczne cennik',
]

const serviceAreas = [
	{
		_key: 'sa-radomysl',
		name: 'Radomyśl nad Sanem',
		description: 'Siedziba firmy. Pełen zakres usług elektrycznych — instalacje, naprawy, modernizacje, pomiary.',
	},
	{
		_key: 'sa-stalowa-wola',
		name: 'Stalowa Wola',
		description: 'Usługi elektryczne z dojazdem. Instalacje w domach, mieszkaniach i obiektach przemysłowych.',
	},
	{
		_key: 'sa-tarnobrzeg',
		name: 'Tarnobrzeg',
		description: 'Elektryk z dojazdem do Tarnobrzega. Naprawy awaryjne, modernizacje instalacji, oświetlenie LED.',
	},
	{
		_key: 'sa-nisko',
		name: 'Nisko',
		description: 'Profesjonalne usługi elektryczne w Nisku i okolicach. Podłączenia AGD, smart home, pomiary.',
	},
	{
		_key: 'sa-sandomierz',
		name: 'Sandomierz',
		description: 'Elektryk Sandomierz — instalacje elektryczne, przeglądy, wymiana tablic rozdzielczych.',
	},
	{
		_key: 'sa-rudnik',
		name: 'Rudnik nad Sanem',
		description: 'Usługi elektryczne w Rudniku nad Sanem. Szybki dojazd, konkurencyjne ceny.',
	},
	{
		_key: 'sa-janow',
		name: 'Janów Lubelski',
		description: 'Elektryk z dojazdem do Janowa Lubelskiego. Instalacje, naprawy, oświetlenie zewnętrzne.',
	},
	{
		_key: 'sa-mielec',
		name: 'Mielec',
		description: 'Usługi elektryczne Mielec — montaż instalacji, podłączenie fotowoltaiki, wallbox.',
	},
	{
		_key: 'sa-rzeszow',
		name: 'Rzeszów',
		description: 'Dojazd do Rzeszowa przy większych zleceniach. Instalacje elektryczne, smart home.',
	},
	{
		_key: 'sa-lublin',
		name: 'Lublin',
		description: 'Obsługa zleceń w Lublinie — instalacje przemysłowe i domowe, modernizacje.',
	},
	{
		_key: 'sa-kielce',
		name: 'Kielce',
		description: 'Dojazd do Kielc przy większych projektach. Kompleksowe usługi elektryczne.',
	},
	{
		_key: 'sa-tarnow',
		name: 'Tarnów',
		description: 'Elektryk z dojazdem do Tarnowa. Instalacje, naprawy, pomiary elektryczne.',
	},
	{
		_key: 'sa-krasnik',
		name: 'Kraśnik',
		description: 'Usługi elektryczne w Kraśniku. Montaż gniazdek, wymiana bezpieczników, oświetlenie.',
	},
	{
		_key: 'sa-debica',
		name: 'Dębica',
		description: 'Elektryk Dębica — instalacje elektryczne w nowych budynkach i remontach.',
	},
]

async function main() {
	await client
		.patch('seoSettings')
		.set({
			keywords,
			serviceAreas,
			googleBusinessUrl: 'https://maps.app.goo.gl/62wJX78Tubcx3Ym39',
			socialProfiles: ['https://maps.app.goo.gl/62wJX78Tubcx3Ym39'],
		})
		.commit()

	console.log(
		`✅ Zaktualizowano: ${keywords.length} słów kluczowych, ${serviceAreas.length} obszarów, Google Business URL`,
	)
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
