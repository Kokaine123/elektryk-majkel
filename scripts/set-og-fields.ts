import { createClient } from '@sanity/client'

const client = createClient({
	projectId: '36c16hv3',
	dataset: 'production',
	apiVersion: '2024-01-01',
	token: process.env.SANITY_API_WRITE_TOKEN,
	useCdn: false,
})

async function main() {
	await client
		.patch('seoSettings')
		.set({
			ogTitle: 'Elektryk Majkel — Usługi Elektryczne Radomyśl nad Sanem',
			ogDescription:
				'Certyfikowany elektryk z uprawnieniami SEP. Instalacje elektryczne, naprawy, pomiary, smart home. Radomyśl nad Sanem i okolice. Zadzwoń: +48 537 751 820',
		})
		.commit()

	console.log('OG fields updated successfully!')
}

main().catch(console.error)
