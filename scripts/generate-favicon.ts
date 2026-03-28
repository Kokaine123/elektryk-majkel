import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const PUBLIC = path.join(process.cwd(), 'public')
const APP = path.join(process.cwd(), 'app')

// Create an SVG with bold "M" letter on dark rounded background — readable at any size
function createFaviconSvg(size: number): Buffer {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="#1e293b"/>
    <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle"
      font-family="Arial Black, Arial, sans-serif" font-weight="900"
      font-size="${Math.round(size * 0.65)}" fill="#f59e0b">M</text>
  </svg>`
	return Buffer.from(svg)
}

async function main() {
	// Generate square icon from SVG at high resolution
	const squareBuffer = await sharp(createFaviconSvg(512)).png().toBuffer()

	// 1. favicon.ico (48x48 — Google requires minimum 48x48)
	const ico48 = await sharp(squareBuffer).resize(48, 48).png().toBuffer()
	fs.writeFileSync(path.join(APP, 'favicon.ico'), createIco(ico48, 48, 48))
	console.log('Created app/favicon.ico (48x48)')

	// 2. icon.png for app directory (192x192)
	await sharp(squareBuffer).resize(192, 192).png().toFile(path.join(APP, 'icon.png'))
	console.log('Created app/icon.png (192x192)')

	// 3. apple-icon.png (180x180)
	await sharp(squareBuffer).resize(180, 180).png().toFile(path.join(APP, 'apple-icon.png'))
	console.log('Created app/apple-icon.png (180x180)')

	// 4. Larger icon for PWA/manifest (512x512) in public
	await sharp(squareBuffer).resize(512, 512).png().toFile(path.join(PUBLIC, 'icon-512.png'))
	console.log('Created public/icon-512.png (512x512)')

	console.log('\nFavicon generation complete!')
}

// Create a minimal ICO file from a PNG buffer
function createIco(pngBuffer: Buffer, width: number, height: number): Buffer {
	const iconDir = Buffer.alloc(6)
	iconDir.writeUInt16LE(0, 0) // Reserved
	iconDir.writeUInt16LE(1, 2) // ICO type
	iconDir.writeUInt16LE(1, 4) // Number of images

	const iconEntry = Buffer.alloc(16)
	iconEntry.writeUInt8(width >= 256 ? 0 : width, 0)
	iconEntry.writeUInt8(height >= 256 ? 0 : height, 1)
	iconEntry.writeUInt8(0, 2) // Color palette
	iconEntry.writeUInt8(0, 3) // Reserved
	iconEntry.writeUInt16LE(1, 4) // Color planes
	iconEntry.writeUInt16LE(32, 6) // Bits per pixel
	iconEntry.writeUInt32LE(pngBuffer.length, 8) // Size of image data
	iconEntry.writeUInt32LE(6 + 16, 12) // Offset to image data

	return Buffer.concat([iconDir, iconEntry, pngBuffer])
}

main().catch(console.error)
