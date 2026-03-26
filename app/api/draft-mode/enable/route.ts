import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { validatePreviewUrl } from '@sanity/preview-url-secret'
import { client } from '@/lib/sanity'

const token = process.env.SANITY_API_READ_TOKEN

export async function GET(request: NextRequest) {
	if (!token) {
		return new NextResponse('Server misconfigured: missing preview token', { status: 500 })
	}

	const clientWithToken = client.withConfig({ token })

	const { isValid, redirectTo = '/' } = await validatePreviewUrl(clientWithToken, request.url)

	if (!isValid) {
		return new NextResponse('Invalid secret', { status: 401 })
	}

	;(await draftMode()).enable()
	return NextResponse.redirect(new URL(redirectTo, request.url))
}
