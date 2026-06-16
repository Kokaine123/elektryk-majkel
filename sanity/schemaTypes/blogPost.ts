import { defineField, defineType } from 'sanity'

export const blogPost = defineType({
	name: 'blogPost',
	title: 'Wpis blogowy',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Tytuł',
			type: 'string',
			validation: rule => rule.required().min(10).max(120),
		}),
		defineField({
			name: 'slug',
			title: 'Slug (URL)',
			type: 'slug',
			description: 'Generowany z tytułu, np. "montaz-bramy-automatycznej"',
			options: { source: 'title', maxLength: 96 },
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'excerpt',
			title: 'Krótki opis (zajawka)',
			type: 'text',
			rows: 3,
			description: 'Wyświetlany na liście bloga i w meta description. 150-160 znaków.',
			validation: rule => rule.required().max(200),
		}),
		defineField({
			name: 'coverImage',
			title: 'Zdjęcie główne',
			type: 'image',
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
			name: 'content',
			title: 'Treść',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ title: 'Normal', value: 'normal' },
						{ title: 'H2', value: 'h2' },
						{ title: 'H3', value: 'h3' },
					],
					marks: {
						decorators: [
							{ title: 'Bold', value: 'strong' },
							{ title: 'Italic', value: 'em' },
						],
					},
				},
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
							title: 'Podpis zdjęcia',
							type: 'string',
						}),
					],
				},
			],
		}),
		defineField({
			name: 'publishedAt',
			title: 'Data publikacji',
			type: 'datetime',
			initialValue: () => new Date().toISOString(),
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'category',
			title: 'Kategoria',
			type: 'string',
			options: {
				list: [
					{ title: 'Instalacje', value: 'instalacje' },
					{ title: 'Naprawy', value: 'naprawy' },
					{ title: 'Bramy automatyczne', value: 'bramy' },
					{ title: 'Smart Home', value: 'smart-home' },
					{ title: 'Oświetlenie', value: 'oswietlenie' },
					{ title: 'Porady', value: 'porady' },
				],
			},
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'metaTitle',
			title: 'Meta title (SEO)',
			type: 'string',
			description: 'Tytuł w wynikach Google. Domyślnie: tytuł wpisu.',
			validation: rule => rule.max(70),
		}),
		defineField({
			name: 'metaDescription',
			title: 'Meta description (SEO)',
			type: 'text',
			rows: 2,
			description: 'Opis w wynikach Google. Domyślnie: zajawka.',
			validation: rule => rule.max(170),
		}),
	],
	orderings: [
		{
			title: 'Data publikacji (najnowsze)',
			name: 'publishedAtDesc',
			by: [{ field: 'publishedAt', direction: 'desc' }],
		},
	],
	preview: {
		select: { title: 'title', subtitle: 'category', media: 'coverImage' },
	},
})
