import { defineField, defineType } from 'sanity'

export const mapCity = defineType({
	name: 'mapCity',
	title: 'Miasto na mapie',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Nazwa miasta',
			type: 'string',
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug (URL)',
			type: 'slug',
			description: 'Generowany z nazwy, np. "stalowa-wola". Używany w /uslugi/elektryk-[slug]',
			options: { source: 'name', maxLength: 96 },
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'lat',
			title: 'Szerokość geograficzna (latitude)',
			type: 'number',
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'lng',
			title: 'Długość geograficzna (longitude)',
			type: 'number',
			validation: rule => rule.required(),
		}),
		defineField({
			name: 'distanceKm',
			title: 'Odległość od siedziby (km)',
			type: 'number',
			description: 'Odległość od Radomyśla nad Sanem w km',
		}),
		defineField({
			name: 'metaTitle',
			title: 'Meta title (SEO)',
			type: 'string',
			description:
				'Tytuł strony dla tego miasta. Optymalnie 50-60 znaków. Domyślnie: "Elektryk [miasto] - Usługi Elektryczne | Elektryk Majkel"',
			validation: rule => rule.max(70),
		}),
		defineField({
			name: 'metaDescription',
			title: 'Meta description (SEO)',
			type: 'text',
			rows: 3,
			description: 'Opis w wynikach Google. Optymalnie 150-160 znaków.',
			validation: rule => rule.max(170),
		}),
		defineField({
			name: 'pageHeading',
			title: 'Nagłówek strony',
			type: 'string',
			description: 'Główny nagłówek H1, np. "Elektryk Stalowa Wola"',
		}),
		defineField({
			name: 'pageDescription',
			title: 'Opis na stronie miasta',
			type: 'text',
			rows: 5,
			description: 'Tekst opisowy wyświetlany na podstronie miasta. Opisz usługi w kontekście danego miasta.',
		}),
	],
	preview: {
		select: { title: 'name', subtitle: 'slug.current' },
		prepare({ title, subtitle }) {
			return {
				title,
				subtitle: subtitle ? `/uslugi/elektryk-${subtitle}` : 'Brak sluga',
			}
		},
	},
})
