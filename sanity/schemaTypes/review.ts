import { defineField, defineType } from 'sanity'

export const review = defineType({
	name: 'review',
	title: 'Opinia',
	type: 'document',
	fields: [
		defineField({
			name: 'author',
			title: 'Imię i nazwisko',
			type: 'string',
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'rating',
			title: 'Ocena (1-5)',
			type: 'number',
			validation: rule => rule.required().min(1).max(5),
			initialValue: 5,
		}),
		defineField({
			name: 'text',
			title: 'Treść opinii',
			type: 'text',
			rows: 3,
			validation: rule => rule.required().min(10).max(500),
		}),
		defineField({
			name: 'date',
			title: 'Data (np. "2 miesiące temu")',
			type: 'string',
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'order',
			title: 'Kolejność',
			type: 'number',
			initialValue: 0,
		}),
	],
	orderings: [{ title: 'Kolejność', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
	preview: {
		select: { title: 'author', subtitle: 'text' },
	},
})
