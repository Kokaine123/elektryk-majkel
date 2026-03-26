import { defineType, defineField } from 'sanity'

export const legalPage = defineType({
	name: 'legalPage',
	title: 'Strona prawna',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Tytuł strony',
			type: 'string',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug (URL)',
			type: 'slug',
			options: { source: 'title' },
			validation: Rule => Rule.required(),
			description: 'np. polityka-prywatnosci, regulamin',
		}),
		defineField({
			name: 'metaTitle',
			title: 'Meta tytuł (SEO)',
			type: 'string',
			description: 'Tytuł wyświetlany w zakładce przeglądarki i wynikach wyszukiwania',
		}),
		defineField({
			name: 'metaDescription',
			title: 'Meta opis (SEO)',
			type: 'text',
			rows: 2,
			description: 'Opis wyświetlany w wynikach wyszukiwania Google',
		}),
		defineField({
			name: 'lastUpdated',
			title: 'Data ostatniej aktualizacji',
			type: 'date',
		}),
		defineField({
			name: 'content',
			title: 'Treść strony',
			type: 'array',
			of: [
				{
					type: 'block',
					styles: [
						{ title: 'Paragraf', value: 'normal' as const },
						{ title: 'Nagłówek sekcji (H2)', value: 'h2' as const },
						{ title: 'Podtytuł (H3)', value: 'h3' as const },
					],
					lists: [
						{ title: 'Lista punktowana', value: 'bullet' as const },
						{ title: 'Lista numerowana', value: 'number' as const },
					],
					marks: {
						decorators: [
							{ title: 'Pogrubienie', value: 'strong' as const },
							{ title: 'Kursywa', value: 'em' as const },
						],
						annotations: [
							{
								name: 'link',
								type: 'object',
								title: 'Link',
								fields: [
									{
										name: 'href',
										type: 'url',
										title: 'URL',
										validation: (Rule: any) =>
											Rule.uri({
												allowRelative: true,
												scheme: ['http', 'https', 'mailto', 'tel'],
											}),
									},
									{
										name: 'blank',
										type: 'boolean',
										title: 'Otwórz w nowej karcie',
										initialValue: false,
									},
								],
							},
						],
					},
				},
			],
		}),
	],
	preview: {
		select: { title: 'title', subtitle: 'lastUpdated' },
		prepare({ title, subtitle }) {
			return {
				title,
				subtitle: subtitle ? `Aktualizacja: ${subtitle}` : 'Brak daty aktualizacji',
			}
		},
	},
})
