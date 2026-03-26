import { defineField, defineType } from 'sanity'

export const seoSettings = defineType({
	name: 'seoSettings',
	title: 'SEO / Meta dane',
	type: 'document',
	groups: [
		{ name: 'basic', title: '📝 Podstawowe', default: true },
		{ name: 'og', title: '📱 Open Graph' },
		{ name: 'twitter', title: '🐦 Twitter Card' },
		{ name: 'jsonld', title: '🏢 Schema.org / JSON-LD' },
		{ name: 'robots', title: '🤖 Robots / Crawling' },
		{ name: 'local', title: '📍 Local SEO' },
		{ name: 'analytics', title: '📊 Analityka' },
	],
	fields: [
		// ═══════════════════════════════════════════════════
		// GRUPA: Podstawowe meta dane
		// ═══════════════════════════════════════════════════
		defineField({
			name: 'siteTitle',
			title: 'Tytuł strony (title tag)',
			type: 'string',
			group: 'basic',
			description: 'Wyświetlany w zakładce przeglądarki i wynikach Google. Optymalnie 50-60 znaków.',
			validation: rule => rule.required().max(70),
		}),
		defineField({
			name: 'siteDescription',
			title: 'Meta description',
			type: 'text',
			rows: 3,
			group: 'basic',
			description: 'Opis wyświetlany w wynikach Google. Optymalnie 150-160 znaków.',
			validation: rule => rule.required().max(200),
		}),
		defineField({
			name: 'keywords',
			title: 'Słowa kluczowe',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'basic',
			description: 'Frazy kluczowe na które chcesz się pozycjonować.',
		}),
		defineField({
			name: 'canonicalUrl',
			title: 'Canonical URL',
			type: 'url',
			group: 'basic',
			description: 'Główny adres strony (np. https://elektrykmajkel.pl). Zapobiega duplikatom w Google.',
			initialValue: 'https://elektrykmajkel.pl',
		}),

		// ═══════════════════════════════════════════════════
		// GRUPA: Open Graph (Facebook, LinkedIn, Messenger)
		// ═══════════════════════════════════════════════════
		defineField({
			name: 'ogTitle',
			title: 'Tytuł OG',
			type: 'string',
			group: 'og',
			description: 'Tytuł wyświetlany przy udostępnieniu na Facebooku/LinkedInie. Jeśli puste — użyje tytułu strony.',
		}),
		defineField({
			name: 'ogDescription',
			title: 'Opis OG',
			type: 'text',
			rows: 2,
			group: 'og',
			description: 'Opis wyświetlany w podglądzie linku. Jeśli puste — użyje meta description.',
		}),
		defineField({
			name: 'ogImage',
			title: 'Obrazek OG (1200×630px)',
			type: 'image',
			group: 'og',
			description: 'Obrazek widoczny przy udostępnieniu linku. Zalecany rozmiar: 1200×630px.',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Tekst alternatywny',
					type: 'string',
				}),
			],
		}),
		defineField({
			name: 'ogType',
			title: 'Typ OG',
			type: 'string',
			group: 'og',
			options: {
				list: [
					{ title: 'Website', value: 'website' },
					{ title: 'Business', value: 'business.business' },
					{ title: 'Article', value: 'article' },
				],
			},
			initialValue: 'website',
		}),

		// ═══════════════════════════════════════════════════
		// GRUPA: Twitter Card
		// ═══════════════════════════════════════════════════
		defineField({
			name: 'twitterCard',
			title: 'Typ karty Twitter',
			type: 'string',
			group: 'twitter',
			options: {
				list: [
					{ title: 'Duży obrazek (summary_large_image)', value: 'summary_large_image' },
					{ title: 'Mały obrazek (summary)', value: 'summary' },
				],
			},
			initialValue: 'summary_large_image',
		}),
		defineField({
			name: 'twitterTitle',
			title: 'Tytuł Twitter',
			type: 'string',
			group: 'twitter',
			description: 'Jeśli puste — użyje tytułu strony.',
		}),
		defineField({
			name: 'twitterDescription',
			title: 'Opis Twitter',
			type: 'text',
			rows: 2,
			group: 'twitter',
			description: 'Jeśli puste — użyje meta description.',
		}),
		defineField({
			name: 'twitterImage',
			title: 'Obrazek Twitter',
			type: 'image',
			group: 'twitter',
			description: 'Osobny obrazek dla Twittera. Jeśli puste — użyje OG image.',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Tekst alternatywny',
					type: 'string',
				}),
			],
		}),

		// ═══════════════════════════════════════════════════
		// GRUPA: Schema.org / JSON-LD (Structured Data)
		// ═══════════════════════════════════════════════════
		defineField({
			name: 'businessName',
			title: 'Nazwa firmy',
			type: 'string',
			group: 'jsonld',
			initialValue: 'Elektryk Majkel',
		}),
		defineField({
			name: 'businessType',
			title: 'Typ działalności (Schema.org)',
			type: 'string',
			group: 'jsonld',
			options: {
				list: [
					{ title: 'Electrician', value: 'Electrician' },
					{ title: 'HomeAndConstructionBusiness', value: 'HomeAndConstructionBusiness' },
					{ title: 'LocalBusiness', value: 'LocalBusiness' },
				],
			},
			initialValue: 'Electrician',
		}),
		defineField({
			name: 'businessPhone',
			title: 'Telefon firmy (JSON-LD)',
			type: 'string',
			group: 'jsonld',
			description: 'Format międzynarodowy, np. +48123456789',
		}),
		defineField({
			name: 'businessEmail',
			title: 'Email firmy (JSON-LD)',
			type: 'string',
			group: 'jsonld',
		}),
		defineField({
			name: 'businessUrl',
			title: 'URL strony',
			type: 'url',
			group: 'jsonld',
		}),
		defineField({
			name: 'addressStreet',
			title: 'Ulica',
			type: 'string',
			group: 'jsonld',
		}),
		defineField({
			name: 'addressCity',
			title: 'Miasto',
			type: 'string',
			group: 'jsonld',
			initialValue: 'Radomyśl nad Sanem',
		}),
		defineField({
			name: 'addressPostalCode',
			title: 'Kod pocztowy',
			type: 'string',
			group: 'jsonld',
		}),
		defineField({
			name: 'addressCountry',
			title: 'Kraj (kod ISO)',
			type: 'string',
			group: 'jsonld',
			initialValue: 'PL',
		}),
		defineField({
			name: 'geoLatitude',
			title: 'Latitude (szer. geogr.)',
			type: 'number',
			group: 'jsonld',
			initialValue: 50.6808,
		}),
		defineField({
			name: 'geoLongitude',
			title: 'Longitude (dł. geogr.)',
			type: 'number',
			group: 'jsonld',
			initialValue: 21.9447,
		}),
		defineField({
			name: 'serviceRadius',
			title: 'Promień działania (m)',
			type: 'number',
			group: 'jsonld',
			description: 'W metrach. 50km = 50000, 100km = 100000',
			initialValue: 50000,
		}),
		defineField({
			name: 'priceRange',
			title: 'Zakres cenowy',
			type: 'string',
			group: 'jsonld',
			options: {
				list: [
					{ title: '$ (Tanie)', value: '$' },
					{ title: '$$ (Umiarkowane)', value: '$$' },
					{ title: '$$$ (Drogie)', value: '$$$' },
				],
			},
			initialValue: '$$',
		}),
		defineField({
			name: 'logo',
			title: 'Logo firmy',
			type: 'image',
			group: 'jsonld',
			description: 'Logo wyświetlane w rich snippets Google. Zalecane: kwadrat min. 112×112px.',
			options: { hotspot: false },
		}),
		defineField({
			name: 'openingHours',
			title: 'Godziny otwarcia',
			type: 'array',
			group: 'jsonld',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'days',
							title: 'Dni (po angielsku)',
							type: 'array',
							of: [{ type: 'string' }],
							options: {
								list: [
									{ title: 'Poniedziałek', value: 'Monday' },
									{ title: 'Wtorek', value: 'Tuesday' },
									{ title: 'Środa', value: 'Wednesday' },
									{ title: 'Czwartek', value: 'Thursday' },
									{ title: 'Piątek', value: 'Friday' },
									{ title: 'Sobota', value: 'Saturday' },
									{ title: 'Niedziela', value: 'Sunday' },
								],
							},
						}),
						defineField({
							name: 'opens',
							title: 'Otwarcie (np. 07:00)',
							type: 'string',
						}),
						defineField({
							name: 'closes',
							title: 'Zamknięcie (np. 18:00)',
							type: 'string',
						}),
					],
					preview: {
						select: { days: 'days', opens: 'opens', closes: 'closes' },
						prepare: ({ days, opens, closes }: { days?: string[]; opens?: string; closes?: string }) => ({
							title: `${days?.join(', ') || '?'}: ${opens || '?'} - ${closes || '?'}`,
						}),
					},
				},
			],
		}),
		defineField({
			name: 'socialProfiles',
			title: 'Profile społecznościowe (sameAs)',
			type: 'array',
			of: [{ type: 'url' }],
			group: 'jsonld',
			description: 'Linki do Facebooka, Instagrama, Google Business Profile itp.',
		}),
		defineField({
			name: 'servicesList',
			title: 'Lista usług (Schema.org OfferCatalog)',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'jsonld',
			description: 'Nazwy usług do wyświetlenia w structured data Google.',
		}),

		// ═══════════════════════════════════════════════════
		// GRUPA: Robots / Crawling
		// ═══════════════════════════════════════════════════
		defineField({
			name: 'robotsIndex',
			title: 'Pozwól na indeksowanie (index)',
			type: 'boolean',
			group: 'robots',
			initialValue: true,
			description: 'Wyłączenie = strona zniknie z Google.',
		}),
		defineField({
			name: 'robotsFollow',
			title: 'Pozwól śledzić linki (follow)',
			type: 'boolean',
			group: 'robots',
			initialValue: true,
		}),
		defineField({
			name: 'robotsNoarchive',
			title: 'Blokuj cache Google (noarchive)',
			type: 'boolean',
			group: 'robots',
			initialValue: false,
		}),
		defineField({
			name: 'googleSiteVerification',
			title: 'Google Search Console — kod weryfikacji',
			type: 'string',
			group: 'robots',
			description: 'Wartość meta tagu google-site-verification.',
		}),
		defineField({
			name: 'bingSiteVerification',
			title: 'Bing Webmaster — kod weryfikacji',
			type: 'string',
			group: 'robots',
			description: 'Wartość meta tagu msvalidate.01.',
		}),

		// ═══════════════════════════════════════════════════
		// GRUPA: Local SEO
		// ═══════════════════════════════════════════════════
		defineField({
			name: 'googleBusinessUrl',
			title: 'Link do wizytówki Google Business',
			type: 'url',
			group: 'local',
			description: 'URL profilu Google Business Profile (dawniej Google Moja Firma).',
		}),
		defineField({
			name: 'googleBusinessReviewsUrl',
			title: 'Link do opinii Google',
			type: 'url',
			group: 'local',
			description: 'Bezpośredni link do wystawiania opinii.',
		}),
		defineField({
			name: 'serviceAreas',
			title: 'Obszary usługowe',
			type: 'array',
			group: 'local',
			description: 'Miasta/regiony z opisami — pomocne dla pozycjonowania lokalnego.',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'name',
							title: 'Nazwa miasta / regionu',
							type: 'string',
							validation: rule => rule.required(),
						}),
						defineField({
							name: 'description',
							title: 'Opis (opcjonalny)',
							type: 'text',
							rows: 2,
						}),
					],
					preview: {
						select: { title: 'name', subtitle: 'description' },
					},
				},
			],
		}),

		// ═══════════════════════════════════════════════════
		// GRUPA: Analityka
		// ═══════════════════════════════════════════════════
		defineField({
			name: 'googleAnalyticsId',
			title: 'Google Analytics 4 — ID',
			type: 'string',
			group: 'analytics',
			description: 'Format: G-XXXXXXXXXX',
			validation: rule =>
				rule.custom(val => {
					if (val && !/^G-[A-Z0-9]+$/.test(val)) return 'Format: G-XXXXXXXXXX'
					return true
				}),
		}),
		defineField({
			name: 'googleTagManagerId',
			title: 'Google Tag Manager — ID',
			type: 'string',
			group: 'analytics',
			description: 'Format: GTM-XXXXXXX',
			validation: rule =>
				rule.custom(val => {
					if (val && !/^GTM-[A-Z0-9]+$/.test(val)) return 'Format: GTM-XXXXXXX'
					return true
				}),
		}),
		defineField({
			name: 'facebookPixelId',
			title: 'Facebook Pixel — ID',
			type: 'string',
			group: 'analytics',
			description: 'ID numeryczne piksela Facebooka.',
		}),
	],
	preview: {
		prepare: () => ({ title: 'Ustawienia SEO' }),
	},
})
