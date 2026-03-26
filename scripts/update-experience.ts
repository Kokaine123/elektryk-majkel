import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2024-01-01',
	useCdn: false,
})

async function main() {
	// Update About section
	await client
		.patch('aboutSection')
		.set({
			yearsExperience: 'SEP',
			description:
				'Jestem certyfikowanym elektrykiem z uprawnieniami SEP. Specjalizuję się w instalacjach elektrycznych dla domów jednorodzinnych, mieszkań oraz obiektów komercyjnych. Każde zlecenie traktuję indywidualnie, dbając o najwyższą jakość wykonania i bezpieczeństwo.',
			clientsCount: '50+',
			projectsCount: '100+',
		})
		.commit()
	console.log('  ✔ About section')

	// Update Hero section
	await client
		.patch('heroSection')
		.set({
			description:
				'Instalacje, naprawy i modernizacje elektryczne. Działamy szybko, solidnie i\u00a0bezpiecznie. Certyfikowany elektryk z uprawnieniami SEP.',
			stats: [
				{ _key: 'stat1', value: '100%', label: 'Zaangażowania' },
				{ _key: 'stat2', value: '50+', label: 'Zrealizowanych projektów' },
				{ _key: 'stat3', value: '24/7', label: 'Dostępność awaryjna' },
				{ _key: 'stat4', value: 'SEP', label: 'Certyfikat' },
			],
		})
		.commit()
	console.log('  ✔ Hero section')

	console.log('\n✅ Dane zaktualizowane!')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
