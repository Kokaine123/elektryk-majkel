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

// IDs created by seed.ts — these are the ones we KEEP
const seedIds = new Set([
	'heroSection',
	'aboutSection',
	'contactInfo',
	'siteSettings',
	'seoSettings',
	'service-instalacje',
	'service-naprawy',
	'service-modernizacja',
	'service-pomiary',
	'service-led',
	'service-smarthome',
	'project-dom',
	'project-biuro',
	'project-smarthome',
	'project-brama',
	'project-awaria',
	'project-foto',
	'review-1',
	'review-2',
	'review-3',
	'review-4',
	'review-5',
	'review-6',
	'review-7',
	'review-8',
	'faq-1',
	'faq-2',
	'faq-3',
	'faq-4',
	'faq-5',
	'faq-6',
	'faq-7',
	'faq-8',
	'city-rzeszow',
	'city-lublin',
	'city-kielce',
	'city-tarnow',
	'city-zamosc',
	'city-przemysl',
	'city-tarnobrzeg',
	'city-sandomierz',
	'city-mielec',
	'city-jaroslaw',
	'city-debica',
	'city-krasnik',
	'city-nisko',
	'city-stalowa-wola',
])

const types = [
	'service',
	'project',
	'review',
	'faqItem',
	'mapCity',
	'heroSection',
	'aboutSection',
	'contactInfo',
	'siteSettings',
	'seoSettings',
]

async function main() {
	console.log('\nScanning for duplicates…\n')
	let toDelete: string[] = []

	for (const t of types) {
		const docs: { _id: string; title?: string; name?: string; question?: string; author?: string }[] =
			await client.fetch(`*[_type == $type]{ _id, title, name, question, author }`, { type: t })

		for (const d of docs) {
			const cleanId = d._id.replace(/^drafts\./, '')
			if (!seedIds.has(cleanId)) {
				toDelete.push(d._id)
				console.log(`  🗑  ${t}: ${d._id} (${d.title || d.name || d.question || d.author || '?'})`)
			}
		}
	}

	if (toDelete.length === 0) {
		console.log('No duplicates found.\n')
		return
	}

	console.log(`\nDeleting ${toDelete.length} duplicate(s)…\n`)

	let tx = client.transaction()
	for (const id of toDelete) {
		tx = tx.delete(id)
	}
	await tx.commit()

	console.log(`✅ Deleted ${toDelete.length} duplicate document(s).\n`)
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
