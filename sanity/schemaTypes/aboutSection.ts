import { defineField, defineType } from 'sanity'

export const aboutSection = defineType({
	name: 'aboutSection',
	title: 'O nas',
	type: 'document',
	fields: [
		defineField({
			name: 'yearsExperience',
			title: 'Wyróżnik (np. SEP, 5+)',
			type: 'string',
			initialValue: 'SEP',
		}),
		defineField({
			name: 'description',
			title: 'Opis (główny tekst)',
			type: 'text',
			rows: 5,
		}),
		defineField({
			name: 'clientsCount',
			title: 'Liczba klientów',
			type: 'string',
			initialValue: '50+',
		}),
		defineField({
			name: 'projectsCount',
			title: 'Liczba zleceń',
			type: 'string',
			initialValue: '100+',
		}),
		defineField({
			name: 'certifications',
			title: 'Certyfikaty',
			type: 'array',
			of: [{ type: 'string' }],
			initialValue: ['Uprawnienia SEP E i D', 'Ubezpieczenie OC'],
		}),
		defineField({
			name: 'features',
			title: 'Cechy / Zalety',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'icon', title: 'Emoji ikona', type: 'string' }),
						defineField({ name: 'title', title: 'Tytuł', type: 'string' }),
						defineField({ name: 'description', title: 'Opis', type: 'string' }),
					],
					preview: {
						select: { title: 'title', subtitle: 'description' },
					},
				},
			],
		}),
	],
	preview: {
		prepare: () => ({ title: 'Sekcja O nas' }),
	},
})
