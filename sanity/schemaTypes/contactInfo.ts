import { defineField, defineType } from 'sanity'

export const contactInfo = defineType({
	name: 'contactInfo',
	title: 'Dane kontaktowe',
	type: 'document',
	fields: [
		defineField({
			name: 'phone',
			title: 'Numer telefonu',
			type: 'string',
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'email',
			title: 'Email',
			type: 'string',
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'location',
			title: 'Lokalizacja (np. "Radomyśl nad Sanem i okolice")',
			type: 'string',
		}),
		defineField({
			name: 'workingHoursWeekday',
			title: 'Godziny pracy (Pon-Pt)',
			type: 'string',
			initialValue: 'Pon - Pt: 7:00 - 18:00',
		}),
		defineField({
			name: 'workingHoursSaturday',
			title: 'Godziny pracy (Sobota)',
			type: 'string',
			initialValue: 'Sob: 8:00 - 14:00',
		}),
		defineField({
			name: 'emergencyNote',
			title: 'Info o awariach',
			type: 'string',
			initialValue: 'Awarie: całodobowo',
		}),
		defineField({
			name: 'emergencyAvailable',
			title: 'Dostępność w nagłych wypadkach',
			type: 'string',
			initialValue: 'Dostępny 24/7 w nagłych wypadkach',
		}),
		defineField({
			name: 'emailResponseTime',
			title: 'Czas odpowiedzi na email',
			type: 'string',
			initialValue: 'Odpowiadamy w ciągu 24h',
		}),
	],
	preview: {
		prepare: () => ({ title: 'Dane kontaktowe' }),
	},
})
