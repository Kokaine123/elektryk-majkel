/**
 * Update Sanity: godziny pracy -> całodobowo Pon-Sob, niedziela nieczynne
 *
 * Usage:
 *   $env:SANITY_API_WRITE_TOKEN="<token>"; npx tsx scripts/update-hours.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) {
	console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET in .env.local')
	process.exit(1)
}
if (!token) {
	console.error('Missing SANITY_API_WRITE_TOKEN.')
	process.exit(1)
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: '2024-01-01',
	useCdn: false,
})

async function main() {
	// 1. Update contactInfo
	console.log('Updating contactInfo...')
	await client
		.patch('contactInfo')
		.set({
			workingHoursWeekday: 'Pon - Sob: Całodobowo',
			workingHoursSaturday: 'Niedziela: nieczynne',
			emergencyNote: 'Dostępni całą dobę, 6 dni w tygodniu',
			emergencyAvailable: 'Dostępny 24/7',
		})
		.commit()
	console.log('✅ contactInfo updated')

	// 2. Update seoSettings openingHours
	console.log('Updating seoSettings...')
	await client
		.patch('seoSettings')
		.set({
			openingHours: [
				{
					_key: 'oh1',
					days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
					opens: '00:00',
					closes: '23:59',
				},
			],
		})
		.commit()
	console.log('✅ seoSettings updated')

	console.log('Done!')
}

main().catch(err => {
	console.error('Error:', err.message)
	process.exit(1)
})
