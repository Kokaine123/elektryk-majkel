/**
 * Patch blog SEO in Sanity: brama meta year + rozdzielnice localization.
 *
 * Usage: npx tsx scripts/patch-blog-cms-seo.ts
 */
import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
	console.error('Missing Sanity env vars in .env.local')
	process.exit(1)
}

const client = createClient({
	projectId,
	dataset,
	token,
	apiVersion: '2024-01-01',
	useCdn: false,
})

type PortableBlock = {
	_type: 'block'
	_key: string
	style?: string
	children?: Array<{ _type: string; _key: string; text?: string; marks?: string[] }>
	markDefs?: unknown[]
}

function replaceYearInContent(content: PortableBlock[] | undefined): PortableBlock[] | undefined {
	if (!content) return content
	return content.map(block => {
		if (block._type !== 'block' || !block.children) return block
		return {
			...block,
			children: block.children.map(child =>
				child.text?.includes('2025')
					? { ...child, text: child.text.replace(/2025/g, '2026') }
					: child,
			),
		}
	})
}

/** Sanity Studio renders blockquote with invalid `<p><div>` nesting — convert to italic paragraph. */
function fixBlockquoteBlocks(content: PortableBlock[]): PortableBlock[] {
	return content.map(block => {
		if (block._type !== 'block' || block.style !== 'blockquote' || !block.children) return block
		return {
			...block,
			style: 'normal',
			children: block.children.map(child => ({
				...child,
				marks: child.marks?.includes('em') ? child.marks : [...(child.marks ?? []), 'em'],
			})),
		}
	})
}

async function patchBramaPost() {
	const post = await client.fetch<{ content?: PortableBlock[] }>(
		`*[_id == "blogPost-montaz-bramy-automatycznej"][0]{ content }`,
	)

	const updatedContent = replaceYearInContent(post?.content)

	await client
		.patch('blogPost-montaz-bramy-automatycznej')
		.set({
			metaTitle: 'Montaż bramy automatycznej — poradnik 2026 | Elektryk Majkel',
			...(updatedContent ? { content: updatedContent } : {}),
		})
		.commit()

	console.log('✔ Brama: metaTitle 2026 + treść (2025 → 2026)')
}

async function patchRozdzielnicePost() {
	const localBlock: PortableBlock = {
		_type: 'block',
		_key: 'local-seo-radomysl',
		style: 'normal',
		markDefs: [],
		children: [
			{
				_type: 'span',
				_key: 'local-seo-radomysl-span',
				text: 'Realizujemy wymianę i modernizację rozdzielnic w Radomyślu nad Sanem, Stalowej Woli, Tarnobrzegu, Sandomierzu, Nisku i okolicach. Dojazd, bezpłatna wycena i protokół pomiarów — skontaktuj się z nami.',
				marks: [],
			},
		],
	}

	const post = await client.fetch<{ content?: PortableBlock[] }>(
		`*[_id == "blogPost-rozdzielnice-elektryczne"][0]{ content }`,
	)

	let content = fixBlockquoteBlocks(post?.content ?? [])
	const hasLocal = content.some(block =>
		block.children?.some(child => child.text?.includes('Radomyślu nad Sanem')),
	)
	if (!hasLocal) content = [...content, localBlock]

	await client
		.patch('blogPost-rozdzielnice-elektryczne')
		.set({
			metaTitle: 'Wymiana rozdzielnicy — kiedy i ile kosztuje? | Elektryk Majkel',
			metaDescription:
				'Objawy zużytej skrzynki, montaż krok po kroku i ceny 2026. Elektryk SEP z dojazdem: Radomyśl nad Sanem i okolice.',
			content,
		})
		.commit()

	console.log('✔ Rozdzielnice: meta, blockquote → kursywa, lokalizacja')
}

async function main() {
	console.log(`\nPatching blog SEO [${projectId}/${dataset}] …\n`)
	await patchBramaPost()
	await patchRozdzielnicePost()
	console.log('\nDone. Odśwież wpisy w Sanity Studio i poproś Google o ponowne indeksowanie.\n')
}

main().catch(err => {
	console.error(err)
	process.exit(1)
})
