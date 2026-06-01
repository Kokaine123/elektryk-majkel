/**
 * Seed service subpages with full SEO-optimized content.
 *
 * Usage:
 *   npx tsx scripts/seed-service-pages.ts
 *
 * Requires SANITY_API_WRITE_TOKEN in .env.local
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
	console.error('Missing env vars. Ensure .env.local has NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.')
	process.exit(1)
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: '2024-01-01',
	useCdn: false,
})

interface ServicePageData {
	title: string
	slug: string
	metaTitle: string
	metaDescription: string
	intro: string
	benefits: { _type: string; _key: string; title: string; description: string }[]
	scopeItems: string[]
	faq: { _type: string; _key: string; question: string; answer: string }[]
	keywords: string[]
	order: number
}

const servicePages: ServicePageData[] = [
	// ═══════════════════════════════════════════════════════
	// 1. INSTALACJE ELEKTRYCZNE
	// ═══════════════════════════════════════════════════════
	{
		title: 'Instalacje elektryczne — Stalowa Wola, Sandomierz i okolice',
		slug: 'instalacje-elektryczne',
		metaTitle: 'Instalacje Elektryczne Stalowa Wola | Elektryk Majkel',
		metaDescription: 'Kompleksowe instalacje elektryczne w domach i firmach. Uprawnienia SEP, gwarancja 5 lat. Stalowa Wola, Sandomierz, Nisko. Zadzwoń!',
		intro: 'Budujesz dom lub remontujesz mieszkanie i potrzebujesz niezawodnej instalacji elektrycznej? Stara, niedostosowana instalacja to ryzyko zwarć, przepięć, a nawet pożaru. Elektryk Majkel projektuje i montuje nowoczesne instalacje elektryczne w domach jednorodzinnych, mieszkaniach i obiektach komercyjnych na terenie Stalowej Woli, Sandomierza, Niska i okolic. Gwarantujemy bezpieczeństwo, zgodność z normami i pełną dokumentację — bo Twoje bezpieczeństwo jest priorytetem.',
		benefits: [
			{ _type: 'object', _key: 'b1', title: 'Bezpieczeństwo i uprawnienia SEP', description: 'Posiadamy pełne uprawnienia SEP do 1 kV. Każda instalacja jest wykonana zgodnie z aktualnymi normami PN-HD 60364, co gwarantuje bezpieczeństwo Twojej rodziny.' },
			{ _type: 'object', _key: 'b2', title: 'Gwarancja 5 lat na wykonane prace', description: 'Dajemy 5-letnią gwarancję na wszystkie wykonane instalacje. Jeśli cokolwiek będzie nie tak — przyjedziemy i naprawimy bezpłatnie.' },
			{ _type: 'object', _key: 'b3', title: 'Porządek po pracy i czyste wykończenie', description: 'Po zakończeniu prac sprzątamy po sobie. Kable są poprowadzone estetycznie, a wszystkie gniazdka i przełączniki zamontowane perfekcyjnie.' },
			{ _type: 'object', _key: 'b4', title: 'Terminowość i transparentne ceny', description: 'Bezpłatna wycena przed rozpoczęciem prac. Trzymamy się ustalonego harmonogramu i budżetu — bez niespodzianek na fakturze.' },
		],
		scopeItems: [
			'Montaż instalacji elektrycznej w nowym budynku',
			'Instalacja elektryczna w domu jednorodzinnym',
			'Instalacja elektryczna w mieszkaniu',
			'Montaż rozdzielnicy i bezpieczników',
			'Instalacja gniazdek elektrycznych i przełączników',
			'Prowadzenie okablowania natynkowego i podtynkowego',
			'Montaż przewodu uziemiającego (PE)',
			'Podłączenie kuchenki indukcyjnej i AGD',
			'Instalacja dedykowanych obwodów (klimatyzacja, pompa ciepła)',
			'Pomiary odbiorcze i protokoły po wykonaniu',
		],
		faq: [
			{ _type: 'object', _key: 'f1', question: 'Ile kosztuje instalacja elektryczna w domu jednorodzinnym?', answer: 'Koszt zależy od metrażu, liczby obwodów i punktów. Dla domu 100-150 m² cena orientacyjna to 8 000–15 000 zł za robociznę. Bezpłatnie przygotujemy szczegółowy kosztorys przed rozpoczęciem prac.' },
			{ _type: 'object', _key: 'f2', question: 'Jak długo trwa montaż instalacji elektrycznej?', answer: 'W nowym domu jednorodzinnym montaż trwa zazwyczaj 5-10 dni roboczych, w zależności od wielkości budynku. W mieszkaniu — około 2-5 dni.' },
			{ _type: 'object', _key: 'f3', question: 'Czy po instalacji otrzymam protokół i certyfikaty?', answer: 'Tak — po zakończeniu prac wykonujemy pomiary odbiorcze i wystawiamy pełną dokumentację: protokół pomiarów elektrycznych, oświadczenie o zgodności z normami. Dokumenty potrzebne do odbioru budynku.' },
		],
		keywords: [
			'instalacje elektryczne Stalowa Wola', 'instalacja elektryczna dom', 'elektryk instalacja Sandomierz',
			'montaż instalacji elektrycznej', 'instalacja gniazdek', 'rozdzielnica elektryczna',
			'instalacja elektryczna mieszkanie', 'uprawnienia SEP', 'elektryk Nisko',
		],
		order: 1,
	},

	// ═══════════════════════════════════════════════════════
	// 2. NAPRAWY AWARYJNE 24/7
	// ═══════════════════════════════════════════════════════
	{
		title: 'Naprawy awaryjne 24/7 — Elektryk na telefon, Stalowa Wola',
		slug: 'naprawy-awaryjne-24-7',
		metaTitle: 'Elektryk Awaryjny 24/7 Stalowa Wola | Majkel',
		metaDescription: 'Awaria prądu? Elektryk awaryjny 24/7 — dojazd do 60 min w Stalowej Woli i okolicach. Zwarcia, przepięcia, brak prądu. Zadzwoń teraz!',
		intro: 'Nagle zgasło światło, korki się wybiły, a z gniazdka poleci iskra? Awaria elektryczna to stresująca sytuacja — szczególnie nocą lub w weekend. Elektryk Majkel zapewnia pogotowie elektryczne 24/7 z czasem dojazdu do 60 minut na terenie Stalowej Woli, Sandomierza, Niska i okolic. Nie czekaj na poniedziałek — zadzwoń teraz i odzyskaj bezpieczeństwo w swoim domu.',
		benefits: [
			{ _type: 'object', _key: 'b1', title: 'Czas dojazdu do 60 minut', description: 'W przypadku awarii na terenie Stalowej Woli i najbliższych okolic dojedziemy w ciągu 60 minut. Dalsze lokalizacje — do 2 godzin.' },
			{ _type: 'object', _key: 'b2', title: 'Dostępność 24/7, również w weekendy', description: 'Pracujemy całą dobę od poniedziałku do soboty. W sytuacjach zagrożenia życia reagujemy również w niedziele.' },
			{ _type: 'object', _key: 'b3', title: 'Uprawnienia SEP i doświadczenie', description: 'Posiadamy uprawnienia SEP do prac przy instalacjach do 1 kV. Każdą awarię diagnozujemy fachowo i naprawiamy trwale — nie łatamy na chwilę.' },
			{ _type: 'object', _key: 'b4', title: 'Uczciwe ceny — bez dopłat za noc', description: 'Jasna wycena już przez telefon. Nie stosujemy ukrytych dopłat za interwencje wieczorne czy weekendowe.' },
		],
		scopeItems: [
			'Lokalizacja i naprawa zwarć w instalacji',
			'Przywracanie zasilania po awarii',
			'Naprawa lub wymiana uszkodzonych bezpieczników',
			'Naprawa przepalonego okablowania',
			'Likwidacja przepięć i ochrona przed nimi',
			'Naprawa gniazdek i włączników',
			'Wymiana uszkodzonej rozdzielnicy',
			'Diagnostyka instalacji po burzy lub przepięciu',
			'Awaryjne podłączenie agregatu prądotwórczego',
			'Przywracanie zasilania w obiektach komercyjnych',
		],
		faq: [
			{ _type: 'object', _key: 'f1', question: 'Jak szybko przyjedzie elektryk awaryjny?', answer: 'Na terenie Stalowej Woli i okolic (do 20 km) czas dojazdu to maksymalnie 60 minut. Do Sandomierza i Niska dojedziemy w ciągu 1-2 godzin. Zawsze potwierdzamy czas przez telefon.' },
			{ _type: 'object', _key: 'f2', question: 'Ile kosztuje naprawa awaryjna wieczorem?', answer: 'Nie stosujemy dopłat za porę dnia. Cena zależy wyłącznie od rodzaju i zakresu usterki. Orientacyjny koszt podamy już przez telefon.' },
			{ _type: 'object', _key: 'f3', question: 'Co zrobić, gdy w domu nie ma prądu?', answer: 'Najpierw sprawdź bezpieczniki w rozdzielnicy — możliwe, że wystarczy je załączyć. Jeśli korki wypadają ponownie, nie próbuj sam naprawiać — zadzwoń do nas. Wadliwa instalacja może grozić pożarem lub porażeniem prądem.' },
		],
		keywords: [
			'elektryk awaryjny Stalowa Wola', 'pogotowie elektryczne 24/7', 'awaria prądu Sandomierz',
			'naprawa instalacji elektrycznej', 'elektryk na telefon Nisko', 'brak prądu w domu',
			'naprawa zwarcia', 'elektryk noc weekend', 'przywracanie zasilania',
		],
		order: 2,
	},

	// ═══════════════════════════════════════════════════════
	// 3. MODERNIZACJA INSTALACJI
	// ═══════════════════════════════════════════════════════
	{
		title: 'Modernizacja instalacji elektrycznej — Stalowa Wola, Sandomierz',
		slug: 'modernizacja-instalacji',
		metaTitle: 'Modernizacja Instalacji Stalowa Wola | Elektryk',
		metaDescription: 'Wymiana starej instalacji aluminiowej na miedzianą. Bezpieczeństwo, normy, uprawnienia SEP. Stalowa Wola, Sandomierz, Nisko.',
		intro: 'Mieszkasz w starszym budynku z lat 70. czy 80.? Instalacja aluminiowa, która iskrzy, przegrzewa się i nie daje rady z dzisiejszym zapotrzebowaniem na prąd — to poważne zagrożenie. Przegrzane przewody aluminiowe są najczęstszą przyczyną pożarów w polskich domach. Elektryk Majkel wykonuje kompleksową modernizację instalacji elektrycznych — wymieniamy stare przewody aluminiowe na miedziane, montujemy nowoczesne rozdzielnice z zabezpieczeniami różnicowo-prądowymi i dostosowujemy instalację do aktualnych norm. Działamy w Stalowej Woli, Sandomierzu, Nisku i okolicach.',
		benefits: [
			{ _type: 'object', _key: 'b1', title: 'Bezpieczeństwo Twojej rodziny', description: 'Wymiana starej instalacji aluminiowej na miedzianą eliminuje ryzyko przegrzania i pożaru. Montujemy wyłączniki różnicowo-prądowe, które chronią przed porażeniem.' },
			{ _type: 'object', _key: 'b2', title: 'Uprawnienia SEP i pełna dokumentacja', description: 'Po modernizacji otrzymasz protokół pomiarów ochronnych i oświadczenie o zgodności z normami. Dokumenty niezbędne przy sprzedaży nieruchomości.' },
			{ _type: 'object', _key: 'b3', title: 'Minimalne kucie ścian', description: 'Stosujemy nowoczesne techniki prowadzenia kabli, które minimalizują ingerencję w ściany. Tam, gdzie to możliwe, wykorzystujemy istniejące trasy kablowe.' },
			{ _type: 'object', _key: 'b4', title: 'Dostosowanie do aktualnych potrzeb', description: 'Projektujemy instalację pod dzisiejsze urządzenia: kuchenka indukcyjna, pompa ciepła, klimatyzacja, ładowarka EV. Myślimy przyszłościowo.' },
		],
		scopeItems: [
			'Wymiana przewodów aluminiowych na miedziane',
			'Montaż nowoczesnej rozdzielnicy z zabezpieczeniami',
			'Instalacja wyłączników różnicowo-prądowych (RCD)',
			'Wymiana bezpieczników topikowych na automaty',
			'Przenoszenie i dodawanie gniazdek elektrycznych',
			'Dostosowanie instalacji do kuchenki indukcyjnej',
			'Modernizacja obwodów oświetleniowych',
			'Przeglądy stanu istniejącej instalacji',
			'Pomiary ochronne po modernizacji z protokołem',
			'Montaż przewodu ochronnego PE',
		],
		faq: [
			{ _type: 'object', _key: 'f1', question: 'Ile trwa wymiana instalacji w mieszkaniu?', answer: 'Modernizacja instalacji w mieszkaniu 50-70 m² trwa zazwyczaj 3-7 dni roboczych, w zależności od zakresu prac i stanu ścian. Przed rozpoczęciem ustalimy dokładny harmonogram.' },
			{ _type: 'object', _key: 'f2', question: 'Czy muszę kuć ściany przy modernizacji?', answer: 'Nie zawsze. Tam, gdzie to możliwe, wykorzystujemy istniejące trasy kablowe i prowadniki. W wielu przypadkach kucie jest minimalne lub niepotrzebne. Ocenimy to na miejscu przed wyceną.' },
			{ _type: 'object', _key: 'f3', question: 'Czy po modernizacji otrzymam protokół pomiarowy?', answer: 'Tak — po zakończeniu prac wykonujemy pełne pomiary ochronne (rezystancja izolacji, impedancja pętli zwarcia, skuteczność ochrony) i wystawiamy oficjalny protokół pomiarów elektrycznych.' },
		],
		keywords: [
			'modernizacja instalacji elektrycznej', 'wymiana instalacji aluminiowej', 'wymiana przewodów Stalowa Wola',
			'instalacja miedziana', 'modernizacja rozdzielnicy', 'uprawnienia SEP',
			'wymiana bezpieczników', 'instalacja Sandomierz', 'elektryk Nisko',
		],
		order: 3,
	},

	// ═══════════════════════════════════════════════════════
	// 4. POMIARY ELEKTRYCZNE
	// ═══════════════════════════════════════════════════════
	{
		title: 'Pomiary elektryczne z protokołem — Stalowa Wola, Sandomierz',
		slug: 'pomiary-elektryczne',
		metaTitle: 'Pomiary Elektryczne Stalowa Wola | Protokoły SEP',
		metaDescription: 'Profesjonalne pomiary elektryczne: rezystancja izolacji, impedancja pętli zwarcia. Protokoły dla firm i osób prywatnych. SEP.',
		intro: 'Potrzebujesz aktualnego protokołu pomiarów elektrycznych do ubezpieczenia, odbioru budynku lub kontroli z sanepidu? Przeterminowane pomiary to nie tylko mandat — to realne ryzyko, że Twoja instalacja nie spełnia norm bezpieczeństwa. Elektryk Majkel wykonuje profesjonalne pomiary ochronne instalacji elektrycznych z pełną dokumentacją. Posiadamy uprawnienia SEP oraz certyfikowane przyrządy pomiarowe. Obsługujemy firmy, wspólnoty mieszkaniowe i klientów indywidualnych w Stalowej Woli, Sandomierzu, Nisku i okolicach.',
		benefits: [
			{ _type: 'object', _key: 'b1', title: 'Uprawnienia SEP i certyfikowane przyrządy', description: 'Nasze pomiary mają pełną moc prawną. Posiadamy uprawnienia SEP do pomiarów ochronnych i korzystamy z kalibrowanych przyrządów pomiarowych.' },
			{ _type: 'object', _key: 'b2', title: 'Protokoły akceptowane wszędzie', description: 'Wystawiamy protokoły pomiarów elektrycznych akceptowane przez zakłady energetyczne, firmy ubezpieczeniowe, sanepid i inspektora nadzoru budowlanego.' },
			{ _type: 'object', _key: 'b3', title: 'Szybka realizacja', description: 'Pomiary w mieszkaniu wykonujemy w ciągu 1-2 godzin. Protokół otrzymujesz od ręki lub w ciągu 24 godzin.' },
			{ _type: 'object', _key: 'b4', title: 'Bezpieczeństwo i spokój', description: 'Aktualne pomiary to pewność, że Twoja instalacja jest bezpieczna. Wykryjemy potencjalne zagrożenia, zanim staną się awarią.' },
		],
		scopeItems: [
			'Pomiary rezystancji izolacji przewodów',
			'Pomiary impedancji pętli zwarcia',
			'Pomiary skuteczności ochrony przeciwporażeniowej',
			'Pomiary rezystancji uziemienia',
			'Pomiary ciągłości przewodów ochronnych',
			'Pomiary natężenia oświetlenia',
			'Protokoły pomiarów dla zakładów energetycznych',
			'Protokoły do ubezpieczenia nieruchomości',
			'Pomiary odbiorcze nowych instalacji',
			'Pomiary okresowe (co 5 lat — obowiązek prawny)',
		],
		faq: [
			{ _type: 'object', _key: 'f1', question: 'Jak często trzeba wykonywać pomiary elektryczne?', answer: 'Zgodnie z prawem budowlanym, pomiary instalacji elektrycznej w budynkach mieszkalnych należy wykonywać co 5 lat. W obiektach komercyjnych, zakładach pracy i placówkach oświatowych — co 1-5 lat, w zależności od kategorii obiektu.' },
			{ _type: 'object', _key: 'f2', question: 'Czy po pomiarach wystawiacie protokół?', answer: 'Tak — po każdym pomiarze wystawiamy oficjalny protokół pomiarów elektrycznych z numerem uprawnień SEP. Protokół zawiera wszystkie wymagane parametry: rezystancję izolacji, impedancję pętli zwarcia, skuteczność ochrony.' },
			{ _type: 'object', _key: 'f3', question: 'Ile kosztują pomiary elektryczne?', answer: 'Cena zależy od wielkości instalacji i liczby obwodów. Dla mieszkania (do 10 obwodów) to orientacyjnie 200-400 zł. Dla domu jednorodzinnego 400-800 zł. Firmy i obiekty komercyjne wyceniamy indywidualnie.' },
		],
		keywords: [
			'pomiary elektryczne Stalowa Wola', 'protokół pomiarów elektrycznych', 'rezystancja izolacji',
			'impedancja pętli zwarcia', 'pomiary ochronne', 'uprawnienia SEP pomiary',
			'pomiary okresowe instalacji', 'elektryk pomiary Sandomierz', 'protokół do ubezpieczenia',
		],
		order: 4,
	},

	// ═══════════════════════════════════════════════════════
	// 5. OŚWIETLENIE LED
	// ═══════════════════════════════════════════════════════
	{
		title: 'Oświetlenie LED — montaż i projektowanie, Stalowa Wola',
		slug: 'oswietlenie-led',
		metaTitle: 'Oświetlenie LED Stalowa Wola | Montaż i Projekt',
		metaDescription: 'Nowoczesne oświetlenie LED do domu i firmy. Oszczędność do 80% na rachunkach. Projektowanie, montaż. Stalowa Wola, Sandomierz.',
		intro: 'Wyobraź sobie ciepłe, nastrojowe światło w salonie, które podkreśla charakter wnętrza i jednocześnie obniża rachunki za prąd nawet o 80%. Nowoczesne oświetlenie LED to nie tylko oszczędność — to sposób na stworzenie wyjątkowego klimatu w każdym pomieszczeniu. Elektryk Majkel projektuje i montuje systemy oświetlenia LED w domach, mieszkaniach, ogrodach i obiektach komercyjnych. Od eleganckich taśm LED w kuchni, przez dekoracyjne oświetlenie salonu, po profesjonalne oświetlenie sklepu czy biura. Działamy w Stalowej Woli, Sandomierzu, Nisku i okolicach.',
		benefits: [
			{ _type: 'object', _key: 'b1', title: 'Oszczędność do 80% na rachunkach za prąd', description: 'Oświetlenie LED zużywa kilkukrotnie mniej energii niż tradycyjne żarówki. Przy średnim domu wymiana na LED pozwala zaoszczędzić 500-1500 zł rocznie.' },
			{ _type: 'object', _key: 'b2', title: 'Projekt dopasowany do Twojego wnętrza', description: 'Nie montujemy „byle jak". Dobieramy temperaturę barwową, rozmieszczenie punktów i rodzaj opraw tak, by oświetlenie podkreślało charakter wnętrza.' },
			{ _type: 'object', _key: 'b3', title: 'Inteligentne sterowanie światłem', description: 'Możliwość ściemniania, zmiany koloru, sterowania z pilota lub smartfona. Połączymy oświetlenie LED z systemem smart home.' },
			{ _type: 'object', _key: 'b4', title: 'Bezpieczeństwo i uprawnienia SEP', description: 'Montaż wykonujemy zgodnie z normami, z pełnymi uprawnieniami SEP. Bezpieczne podłączenie, estetyczne wykończenie, gwarancja na wykonanie.' },
		],
		scopeItems: [
			'Projektowanie oświetlenia LED dla domu i firmy',
			'Montaż taśm LED (kuchnia, salon, łazienka)',
			'Oświetlenie dekoracyjne i akcentowe',
			'Oświetlenie zewnętrzne i ogrodowe LED',
			'Montaż paneli LED w biurach i sklepach',
			'Instalacja oświetlenia z czujnikami ruchu',
			'Inteligentne sterowanie oświetleniem (smart home)',
			'Wymiana tradycyjnych opraw na LED',
			'Oświetlenie schodów, podjazdów i elewacji',
			'Dobór temperatury barwowej do pomieszczeń',
		],
		faq: [
			{ _type: 'object', _key: 'f1', question: 'Ile zaoszczędzę po wymianie na LED?', answer: 'W typowym domu jednorodzinnym wymiana tradycyjnego oświetlenia na LED pozwala zaoszczędzić 60-80% kosztów energii na oświetlenie, co przekłada się na 500-1500 zł rocznie. LED-y służą również 25-50 tysięcy godzin — kilkanaście lat bez wymiany.' },
			{ _type: 'object', _key: 'f2', question: 'Czy mogę sterować oświetleniem LED z telefonu?', answer: 'Tak — oferujemy montaż systemów inteligentnego oświetlenia kompatybilnych z aplikacjami na smartfon. Możesz ściemniać, zmieniać kolor, ustawiać harmonogramy i sterować głosem (Google Home, Alexa).' },
			{ _type: 'object', _key: 'f3', question: 'Jaką temperaturę barwową wybrać do salonu?', answer: 'Do salonu polecamy ciepłe światło 2700-3000K — tworzy przytulny, relaksujący klimat. Do kuchni i łazienki sprawdzi się neutralna biel 4000K, a do biura — chłodna biel 5000-6500K, która poprawia koncentrację.' },
		],
		keywords: [
			'oświetlenie LED Stalowa Wola', 'montaż LED dom', 'taśma LED kuchnia', 'oświetlenie LED salon',
			'oświetlenie ogrodowe LED', 'smart home oświetlenie', 'wymiana na LED',
			'oświetlenie dekoracyjne', 'elektryk LED Sandomierz', 'oszczędność energii oświetlenie',
		],
		order: 5,
	},

	// ═══════════════════════════════════════════════════════
	// 6. NAPRAWA MASZYN ELEKTRYCZNYCH
	// ═══════════════════════════════════════════════════════
	{
		title: 'Naprawa maszyn elektrycznych — silniki, pompy, sprężarki',
		slug: 'naprawa-maszyn-elektrycznych',
		metaTitle: 'Naprawa Maszyn Elektrycznych | Elektryk Majkel',
		metaDescription: 'Diagnostyka i naprawa silników elektrycznych, pomp, sprężarek, urządzeń przemysłowych. Wymiana łożysk. Stalowa Wola i okolice.',
		intro: 'Silnik elektryczny się przegrzewa, pompa nie startuje, a sprężarka dziwnie hałasuje? Każda godzina przestoju to strata pieniędzy — szczególnie w firmie produkcyjnej czy warsztacie. Elektryk Majkel specjalizuje się w profesjonalnej diagnostyce i naprawie silników elektrycznych, pomp, sprężarek oraz urządzeń przemysłowych. Oferujemy szybką naprawę na miejscu lub w warsztacie, wymianę łożysk i kondensatorów, a także kompleksową diagnostykę usterek. Działamy w Stalowej Woli, Sandomierzu, Nisku i okolicach.',
		benefits: [
			{ _type: 'object', _key: 'b1', title: 'Szybka diagnostyka — mniej przestoju', description: 'Dysponujemy profesjonalnym sprzętem diagnostycznym. Szybko zlokalizujemy usterkę i zaproponujemy najbardziej ekonomiczne rozwiązanie.' },
			{ _type: 'object', _key: 'b2', title: 'Naprawa na miejscu lub w warsztacie', description: 'Drobne usterki naprawiamy bezpośrednio u klienta. Poważniejsze naprawy (przewijanie, łożyskowanie) wykonujemy w warsztacie z szybkim terminem realizacji.' },
			{ _type: 'object', _key: 'b3', title: 'Uprawnienia SEP i doświadczenie', description: 'Posiadamy uprawnienia SEP i wieloletnie doświadczenie w naprawie maszyn elektrycznych. Pracujemy z silnikami jednofazowymi i trójfazowymi.' },
			{ _type: 'object', _key: 'b4', title: 'Obsługa firm i klientów indywidualnych', description: 'Współpracujemy z zakładami produkcyjnymi, warsztatami, gospodarstwami rolnymi i klientami indywidualnymi. Faktura VAT, umowy serwisowe.' },
		],
		scopeItems: [
			'Naprawa silników elektrycznych jednofazowych i trójfazowych',
			'Wymiana łożysk w silnikach i pompach',
			'Wymiana kondensatorów rozruchowych',
			'Naprawa pomp wodnych i głębinowych',
			'Naprawa sprężarek i kompresorów',
			'Diagnostyka usterek urządzeń przemysłowych',
			'Naprawa elektronarzędzi (wiertarki, szlifierki)',
			'Naprawa urządzeń rolniczych z napędem elektrycznym',
			'Przewijanie uzwojeń silników',
			'Konserwacja i serwis prewencyjny maszyn',
		],
		faq: [
			{ _type: 'object', _key: 'f1', question: 'Ile kosztuje naprawa silnika elektrycznego?', answer: 'Koszt zależy od rodzaju usterki i mocy silnika. Prosta naprawa (wymiana łożysk, kondensatora) to zazwyczaj 150-400 zł. Przewijanie uzwojenia silnika — od 300 zł w górę. Diagnozę i wycenę wykonujemy bezpłatnie.' },
			{ _type: 'object', _key: 'f2', question: 'Czy naprawiacie też pompy głębinowe?', answer: 'Tak — naprawiamy pompy głębinowe, pompy obiegowe, pompy ciepła i inne urządzenia z napędem elektrycznym. Oferujemy zarówno naprawę, jak i wymianę na nowe urządzenie.' },
			{ _type: 'object', _key: 'f3', question: 'Jak szybko naprawicie uszkodzoną maszynę?', answer: 'Proste naprawy realizujemy w ciągu 1-2 dni. Bardziej skomplikowane (przewijanie, wymiana części na zamówienie) — 3-7 dni. W pilnych przypadkach oferujemy przyspieszoną realizację.' },
		],
		keywords: [
			'naprawa silników elektrycznych Stalowa Wola', 'naprawa pomp', 'naprawa sprężarek',
			'wymiana łożysk silnik', 'elektryk maszyny', 'naprawa urządzeń przemysłowych',
			'przewijanie silnika', 'serwis maszyn Sandomierz', 'naprawa elektronarzędzi',
		],
		order: 6,
	},
]

async function main() {
	console.log('🔌 Seeding service pages...\n')

	for (const page of servicePages) {
		// Check if already exists
		const existing = await client.fetch(
			`*[_type == "servicePage" && slug.current == $slug][0]._id`,
			{ slug: page.slug },
		)

		if (existing) {
			console.log(`  ⏭ "${page.title}" already exists — skipping`)
			continue
		}

		const doc = {
			_type: 'servicePage',
			title: page.title,
			slug: { _type: 'slug', current: page.slug },
			metaTitle: page.metaTitle,
			metaDescription: page.metaDescription,
			intro: page.intro,
			benefits: page.benefits,
			scopeItems: page.scopeItems,
			faq: page.faq,
			keywords: page.keywords,
			order: page.order,
		}

		const result = await client.create(doc)
		console.log(`  ✔ Created "${page.title}" (${result._id})`)
	}

	console.log('\n✅ Done! All service pages seeded.')
	console.log('\n📋 URLs:')
	for (const page of servicePages) {
		console.log(`   https://elektrykmajkel.pl/uslugi/${page.slug}`)
	}
}

main().catch(err => {
	console.error('Error seeding service pages:', err)
	process.exit(1)
})
