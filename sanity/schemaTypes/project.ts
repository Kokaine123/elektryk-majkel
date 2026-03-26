import { defineField, defineType } from 'sanity'

export const project = defineType({
	name: 'project',
	title: 'Realizacja',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Tytuł',
			type: 'string',
			validation: rule => rule.required().min(3).max(100),
		}),
		defineField({
			name: 'category',
			title: 'Kategoria',
			type: 'string',
			options: {
				list: [
					{ title: 'Instalacje', value: 'Instalacje' },
					{ title: 'Modernizacja', value: 'Modernizacja' },
					{ title: 'Smart Home', value: 'Smart Home' },
					{ title: 'Automatyka', value: 'Automatyka' },
					{ title: 'Awaria', value: 'Awaria' },
					{ title: 'Fotowoltaika', value: 'Fotowoltaika' },
					{ title: 'Oświetlenie', value: 'Oświetlenie' },
					{ title: 'Pomiary', value: 'Pomiary' },
				],
			},
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Opis',
			type: 'text',
			rows: 3,
			validation: rule => rule.required().min(10).max(300),
		}),
		defineField({
			name: 'image',
			title: 'Zdjęcie',
			type: 'image',
			options: {
				hotspot: true,
			},
			fields: [
				defineField({
					name: 'alt',
					title: 'Tekst alternatywny (opis zdjęcia)',
					type: 'string',
					validation: rule => rule.required(),
				}),
			],
		}),
		defineField({
			name: 'order',
			title: 'Kolejność wyświetlania',
			type: 'number',
			initialValue: 0,
		}),
	],
	orderings: [
		{
			title: 'Kolejność',
			name: 'orderAsc',
			by: [{ field: 'order', direction: 'asc' }],
		},
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'category',
			media: 'image',
		},
	},
})
