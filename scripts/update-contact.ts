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
	const tx = client
		.transaction()
		.patch('heroSection', p => p.set({ phoneNumber: '+48 537 751 820' }))
		.patch('contactInfo', p => p.set({ phone: '+48 537 751 820', email: 'elektryk.majkel@gmail.com' }))
		.patch('seoSettings', p => p.set({ businessPhone: '+48537751820', businessEmail: 'elektryk.majkel@gmail.com' }))

	await tx.commit()
	console.log('✅ Updated phone & email in Sanity (heroSection, contactInfo, seoSettings)')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
