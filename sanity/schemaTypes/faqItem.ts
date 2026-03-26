import { defineField, defineType } from 'sanity'

export const faqItem = defineType({
	name: 'faqItem',
	title: 'FAQ - Pytanie',
	type: 'document',
	fields: [
		defineField({
			name: 'question',
			title: 'Pytanie',
			type: 'string',
			validation: rule => rule.required().max(200),
		}),
		defineField({
			name: 'answer',
			title: 'Odpowiedź',
			type: 'text',
			rows: 4,
			validation: rule => rule.required().max(1000),
		}),
		defineField({
			name: 'order',
			title: 'Kolejność',
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
		select: { title: 'question', subtitle: 'order' },
		prepare({ title, subtitle }) {
			return {
				title,
				subtitle: `Kolejność: ${subtitle ?? 0}`,
			}
		},
	},
})
