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
	await client.createOrReplace({
		_id: 'service-agd',
		_type: 'service',
		icon: 'wrench',
		title: 'Naprawa sprzętu AGD',
		description:
			'Diagnostyka i naprawa pralek, zmywarek, lodówek, piekarników i innego sprzętu AGD. Szybko, tanio i z gwarancją.',
		order: 7,
	})
	console.log('✅ Dodano usługę: Naprawa sprzętu AGD')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
