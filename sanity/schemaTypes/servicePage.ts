import { defineField, defineType } from 'sanity'

export const servicePage = defineType({
	name: 'servicePage',
	title: 'Podstrona usługi',
	type: 'document',
	groups: [
		{ name: 'seo', title: 'SEO' },
		{ name: 'hero', title: 'Hero' },
		{ name: 'benefits', title: 'Korzyści' },
		{ name: 'howWeWork', title: 'Jak działamy' },
		{ name: 'gallery', title: 'Galeria' },
		{ name: 'scope', title: 'Zakres usługi' },
		{ name: 'cta', title: 'CTA' },
		{ name: 'faq', title: 'FAQ' },
		{ name: 'settings', title: 'Ustawienia' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Nazwa usługi (H1)',
			type: 'string',
			validation: rule => rule.required(),
			group: 'hero',
		}),
		defineField({
			name: 'slug',
			title: 'Slug (URL)',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: rule => rule.required(),
			group: 'seo',
		}),
		defineField({
			name: 'metaTitle',
			title: 'Meta Title (max 60 znaków)',
			type: 'string',
			validation: rule => rule.max(60),
			group: 'seo',
		}),
		defineField({
			name: 'metaDescription',
			title: 'Meta Description (max 155 znaków)',
			type: 'string',
			validation: rule => rule.max(155),
			group: 'seo',
		}),
		defineField({
			name: 'keywords',
			title: 'Słowa kluczowe SEO',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'seo',
		}),

		// --- Hero ---
		defineField({
			name: 'heroImage',
			title: 'Zdjęcie główne (hero)',
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Tekst alternatywny',
					type: 'string',
				}),
			],
			group: 'hero',
		}),
		defineField({
			name: 'heroBadge',
			title: 'Tekst odznaki (nad tytułem)',
			type: 'string',
			description: 'Np. "Stalowa Wola • Sandomierz • Nisko i okolice"',
			group: 'hero',
		}),
		defineField({
			name: 'intro',
			title: 'Wstęp (problem-rozwiązanie)',
			type: 'text',
			rows: 6,
			validation: rule => rule.required(),
			group: 'hero',
		}),
		defineField({
			name: 'heroCtaSecondary',
			title: 'Tekst drugiego przycisku hero',
			type: 'string',
			description: 'Np. "Bezpłatna wycena"',
			group: 'hero',
		}),

		// --- Korzyści ---
		defineField({
			name: 'benefitsLabel',
			title: 'Etykieta sekcji',
			type: 'string',
			description: 'Np. "Dlaczego my"',
			group: 'benefits',
		}),
		defineField({
			name: 'benefitsHeading',
			title: 'Nagłówek sekcji',
			type: 'string',
			description: 'Np. "Dlaczego warto wybrać Elektryka Majkla?"',
			group: 'benefits',
		}),
		defineField({
			name: 'benefits',
			title: 'Korzyści (dlaczego warto)',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'title', title: 'Tytuł', type: 'string', validation: r => r.required() }),
						defineField({ name: 'description', title: 'Opis', type: 'text', rows: 2, validation: r => r.required() }),
					],
					preview: { select: { title: 'title', subtitle: 'description' } },
				},
			],
			group: 'benefits',
		}),

		// --- Jak działamy ---
		defineField({
			name: 'howWeWorkLabel',
			title: 'Etykieta sekcji',
			type: 'string',
			description: 'Np. "Proces realizacji"',
			group: 'howWeWork',
		}),
		defineField({
			name: 'howWeWorkHeading',
			title: 'Nagłówek sekcji',
			type: 'string',
			description: 'Np. "Jak wygląda nasza praca?"',
			group: 'howWeWork',
		}),
		defineField({
			name: 'howWeWorkDescription',
			title: 'Opis pod nagłówkiem',
			type: 'string',
			description: 'Np. "Przejrzysty proces od zgłoszenia do gotowego efektu — bez niespodzianek."',
			group: 'howWeWork',
		}),
		defineField({
			name: 'howWeWork',
			title: 'Jak działamy (kroki procesu)',
			description: 'Indywidualne kroki procesu realizacji tej usługi (4 kroki)',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'title', title: 'Tytuł kroku', type: 'string', validation: r => r.required() }),
						defineField({ name: 'description', title: 'Opis kroku', type: 'text', rows: 2, validation: r => r.required() }),
					],
					preview: { select: { title: 'title', subtitle: 'description' } },
				},
			],
			group: 'howWeWork',
		}),

		// --- Galeria ---
		defineField({
			name: 'galleryHeading',
			title: 'Nagłówek sekcji galerii',
			type: 'string',
			description: 'Np. "Nasze realizacje"',
			group: 'gallery',
		}),
		defineField({
			name: 'galleryImages',
			title: 'Galeria zdjęć',
			type: 'array',
			of: [
				{
					type: 'image',
					options: { hotspot: true },
					fields: [
						defineField({
							name: 'alt',
							title: 'Tekst alternatywny',
							type: 'string',
						}),
						defineField({
							name: 'caption',
							title: 'Podpis',
							type: 'string',
						}),
					],
				},
			],
			group: 'gallery',
		}),

		// --- Zakres usługi ---
		defineField({
			name: 'scopeLabel',
			title: 'Etykieta sekcji',
			type: 'string',
			description: 'Np. "Szczegóły"',
			group: 'scope',
		}),
		defineField({
			name: 'scopeHeading',
			title: 'Nagłówek sekcji',
			type: 'string',
			description: 'Np. "Co wchodzi w zakres usługi?"',
			group: 'scope',
		}),
		defineField({
			name: 'scopeItems',
			title: 'Zakres usługi (lista punktowa)',
			type: 'array',
			of: [{ type: 'string' }],
			group: 'scope',
		}),

		// --- CTA ---
		defineField({
			name: 'ctaHeading',
			title: 'Nagłówek CTA',
			type: 'string',
			description: 'Np. "Potrzebujesz pomocy z montażem instalacji?" — domyślnie generowany z nazwy usługi',
			group: 'cta',
		}),
		defineField({
			name: 'ctaDescription',
			title: 'Opis CTA',
			type: 'string',
			description: 'Np. "Skontaktuj się z nami — wycena gratis! Działamy w Stalowej Woli, Sandomierzu, Nisku i okolicach."',
			group: 'cta',
		}),

		// --- FAQ ---
		defineField({
			name: 'faqHeading',
			title: 'Nagłówek sekcji FAQ',
			type: 'string',
			description: 'Np. "Najczęściej zadawane pytania"',
			group: 'faq',
		}),
		defineField({
			name: 'faqDescription',
			title: 'Opis pod nagłówkiem FAQ',
			type: 'string',
			description: 'Np. "Montaż instalacji — odpowiedzi na ważne pytania"',
			group: 'faq',
		}),
		defineField({
			name: 'faq',
			title: 'FAQ (pytania i odpowiedzi)',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'question', title: 'Pytanie', type: 'string', validation: r => r.required() }),
						defineField({ name: 'answer', title: 'Odpowiedź', type: 'text', rows: 3, validation: r => r.required() }),
					],
					preview: { select: { title: 'question' } },
				},
			],
			group: 'faq',
		}),

		// --- Ustawienia ---
		defineField({
			name: 'order',
			title: 'Kolejność',
			type: 'number',
			initialValue: 0,
			group: 'settings',
		}),
	],
	orderings: [{ title: 'Kolejność', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
	preview: {
		select: { title: 'title', subtitle: 'metaTitle' },
	},
})
