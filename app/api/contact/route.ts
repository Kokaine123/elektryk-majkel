import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// ── In-memory rate limiter (per IP, 3 requests per hour) ──
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour

function cleanupRateLimitMap(now: number) {
	for (const [key, value] of rateLimitMap.entries()) {
		if (now > value.resetAt) rateLimitMap.delete(key)
	}
}

function parseClientIp(req: NextRequest): string {
	const forwardedFor = req.headers.get('x-forwarded-for')
	if (forwardedFor) {
		const first = forwardedFor.split(',')[0]?.trim()
		if (first) return first
	}
	return req.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(ip: string): { limited: boolean; remaining: number; resetAt: number } {
	const now = Date.now()
	cleanupRateLimitMap(now)
	const entry = rateLimitMap.get(ip)

	if (!entry || now > entry.resetAt) {
		const resetAt = now + RATE_LIMIT_WINDOW
		rateLimitMap.set(ip, { count: 1, resetAt })
		return { limited: false, remaining: RATE_LIMIT_MAX - 1, resetAt }
	}

	entry.count++
	const limited = entry.count > RATE_LIMIT_MAX
	const remaining = Math.max(0, RATE_LIMIT_MAX - entry.count)
	return { limited, remaining, resetAt: entry.resetAt }
}

function normalizeHost(hostHeader: string): string {
	return hostHeader.split(',')[0].trim().toLowerCase()
}

// ── Validation helpers ──
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\-+()]{7,20}$/
const MAX_NAME = 100
const MAX_PHONE = 20
const MAX_EMAIL = 100
const MAX_SERVICE = 100
const MAX_MESSAGE = 5000
const MAX_FILES = 5
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

export async function POST(req: NextRequest) {
	// Rate limiting
	const ip = parseClientIp(req)
	const rateLimit = isRateLimited(ip)
	if (rateLimit.limited) {
		const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))
		return NextResponse.json(
			{ error: 'Zbyt wiele wiadomości. Spróbuj ponownie za godzinę.' },
			{
				status: 429,
				headers: {
					'Retry-After': String(retryAfterSeconds),
					'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
					'X-RateLimit-Remaining': String(rateLimit.remaining),
					'X-RateLimit-Reset': String(rateLimit.resetAt),
				},
			},
		)
	}

	// Origin check (basic CSRF)
	const origin = req.headers.get('origin')
	const hostHeader = req.headers.get('x-forwarded-host') || req.headers.get('host')
	if (origin && hostHeader) {
		try {
			const originHost = new URL(origin).host.toLowerCase()
			const expectedHost = normalizeHost(hostHeader)
			if (originHost !== expectedHost) {
				return NextResponse.json({ error: 'Niedozwolone źródło' }, { status: 403 })
			}
		} catch {
			return NextResponse.json({ error: 'Nieprawidłowe źródło' }, { status: 403 })
		}
	}

	try {
		const data = await req.formData()
		const name = data.get('name') as string | null
		const phone = data.get('phone') as string | null
		const email = data.get('email') as string | null
		const service = data.get('service') as string | null
		const message = data.get('message') as string | null
		const photos = data.getAll('photos') as File[]

		// Required fields
		if (!name || !phone || !message) {
			return NextResponse.json({ error: 'Brak wymaganych pól' }, { status: 400 })
		}

		// Length validation
		if (
			typeof name !== 'string' ||
			name.length > MAX_NAME ||
			typeof phone !== 'string' ||
			phone.length > MAX_PHONE ||
			typeof message !== 'string' ||
			message.length > MAX_MESSAGE ||
			(email && (typeof email !== 'string' || email.length > MAX_EMAIL)) ||
			(service && (typeof service !== 'string' || service.length > MAX_SERVICE))
		) {
			return NextResponse.json({ error: 'Nieprawidłowe dane formularza' }, { status: 400 })
		}

		// Phone format
		if (!PHONE_RE.test(phone)) {
			return NextResponse.json({ error: 'Nieprawidłowy format numeru telefonu' }, { status: 400 })
		}

		// Email format (if provided)
		if (email && !EMAIL_RE.test(email)) {
			return NextResponse.json({ error: 'Nieprawidłowy format adresu email' }, { status: 400 })
		}

		// Validate photos
		const validPhotos = photos
			.filter(
				(f): f is File => f instanceof File && f.size > 0 && f.size <= MAX_FILE_SIZE && ALLOWED_MIME.includes(f.type),
			)
			.slice(0, MAX_FILES)

		// Build attachments
		const attachments = await Promise.all(
			validPhotos.map(async file => ({
				filename: file.name,
				content: Buffer.from(await file.arrayBuffer()),
				contentType: file.type,
			})),
		)

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.GMAIL_USER,
				pass: process.env.GMAIL_APP_PASSWORD,
			},
		})

		const serviceLabel = service || 'Nie wybrano'
		const photoInfo = validPhotos.length > 0 ? `\n\nZałączono ${validPhotos.length} zdjęć.` : ''

		await transporter.sendMail({
			from: `"Formularz kontaktowy" <${process.env.GMAIL_USER}>`,
			to: process.env.GMAIL_USER,
			replyTo: email || undefined,
			subject: `Nowe zapytanie od ${name} — ${serviceLabel}`,
			text: [
				`Imię i nazwisko: ${name}`,
				`Telefon: ${phone}`,
				`Email: ${email || 'Nie podano'}`,
				`Usługa: ${serviceLabel}`,
				``,
				`Wiadomość:`,
				message,
				photoInfo,
			].join('\n'),
			html: `
				<h2>Nowe zapytanie z formularza kontaktowego</h2>
				<table style="border-collapse:collapse;font-family:sans-serif;">
					<tr><td style="padding:6px 12px;font-weight:bold;">Imię i nazwisko</td><td style="padding:6px 12px;">${escapeHtml(name)}</td></tr>
					<tr><td style="padding:6px 12px;font-weight:bold;">Telefon</td><td style="padding:6px 12px;">${escapeHtml(phone)}</td></tr>
					<tr><td style="padding:6px 12px;font-weight:bold;">Email</td><td style="padding:6px 12px;">${escapeHtml(email || 'Nie podano')}</td></tr>
					<tr><td style="padding:6px 12px;font-weight:bold;">Usługa</td><td style="padding:6px 12px;">${escapeHtml(serviceLabel)}</td></tr>
					<tr><td style="padding:6px 12px;font-weight:bold;">Zdjęcia</td><td style="padding:6px 12px;">${validPhotos.length > 0 ? `${validPhotos.length} w załączniku` : 'Brak'}</td></tr>
				</table>
				<h3 style="margin-top:16px;">Wiadomość:</h3>
				<p style="white-space:pre-wrap;">${escapeHtml(message)}</p>
			`,
			attachments,
		})

		return NextResponse.json({ success: true })
	} catch (error) {
		console.error('Błąd wysyłania maila:', error)
		return NextResponse.json({ error: 'Nie udało się wysłać wiadomości' }, { status: 500 })
	}
}

function escapeHtml(str: string): string {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
