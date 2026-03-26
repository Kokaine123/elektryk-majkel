import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
	token: process.env.SANITY_API_WRITE_TOKEN!,
	apiVersion: '2024-01-01',
	useCdn: false,
})

async function main() {
	const logoPath = path.resolve(__dirname, '../public/logo.png')
	const logoBuffer = fs.readFileSync(logoPath)

	console.log('Uploading logo to Sanity...')
	const asset = await client.assets.upload('image', logoBuffer, {
		filename: 'logo.png',
		contentType: 'image/png',
	})
	console.log(`  ✔ Uploaded: ${asset._id}`)

	await client
		.patch('seoSettings')
		.set({
			ogImage: {
				_type: 'image',
				asset: { _type: 'reference', _ref: asset._id },
				alt: 'Elektryk Majkel — Profesjonalne usługi elektryczne',
			},
		})
		.commit()
	console.log('  ✔ OG image set in SEO settings')

	console.log('\n✅ Logo ustawione jako obrazek OG!')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
