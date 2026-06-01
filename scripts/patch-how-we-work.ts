/**
 * Patch service pages with individual "Jak działamy" steps.
 *
 * Usage:
 *   npx tsx scripts/patch-how-we-work.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
	console.error('Missing env vars.')
	process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false })

type Step = { _type: string; _key: string; title: string; description: string }

const stepsPerService: Record<string, Step[]> = {
	// ─── INSTALACJE ELEKTRYCZNE ──────────────────────────
	'instalacje-elektryczne': [
		{ _type: 'object', _key: 'h1', title: 'Rozmowa i wycena', description: 'Opisujesz planowaną inwestycję — nowy dom, remont, rozbudowa. Na podstawie rzutów lub wizyty na budowie przygotowujemy bezpłatną wycenę.' },
		{ _type: 'object', _key: 'h2', title: 'Projekt instalacji', description: 'Tworzymy schemat rozmieszczenia gniazdek, przełączników, obwodów i rozdzielnicy. Dostosowujemy do Twoich potrzeb — kuchenka indukcyjna, pompa ciepła, EV.' },
		{ _type: 'object', _key: 'h3', title: 'Montaż i okablowanie', description: 'Prowadzimy kable podtynkowo lub natynkowo, montujemy rozdzielnicę, gniazdka i przełączniki. Pracujemy czysto i terminowo.' },
		{ _type: 'object', _key: 'h4', title: 'Pomiary i odbiór', description: 'Wykonujemy pomiary odbiorcze, wystawiamy protokół i oświadczenie o zgodności z normami. Gotowe do odbioru budowlanego.' },
	],

	// ─── NAPRAWY AWARYJNE 24/7 ──────────────────────────
	'naprawy-awaryjne-24-7': [
		{ _type: 'object', _key: 'h1', title: 'Zgłoszenie awarii', description: 'Dzwonisz pod nasz numer — 24/7, również w weekendy. Przez telefon pomagamy ocenić pilność sytuacji i zabezpieczyć się do naszego przyjazdu.' },
		{ _type: 'object', _key: 'h2', title: 'Szybki dojazd (do 60 min)', description: 'Wyruszamy natychmiast. Na terenie Stalowej Woli i okolic dojedziemy w ciągu 60 minut. Mamy ze sobą narzędzia i najczęściej potrzebne części.' },
		{ _type: 'object', _key: 'h3', title: 'Diagnostyka i naprawa', description: 'Lokalizujemy usterkę profesjonalnym sprzętem, a następnie naprawiamy na miejscu. Zwarcia, przepięcia, uszkodzone bezpieczniki — działamy szybko i skutecznie.' },
		{ _type: 'object', _key: 'h4', title: 'Kontrola i zabezpieczenie', description: 'Po naprawie sprawdzamy całą instalację, by wykluczyć inne zagrożenia. Podpowiadamy, jak zapobiec podobnym awariom w przyszłości.' },
	],

	// ─── MODERNIZACJA INSTALACJI ─────────────────────────
	'modernizacja-instalacji': [
		{ _type: 'object', _key: 'h1', title: 'Ocena stanu instalacji', description: 'Przyjeżdżamy i sprawdzamy istniejącą instalację — stan przewodów, rozdzielnicę, zabezpieczenia. Robimy pomiary i oceniamy ryzyko.' },
		{ _type: 'object', _key: 'h2', title: 'Projekt modernizacji', description: 'Proponujemy zakres prac: wymiana przewodów aluminiowych na miedziane, nowa rozdzielnica, dodatkowe obwody. Ustalimy co można zachować, a co trzeba wymienić.' },
		{ _type: 'object', _key: 'h3', title: 'Wymiana instalacji', description: 'Wymieniamy przewody, montujemy nowoczesne zabezpieczenia (RCD, automaty). Minimalizujemy kucie ścian — tam, gdzie to możliwe, korzystamy z istniejących tras.' },
		{ _type: 'object', _key: 'h4', title: 'Pomiary i protokół', description: 'Po modernizacji wykonujemy pełne pomiary ochronne i wystawiamy oficjalny protokół. Instalacja jest bezpieczna i zgodna z normami.' },
	],

	// ─── POMIARY ELEKTRYCZNE ──────────────────────────────
	'pomiary-elektryczne': [
		{ _type: 'object', _key: 'h1', title: 'Ustalenie zakresu', description: 'Rozmawiamy o celu pomiarów — odbiór budynku, ubezpieczenie, przegląd okresowy, kontrola. Dobieramy odpowiedni zakres badań.' },
		{ _type: 'object', _key: 'h2', title: 'Pomiary na miejscu', description: 'Przyjeżdżamy z certyfikowanymi przyrządami. Mierzymy rezystancję izolacji, impedancję pętli zwarcia, ciągłość przewodów PE i skuteczność ochrony.' },
		{ _type: 'object', _key: 'h3', title: 'Analiza wyników', description: 'Analizujemy wyniki pomiarów. Jeśli coś nie spełnia norm — wskazujemy dokładnie, co wymaga naprawy i jak to zrobić.' },
		{ _type: 'object', _key: 'h4', title: 'Protokół z pieczątką SEP', description: 'Wystawiamy oficjalny protokół pomiarów elektrycznych z numerem uprawnień SEP. Dokument akceptowany przez zakłady energetyczne, ubezpieczycieli i nadzór.' },
	],

	// ─── OŚWIETLENIE LED ─────────────────────────────────
	'oswietlenie-led': [
		{ _type: 'object', _key: 'h1', title: 'Konsultacja i dobór', description: 'Rozmawiamy o Twoich oczekiwaniach — nastrój, styl, funkcjonalność. Dobieramy temperaturę barwową, rodzaj opraw i rozmieszczenie punktów świetlnych.' },
		{ _type: 'object', _key: 'h2', title: 'Projekt oświetlenia', description: 'Przygotowujemy plan rozmieszczenia opraw — strefy światła głównego, akcentowego i dekoracyjnego. Symulujemy efekt, byś wiedział czego się spodziewać.' },
		{ _type: 'object', _key: 'h3', title: 'Montaż i podłączenie', description: 'Montujemy oprawy LED, taśmy, profile aluminiowe i sterowniki. Podłączamy do instalacji elektrycznej bezpiecznie, z uprawnieniami SEP.' },
		{ _type: 'object', _key: 'h4', title: 'Konfiguracja i efekt wow', description: 'Ustawiamy ściemnianie, sceny świetlne i sterowanie z telefonu (jeśli wybierasz smart). Pokazujemy jak korzystać i cieszyć się nowym oświetleniem.' },
	],

	// ─── NAPRAWA MASZYN ELEKTRYCZNYCH ────────────────────
	'naprawa-maszyn-elektrycznych': [
		{ _type: 'object', _key: 'h1', title: 'Zgłoszenie usterki', description: 'Opisujesz problem — silnik się grzeje, pompa nie startuje, sprężarka hałasuje. Możesz przywieźć maszynę do nas lub umawiamy wizytę u Ciebie.' },
		{ _type: 'object', _key: 'h2', title: 'Diagnostyka usterki', description: 'Sprawdzamy stan uzwojeń, łożysk, kondensatorów i połączeń elektrycznych. Dokładnie identyfikujemy przyczynę problemu.' },
		{ _type: 'object', _key: 'h3', title: 'Naprawa lub regeneracja', description: 'Wymieniamy uszkodzone łożyska, kondensatory, przewijamy uzwojenia. Naprawiamy na miejscu lub w warsztacie — zależnie od stopnia uszkodzenia.' },
		{ _type: 'object', _key: 'h4', title: 'Testy i przekazanie', description: 'Po naprawie testujemy maszynę pod obciążeniem. Sprawdzamy pobór prądu, temperaturę pracy i wibracje. Oddajemy sprawną maszynę z gwarancją.' },
	],
}

async function main() {
	console.log('🔧 Patching howWeWork steps for service pages...\n')

	for (const [slug, steps] of Object.entries(stepsPerService)) {
		const doc = await client.fetch(
			`*[_type == "servicePage" && slug.current == $slug][0]{ _id }`,
			{ slug },
		)

		if (!doc) {
			console.log(`  ⚠ "${slug}" not found — skipping`)
			continue
		}

		await client.patch(doc._id).set({ howWeWork: steps }).commit()
		console.log(`  ✔ Patched "${slug}" with ${steps.length} steps`)
	}

	console.log('\n✅ Done! All service pages now have individual howWeWork steps.')
}

main().catch(err => {
	console.error('Error:', err)
	process.exit(1)
})
