import { defineField, defineType } from 'sanity'

export const heroSection = defineType({
	name: 'heroSection',
	title: 'Sekcja Start (Hero)',
	type: 'document',
	fields: [
		defineField({
			name: 'badgeText',
			title: 'Tekst odznaki (badge)',
			type: 'string',
			description: 'Np. "Certyfikowany elektryk z uprawnieniami SEP". Zostaw puste, aby ukryć.',
		}),
		defineField({
			name: 'headingLine1',
			title: 'Nagłówek – linia 1',
			type: 'string',
			description: 'Np. "Profesjonalne"',
		}),
		defineField({
			name: 'headingLine2',
			title: 'Nagłówek – linia 2 (wyróżniona)',
			type: 'string',
			description: 'Np. "Usługi Elektryczne"',
		}),
		defineField({
			name: 'description',
			title: 'Opis pod nagłówkiem',
			type: 'text',
			rows: 3,
			description: 'Zostaw puste, aby ukryć.',
		}),
		defineField({
			name: 'ctaText',
			title: 'Tekst przycisku CTA',
			type: 'string',
			description: 'Np. "Bezpłatna wycena →". Zostaw puste, aby ukryć przycisk.',
		}),
		defineField({
			name: 'ctaLink',
			title: 'Link przycisku CTA',
			type: 'string',
			description: 'Np. "#kontakt"',
		}),
		defineField({
			name: 'phoneNumber',
			title: 'Numer telefonu',
			type: 'string',
			description: 'Np. "+48 123 456 789". Zostaw puste, aby ukryć przycisk telefonu.',
		}),
		defineField({
			name: 'stats',
			title: 'Statystyki',
			type: 'array',
			description: 'Usuń wszystkie, aby ukryć sekcję statystyk.',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'value', title: 'Wartość', type: 'string', validation: r => r.required() }),
						defineField({ name: 'label', title: 'Etykieta', type: 'string', validation: r => r.required() }),
					],
					preview: {
						select: { title: 'value', subtitle: 'label' },
					},
				},
			],
		}),
	],
	preview: {
		prepare: () => ({ title: 'Sekcja Start (Hero)' }),
	},
})
