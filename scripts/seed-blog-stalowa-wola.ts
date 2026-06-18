/**
 * Seed blog post: instalacje elektryczne Stalowa Wola (Rozwadów / COP).
 *
 * Usage: npx tsx scripts/seed-blog-stalowa-wola.ts
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
	console.error('Missing Sanity env vars in .env.local')
	process.exit(1)
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: '2024-01-01',
	useCdn: false,
})

type SpanPart = { text: string; bold?: boolean; link?: string }

function block(text: string, style = 'normal', key?: string) {
	return {
		_type: 'block' as const,
		_key: key || `b${Math.random().toString(36).slice(2, 8)}`,
		style,
		children: [{ _type: 'span' as const, _key: 's1', text, marks: [] as string[] }],
		markDefs: [] as { _key: string; _type: string; href: string }[],
	}
}

function richBlock(parts: SpanPart[], style = 'normal', key?: string) {
	const blockKey = key || `b${Math.random().toString(36).slice(2, 8)}`
	const markDefs: { _key: string; _type: string; href: string }[] = []

	const children = parts.map((part, index) => {
		const marks: string[] = []
		if (part.bold) marks.push('strong')
		if (part.link) {
			const linkKey = `${blockKey}-link-${index}`
			marks.push(linkKey)
			markDefs.push({ _key: linkKey, _type: 'link', href: part.link })
		}
		return {
			_type: 'span' as const,
			_key: `${blockKey}-s${index}`,
			text: part.text,
			marks,
		}
	})

	return { _type: 'block' as const, _key: blockKey, style, children, markDefs }
}

function bullet(text: string, key: string) {
	return {
		_type: 'block' as const,
		_key: key,
		style: 'normal',
		listItem: 'bullet',
		level: 1,
		children: [{ _type: 'span' as const, _key: `${key}-s`, text, marks: [] as string[] }],
		markDefs: [] as { _key: string; _type: string; href: string }[],
	}
}

async function main() {
	console.log(`\nSeeding Stalowa Wola blog post [${projectId}/${dataset}] …\n`)

	const coverImage = await client.fetch<{ asset?: { _ref: string }; alt?: string } | null>(
		`*[_id == "blogPost-rozdzielnice-elektryczne"][0].coverImage`,
	)

	const content = [
		block(
			'Mieszkańcy Stalowej Woli często nie zdają sobie sprawy, że wiek instalacji elektrycznej jest mocno związany z historią dzielnicy. Inne problemy spotykamy w kamienicach Rozwadowa, a inne w blokach budowanych podczas rozwoju Centralnego Okręgu Przemysłowego.',
			'normal',
			'intro1',
		),
		richBlock(
			[
				{
					text: 'Jako ',
				},
				{ text: 'elektryk z dojazdem do Stalowej Woli', link: '/uslugi/elektryk-stalowa-wola' },
				{
					text: ' regularnie oceniamy instalacje przed remontami — poniżej opisujemy, na co zwracać uwagę w poszczególnych częściach miasta.',
				},
			],
			'normal',
			'intro2',
		),

		block('Rozwadów — budynki z historią', 'h2', 'h2-rozwadow'),
		block(
			'Podczas prac w okolicach rynku Rozwadowa oraz ulic Sobieskiego czy Targowej często spotykamy budynki, które były wielokrotnie przebudowywane przez dziesiątko lat.',
			'normal',
			'p-rozwadow1',
		),
		block('W takich obiektach można znaleźć:', 'normal', 'p-rozwadow2'),
		bullet('fragmenty starych instalacji', 'li-r1'),
		bullet('przewody prowadzone różnymi metodami', 'li-r2'),
		bullet('rozdzielnice modernizowane etapami', 'li-r3'),
		bullet('brak dokumentacji technicznej', 'li-r4'),
		richBlock(
			[
				{
					text: 'Dlatego przed każdym większym remontem warto wykonać ',
				},
				{ text: 'pomiary instalacji', link: '/uslugi/pomiary-elektryczne' },
				{ text: ' i ocenę stanu przewodów. Przy wymianie skrzynki z bezpiecznikami pomaga też wpis o ' },
				{
					text: 'modernizacji rozdzielnic',
					link: '/blog/montaz-i-modernizacja-rozdzielnic-elektrycznych',
				},
				{ text: '.' },
			],
			'normal',
			'p-rozwadow3',
		),

		block('Centrum Stalowej Woli — budownictwo COP', 'h2', 'h2-cop'),
		block(
			'W rejonie ulic Hutniczej, Wyszyńskiego czy Wolności znajdują się budynki pochodzące z pierwszego etapu budowy miasta. Projektowano je w czasach, gdy przeciętne mieszkanie korzystało jedynie z oświetlenia, radia i kilku podstawowych urządzeń.',
			'normal',
			'p-cop1',
		),
		block('Dziś w tych samych mieszkaniach działają:', 'normal', 'p-cop2'),
		bullet('płyty indukcyjne i piekarniki elektryczne', 'li-c1'),
		bullet('klimatyzatory', 'li-c2'),
		bullet('komputery i sprzęt biurowy', 'li-c3'),
		bullet('ładowarki samochodów elektrycznych', 'li-c4'),
		block(
			'To powoduje znacznie większe obciążenia instalacji niż zakładano w oryginalnym projekcie — często konieczna jest rozbudowa obwodów lub pełna modernizacja.',
			'normal',
			'p-cop3',
		),

		block('Kiedy warto rozważyć modernizację?', 'h2', 'h2-when'),
		block('Sygnałami ostrzegawczymi są:', 'normal', 'p-when1'),
		bullet('częste wyłączanie zabezpieczeń', 'li-w1'),
		bullet('nagrzewanie gniazdek', 'li-w2'),
		bullet('migotanie oświetlenia', 'li-w3'),
		bullet('brak wyłącznika różnicowoprądowego', 'li-w4'),
		richBlock(
			[
				{ text: 'W takiej sytuacji warto umówić ' },
				{ text: 'modernizację instalacji', link: '/uslugi/modernizacja-instalacji' },
				{
					text: ' — ocenimy obciążenia, dobierzemy zabezpieczenia i przygotujemy protokół pomiarów.',
				},
			],
			'normal',
			'p-when2',
		),

		block('Orientacyjne koszty w 2026 roku', 'h3', 'h3-cost'),
		bullet('pomiary instalacji + protokół: 200–500 zł', 'li-cost1'),
		bullet('modernizacja rozdzielnicy w mieszkaniu: 800–1 500 zł', 'li-cost2'),
		bullet('pełna modernizacja instalacji w mieszkaniu: wycena indywidualna', 'li-cost3'),
		block(
			'Ceny zależą od stanu przewodów, liczby obwodów i zakresu prac. Bezpłatną wycenę przygotowujemy po krótkiej rozmowie i oględzinach.',
			'normal',
			'p-cost',
		),

		block('Najczęstsze pytania', 'h2', 'h2-faq'),
		block('Czy w kamienicy w Rozwadowie można zostawić starą instalację?', 'h3', 'h3-faq1'),
		block(
			'Nie zawsze. Przed remontem kuchni lub łazienki warto ocenić stan przewodów i rozdzielnicy — często wymagana jest co najmniej wymiana obwodów i zabezpieczeń.',
			'normal',
			'p-faq1',
		),
		block('Ile kosztuje pomiar przed remontem w Stalowej Woli?', 'h3', 'h3-faq2'),
		block(
			'Orientacyjnie 200–500 zł w zależności od metrażu i zakresu. Dojazd do Stalowej Woli wliczamy w wycenę usługi.',
			'normal',
			'p-faq2',
		),
		block('Czy blok z okresu COP wymaga wymiany całej instalacji?', 'h3', 'h3-faq3'),
		block(
			'Nie zawsze — czasem wystarczy rozbudowa rozdzielnicy i dedykowane obwody pod kuchnię, klimatyzację lub ładowarkę EV. Decyzję podejmujemy po pomiarach i przeglądzie instalacji.',
			'normal',
			'p-faq3',
		),

		block('Podsumowanie', 'h2', 'h2-summary'),
		block(
			'Historia Stalowej Woli sprawiła, że w jednym mieście spotykamy zarówno zabytkowe kamienice Rozwadowa, jak i modernistyczne budynki związane z powstaniem Centralnego Okręgu Przemysłowego. Każdy z tych obiektów wymaga indywidualnego podejścia do instalacji elektrycznej i oceny jej rzeczywistego stanu technicznego.',
			'normal',
			'p-summary',
		),

		block('O autorze', 'h3', 'h3-author'),
		block(
			'Elektryk Majkel — certyfikowany elektryk z uprawnieniami SEP. Realizujemy pomiary, modernizacje i remonty instalacji w Stalowej Woli, Rozwadowie i okolicach. Dojazd, bezpłatna wycena i protokół pomiarów.',
			'normal',
			'p-author',
		),

		richBlock(
			[
				{ text: 'Planujesz remont w Stalowej Woli? Zadzwoń ' },
				{ text: '+48 537 751 820', link: 'tel:+48537751820' },
				{ text: ' lub skorzystaj z ' },
				{ text: 'formularza kontaktowego', link: '/#kontakt' },
				{ text: ' — przygotujemy wycenę pomiarów lub modernizacji.' },
			],
			'normal',
			'p-cta',
		),
	]

	const doc: Record<string, unknown> = {
		_id: 'blogPost-instalacje-stalowa-wola',
		_type: 'blogPost',
		title: 'Instalacje elektryczne w Stalowej Woli — Rozwadów i centrum miasta',
		slug: { _type: 'slug', current: 'instalacje-elektryczne-stalowa-wola-rozwadow-cop' },
		excerpt:
			'Stare kamienice w Rozwadowie vs bloki COP — różne problemy instalacji w Stalowej Woli. Objawy zużycia, pomiary przed remontem i kiedy modernizować.',
		category: 'instalacje',
		publishedAt: new Date().toISOString(),
		metaTitle: 'Instalacje w Stalowej Woli — Rozwadów i COP | Elektryk Majkel',
		metaDescription:
			'Stare kamienice w Rozwadowie vs bloki COP — różne problemy instalacji. Objawy zużycia i kiedy modernizować. Elektryk SEP z dojazdem do Stalowej Woli.',
		content,
	}

	if (coverImage?.asset?._ref) {
		doc.coverImage = {
			_type: 'image',
			asset: { _type: 'reference', _ref: coverImage.asset._ref },
			alt: coverImage.alt || 'Modernizacja instalacji elektrycznej — Stalowa Wola',
		}
	}

	await client.createOrReplace(doc)
	console.log('✔ Blog post created: instalacje-elektryczne-stalowa-wola-rozwadow-cop')
	console.log('\nURL: /blog/instalacje-elektryczne-stalowa-wola-rozwadow-cop\n')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
