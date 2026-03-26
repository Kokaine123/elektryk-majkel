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

// Helper: create a Portable Text block
function block(text: string, style: string = 'normal', markDefs: any[] = [], children?: any[]) {
	return {
		_type: 'block',
		_key: Math.random().toString(36).slice(2, 10),
		style,
		markDefs,
		children: children || [
			{
				_type: 'span',
				_key: Math.random().toString(36).slice(2, 10),
				text,
				marks: [],
			},
		],
	}
}

function boldSpan(text: string) {
	return {
		_type: 'span',
		_key: Math.random().toString(36).slice(2, 10),
		text,
		marks: ['strong'],
	}
}

function span(text: string) {
	return {
		_type: 'span',
		_key: Math.random().toString(36).slice(2, 10),
		text,
		marks: [],
	}
}

function listItem(text: string, level: number = 1) {
	return {
		_type: 'block',
		_key: Math.random().toString(36).slice(2, 10),
		style: 'normal',
		listItem: 'bullet',
		level,
		markDefs: [],
		children: [span(text)],
	}
}

const FIRMA = 'Elektryk Majkel Michał Środek'
const NIP = '8652592539'
const REGON = '544124643'
const PHONE = '+48 537 751 820'
const EMAIL = 'elektryk.majkel@gmail.com'
const LOCATION = 'Radomyśl nad Sanem'

async function main() {
	// ── Regulamin ─────────────────────────────────────────
	const regulaminContent = [
		block('Regulamin', 'h2'),
		block('', 'normal', [], [boldSpan('Właściciel serwisu: '), span(`${FIRMA}`)]),
		block('', 'normal', [], [boldSpan('NIP: '), span(NIP)]),
		block('', 'normal', [], [boldSpan('REGON: '), span(REGON)]),
		block('', 'normal', [], [boldSpan('Adres: '), span(LOCATION)]),
		block('', 'normal', [], [boldSpan('Telefon: '), span(PHONE)]),
		block('', 'normal', [], [boldSpan('E-mail: '), span(EMAIL)]),

		block('§1 Postanowienia ogólne', 'h2'),
		listItem(
			`Niniejszy regulamin określa zasady korzystania z serwisu internetowego elektrykmajkel.pl, prowadzonego przez ${FIRMA}, NIP: ${NIP}, REGON: ${REGON}.`,
		),
		listItem(
			'Serwis służy do prezentacji oferty usług elektrycznych oraz umożliwia kontakt z usługodawcą za pośrednictwem formularza kontaktowego.',
		),
		listItem('Korzystanie z serwisu oznacza akceptację niniejszego regulaminu.'),

		block('§2 Definicje', 'h2'),
		listItem(`Usługodawca — ${FIRMA}, NIP: ${NIP}, REGON: ${REGON}.`),
		listItem('Użytkownik — każda osoba korzystająca z serwisu.'),
		listItem('Serwis — strona internetowa dostępna pod adresem elektrykmajkel.pl.'),
		listItem('Formularz kontaktowy — funkcjonalność serwisu umożliwiająca przesłanie wiadomości do Usługodawcy.'),

		block('§3 Zakres usług', 'h2'),
		listItem('Serwis ma charakter informacyjny i prezentuje ofertę usług elektrycznych.'),
		listItem('Serwis umożliwia przesyłanie zapytań za pośrednictwem formularza kontaktowego.'),
		listItem(
			'Przesłanie formularza kontaktowego nie stanowi zawarcia umowy. Szczegóły zlecenia ustalane są indywidualnie z Usługodawcą.',
		),

		block('§4 Formularz kontaktowy', 'h2'),
		listItem(
			'Użytkownik może przesłać wiadomość za pośrednictwem formularza kontaktowego, podając: imię i nazwisko, numer telefonu, adres e-mail, rodzaj usługi oraz opis problemu.',
		),
		listItem('Podanie danych jest dobrowolne, ale niezbędne do realizacji zapytania.'),
		listItem('Usługodawca zobowiązuje się do odpowiedzi na zapytanie w ciągu 24 godzin roboczych.'),

		block('§5 Odpowiedzialność', 'h2'),
		listItem('Usługodawca dokłada wszelkich starań, aby informacje zawarte w serwisie były aktualne i rzetelne.'),
		listItem(
			'Usługodawca nie ponosi odpowiedzialności za przerwy w działaniu serwisu wynikające z przyczyn technicznych.',
		),
		listItem(
			'Usługodawca nie ponosi odpowiedzialności za treści zamieszczone na stronach, do których prowadzą linki zewnętrzne.',
		),

		block('§6 Prawa autorskie', 'h2'),
		listItem(
			'Wszelkie treści, zdjęcia, grafiki i materiały zamieszczone w serwisie są własnością Usługodawcy i podlegają ochronie prawa autorskiego.',
		),
		listItem(
			'Kopiowanie, rozpowszechnianie lub wykorzystywanie materiałów z serwisu bez pisemnej zgody Usługodawcy jest zabronione.',
		),

		block('§7 Postanowienia końcowe', 'h2'),
		listItem(
			'Usługodawca zastrzega sobie prawo do zmiany regulaminu. Zmiany wchodzą w życie z chwilą publikacji w serwisie.',
		),
		listItem('W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego.'),
		listItem(`W przypadku pytań lub wątpliwości prosimy o kontakt: ${EMAIL} lub ${PHONE}.`),
	]

	await client.createOrReplace({
		_id: 'legal-regulamin',
		_type: 'legalPage',
		title: 'Regulamin',
		slug: { _type: 'slug', current: 'regulamin' },
		metaTitle: 'Regulamin | Elektryk Majkel',
		metaDescription: 'Regulamin korzystania z serwisu internetowego elektrykmajkel.pl.',
		lastUpdated: '2026-03-24',
		content: regulaminContent,
	})
	console.log('  ✔ Regulamin')

	// ── Polityka prywatności ──────────────────────────────
	const politykaContent = [
		block('Polityka prywatności', 'h2'),
		block('', 'normal', [], [boldSpan('Administrator danych: '), span(`${FIRMA}, NIP: ${NIP}, REGON: ${REGON}`)]),
		block('', 'normal', [], [boldSpan('Adres: '), span(LOCATION)]),
		block('', 'normal', [], [boldSpan('Kontakt: '), span(`${EMAIL}, ${PHONE}`)]),

		block('§1 Informacje ogólne', 'h2'),
		listItem(`Administratorem danych osobowych jest ${FIRMA}, NIP: ${NIP}, REGON: ${REGON}, z siedzibą w ${LOCATION}.`),
		listItem(
			'Niniejsza polityka prywatności określa zasady przetwarzania danych osobowych pozyskanych za pośrednictwem serwisu elektrykmajkel.pl.',
		),
		listItem(
			'Dane osobowe przetwarzane są zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO) oraz ustawą o ochronie danych osobowych.',
		),

		block('§2 Zakres zbieranych danych', 'h2'),
		block('Serwis zbiera dane osobowe wyłącznie w zakresie niezbędnym do realizacji usług:'),
		listItem('Imię i nazwisko'),
		listItem('Numer telefonu'),
		listItem('Adres e-mail'),
		listItem('Treść wiadomości przesłanej przez formularz kontaktowy'),
		listItem('Dane techniczne (adres IP, rodzaj przeglądarki) — zbierane automatycznie'),

		block('§3 Cel i podstawa przetwarzania danych', 'h2'),
		listItem(
			'Odpowiedź na zapytania przesłane przez formularz kontaktowy (art. 6 ust. 1 lit. b RODO — realizacja umowy lub działania przed jej zawarciem).',
		),
		listItem('Kontakt telefoniczny lub mailowy w sprawie wyceny i realizacji usług (art. 6 ust. 1 lit. b RODO).'),
		listItem('Realizacja obowiązków prawnych, np. prowadzenie dokumentacji podatkowej (art. 6 ust. 1 lit. c RODO).'),
		listItem(
			'Prawnie uzasadniony interes administratora — analiza ruchu na stronie, obrona przed roszczeniami (art. 6 ust. 1 lit. f RODO).',
		),

		block('§4 Okres przechowywania danych', 'h2'),
		listItem(
			'Dane z formularza kontaktowego — do czasu zakończenia korespondencji, nie dłużej niż 12 miesięcy od ostatniego kontaktu.',
		),
		listItem('Dane związane z realizacją usług — przez okres wymagany przepisami prawa podatkowego (5 lat).'),
		listItem('Dane techniczne (logs) — do 12 miesięcy.'),

		block('§5 Prawa użytkownika', 'h2'),
		block('Każda osoba, której dane dotyczą, ma prawo do:'),
		listItem('Dostępu do swoich danych osobowych'),
		listItem('Sprostowania (poprawienia) danych'),
		listItem('Usunięcia danych („prawo do bycia zapomnianym")'),
		listItem('Ograniczenia przetwarzania'),
		listItem('Przenoszenia danych'),
		listItem('Wniesienia sprzeciwu wobec przetwarzania'),
		listItem('Wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa)'),
		block(`W celu realizacji powyższych praw prosimy o kontakt: ${EMAIL}.`),

		block('§6 Pliki cookies', 'h2'),
		listItem('Serwis wykorzystuje pliki cookies w celu zapewnienia prawidłowego działania strony oraz analizy ruchu.'),
		listItem('Cookies nie służą identyfikacji użytkownika i nie zawierają danych osobowych.'),
		listItem('Użytkownik może zmienić ustawienia cookies w swojej przeglądarce internetowej.'),

		block('§7 Udostępnianie danych', 'h2'),
		listItem('Dane osobowe nie są sprzedawane ani udostępniane podmiotom trzecim w celach marketingowych.'),
		listItem(
			'Dane mogą być przekazane podmiotom świadczącym usługi na rzecz Administratora (hosting, obsługa IT) na podstawie umowy powierzenia przetwarzania danych.',
		),

		block('§8 Bezpieczeństwo danych', 'h2'),
		block(
			'Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające ochronę przetwarzanych danych osobowych, w szczególności zabezpiecza dane przed udostępnieniem osobom nieupoważnionym, utratą czy uszkodzeniem.',
		),

		block('§9 Zmiany polityki prywatności', 'h2'),
		block(
			'Administrator zastrzega sobie prawo do wprowadzenia zmian w polityce prywatności. O wszelkich zmianach użytkownicy zostaną poinformowani poprzez publikację zaktualizowanej wersji w serwisie.',
		),

		block('', 'normal', [], [span('Data ostatniej aktualizacji: '), boldSpan('24 marca 2026 r.')]),
	]

	await client.createOrReplace({
		_id: 'legal-polityka-prywatnosci',
		_type: 'legalPage',
		title: 'Polityka prywatności',
		slug: { _type: 'slug', current: 'polityka-prywatnosci' },
		metaTitle: 'Polityka prywatności | Elektryk Majkel',
		metaDescription:
			'Polityka prywatności serwisu elektrykmajkel.pl. Informacje o przetwarzaniu danych osobowych zgodnie z RODO.',
		lastUpdated: '2026-03-24',
		content: politykaContent,
	})
	console.log('  ✔ Polityka prywatności')

	console.log('\n✅ Strony prawne zaktualizowane!')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
