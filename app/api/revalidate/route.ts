import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
	try {
		const { body, isValidSignature } = await parseBody<{
			_type: string
			slug?: { current?: string }
		}>(req, process.env.SANITY_REVALIDATE_SECRET)

		if (!isValidSignature) {
			return new NextResponse('Invalid signature', { status: 401 })
		}

		if (!body?._type) {
			return new NextResponse('Bad Request', { status: 400 })
		}

		// Revalidate by document type (matches tags in queries)
		// @ts-expect-error -- Next.js 16 revalidateTag API may differ
		revalidateTag(body._type)
		// Also revalidate the global catch-all tag
		// @ts-expect-error -- Next.js 16 revalidateTag API may differ
		revalidateTag('sanity')

		return NextResponse.json({
			revalidated: true,
			now: Date.now(),
			type: body._type,
		})
	} catch (err: unknown) {
		console.error('Revalidation error:', err)
		return new NextResponse('Error revalidating', { status: 500 })
	}
}
