import { defineField, defineType } from 'sanity'

export const service = defineType({
	name: 'service',
	title: 'Usługa',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Nazwa usługi',
			type: 'string',
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Opis',
			type: 'text',
			rows: 3,
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'icon',
			title: 'Ikona (nazwa z Heroicons, np. "bolt", "home", "shield")',
			type: 'string',
			description: 'Dostępne: home, bolt, beaker, lightbulb, house, alert. Zostaw puste dla domyślnej.',
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
		select: { title: 'title', subtitle: 'description' },
	},
})
