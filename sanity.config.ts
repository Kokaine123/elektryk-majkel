'use client'

/**
 * This configuration is used to for the Sanity Studio mounted on `/app/studio/[[...tool]]/page.tsx`
 */
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import { schemaTypes } from './sanity/schemaTypes'
import { apiVersion, dataset, projectId } from './sanity/env'

export default defineConfig({
	basePath: '/studio',
	projectId,
	dataset,
	schema: {
		types: schemaTypes,
	},
	plugins: [
		structureTool({
			structure: S =>
				S.list()
					.title('Panel administracyjny')
					.items([
						S.listItem()
							.title('Realizacje')
							.schemaType('project')
							.child(S.documentTypeList('project').title('Realizacje')),
						S.divider(),
						S.listItem()
							.title('Opinie')
							.schemaType('review')
							.child(S.documentTypeList('review').title('Opinie klientów')),
						S.listItem().title('Usługi').schemaType('service').child(S.documentTypeList('service').title('Usługi')),
						S.divider(),
						S.listItem()
							.title('O nas')
							.schemaType('aboutSection')
							.child(S.editor().id('aboutSection').schemaType('aboutSection').documentId('aboutSection')),
						S.listItem()
							.title('Sekcja Start (Hero)')
							.schemaType('heroSection')
							.child(S.editor().id('heroSection').schemaType('heroSection').documentId('heroSection')),
						S.listItem()
							.title('Dane kontaktowe')
							.schemaType('contactInfo')
							.child(S.editor().id('contactInfo').schemaType('contactInfo').documentId('contactInfo')),
						S.listItem()
							.title('Miasta na mapie')
							.schemaType('mapCity')
							.child(S.documentTypeList('mapCity').title('Miasta na mapie')),
						S.listItem()
							.title('FAQ')
							.schemaType('faqItem')
							.child(S.documentTypeList('faqItem').title('Najczęściej zadawane pytania')),
						S.listItem()
							.title('Strony prawne')
							.schemaType('legalPage')
							.child(S.documentTypeList('legalPage').title('Polityka prywatności / Regulamin')),
						S.divider(),
						S.listItem()
							.title('SEO / Meta dane')
							.schemaType('seoSettings')
							.child(S.editor().id('seoSettings').schemaType('seoSettings').documentId('seoSettings')),
						S.listItem()
							.title('Ustawienia strony')
							.schemaType('siteSettings')
							.child(S.editor().id('siteSettings').schemaType('siteSettings').documentId('siteSettings')),
					]),
		}),
		presentationTool({
			previewUrl: {
				draftMode: {
					enable: '/api/draft-mode/enable',
				},
			},
		}),
		visionTool({ defaultApiVersion: apiVersion }),
		media(),
	],
})
