const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function convertToWebp(dir, recursive = false) {
	try {
		const files = fs.readdirSync(dir)

		for (const file of files) {
			const filePath = path.join(dir, file)
			const stat = fs.statSync(filePath)

			if (stat.isDirectory()) {
				if (recursive) {
					await convertToWebp(filePath, true)
				}
			} else if (/\.(png|jpg|jpeg)$/i.test(file)) {
				const outputPath = path.join(dir, path.parse(file).name + '.webp')

				console.log(`Converting: ${filePath}`)
				await sharp(filePath).webp({ quality: 80 }).toFile(outputPath)
				console.log(`✓ Created: ${outputPath}`)
			}
		}
	} catch (err) {
		console.error(`Error processing ${dir}:`, err)
	}
}

;(async () => {
	console.log('Starting WebP conversion...\n')

	// Convert public directory (non-recursive for root)
	await convertToWebp(path.join(__dirname, 'public'))

	// Convert public/img recursively
	await convertToWebp(path.join(__dirname, 'public', 'img'), true)

	console.log('\n✓ Conversion complete!')
})()
