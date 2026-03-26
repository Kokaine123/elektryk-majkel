import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Ustawienia strony',
	type: 'document',
	groups: [
		{ name: 'sections', title: 'Widoczność sekcji' },
		{ name: 'navigation', title: 'Nawigacja' },
	],
	fields: [
		// ─── Section Visibility ──────────────────────────────
		defineField({
			name: 'showHero',
			title: 'Pokaż sekcję Hero (Start)',
			type: 'boolean',
			initialValue: true,
			group: 'sections',
		}),
		defineField({
			name: 'showServices',
			title: 'Pokaż sekcję Usługi',
			type: 'boolean',
			initialValue: true,
			group: 'sections',
		}),
		defineField({
			name: 'showAbout',
			title: 'Pokaż sekcję O nas',
			type: 'boolean',
			initialValue: true,
			group: 'sections',
		}),
		defineField({
			name: 'showProjects',
			title: 'Pokaż sekcję Realizacje',
			type: 'boolean',
			initialValue: true,
			group: 'sections',
		}),
		defineField({
			name: 'showContact',
			title: 'Pokaż sekcję Kontakt',
			type: 'boolean',
			initialValue: true,
			group: 'sections',
		}),
		defineField({
			name: 'showMap',
			title: 'Pokaż sekcję Mapa',
			type: 'boolean',
			initialValue: true,
			group: 'sections',
		}),
		defineField({
			name: 'showReviews',
			title: 'Pokaż sekcję Opinie',
			type: 'boolean',
			initialValue: true,
			group: 'sections',
		}),
		defineField({
			name: 'showFaq',
			title: 'Pokaż sekcję FAQ',
			type: 'boolean',
			initialValue: true,
			group: 'sections',
		}),
		// ─── Navigation ─────────────────────────────────────
		defineField({
			name: 'navItems',
			title: 'Elementy nawigacji',
			type: 'array',
			group: 'navigation',
			of: [
				{
					type: 'object',
					fields: [
						defineField({
							name: 'label',
							title: 'Etykieta',
							type: 'string',
							validation: rule => rule.required(),
						}),
						defineField({
							name: 'href',
							title: 'Link (np. #uslugi lub /kontakt)',
							type: 'string',
							validation: rule => rule.required(),
						}),
					],
					preview: {
						select: { title: 'label', subtitle: 'href' },
					},
				},
			],
		}),
	],
	preview: {
		prepare: () => ({ title: 'Ustawienia strony' }),
	},
})
