import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { draftMode } from 'next/headers'
import SanityVisualEditing from '@/components/SanityVisualEditing'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CookieConsent from '@/components/CookieConsent'
import Analytics from '@/components/Analytics'
import './globals.css'
import { getSeoSettings } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'

const inter = Inter({
	subsets: ['latin', 'latin-ext'],
	display: 'swap',
	variable: '--font-inter',
	preload: false,
	adjustFontFallback: true,
})

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#f59e0b',
	colorScheme: 'dark light',
}

const defaultMeta = {
	title: 'Elektryk Majkel | Usługi Elektryczne Radomyśl nad Sanem',
	description:
		'Elektryk z uprawnieniami SEP: instalacje, naprawy awaryjne, modernizacje i pomiary. Radomyśl nad Sanem, Stalowa Wola, Tarnobrzeg i okolice. Szybki dojazd i bezpłatna wycena.',
	keywords: [
		'elektryk Radomyśl nad Sanem',
		'elektryk Stalowa Wola',
		'instalacje elektryczne',
		'naprawy elektryczne',
		'elektryk awaryjny',
		'oświetlenie LED',
		'pomiary elektryczne',
		'uprawnienia SEP',
		'bramy automatyczne',
		'modernizacja instalacji elektrycznej',
		'usługi elektryczne',
		'podłączenie płyty indukcyjnej',
		'instalacja alarmu',
		'smart home',
		'elektryk z dojazdem',
	],
}

export async function generateMetadata(): Promise<Metadata> {
	let title = defaultMeta.title
	let description = defaultMeta.description
	let keywords = defaultMeta.keywords

	// Advanced SEO defaults
	let canonicalUrl = 'https://elektrykmajkel.pl'
	let ogTitle = title
	let ogDescription = description
	let ogType: 'website' | 'article' = 'website'
	let ogImageUrl = '/logo.webp'
	let ogImageAlt = 'Elektryk Majkel - Logo'
	let twitterCard: 'summary' | 'summary_large_image' = 'summary_large_image'
	let twitterTitle = title
	let twitterDescription = description
	let twitterImageUrl: string | undefined
	let robotsIndex = true
	let robotsFollow = true
	let robotsNoarchive = false
	let googleVerification: string | undefined
	let bingVerification: string | undefined

	try {
		const seo = await getSeoSettings()
		if (seo) {
			title = seo.siteTitle || title
			description = seo.siteDescription || description
			keywords = seo.keywords?.length ? seo.keywords : keywords
			canonicalUrl = seo.canonicalUrl || canonicalUrl

			// Open Graph
			ogTitle = seo.ogTitle || title
			ogDescription = seo.ogDescription || description
			ogType = (seo.ogType as 'website' | 'article') || ogType
			if (seo.ogImage?.asset) {
				ogImageUrl = urlFor(seo.ogImage).width(1200).height(630).url()
				ogImageAlt = seo.ogImage.alt || ogImageAlt
			}

			// Twitter
			twitterCard = (seo.twitterCard as 'summary' | 'summary_large_image') || twitterCard
			twitterTitle = seo.twitterTitle || ogTitle
			twitterDescription = seo.twitterDescription || ogDescription
			if (seo.twitterImage?.asset) {
				twitterImageUrl = urlFor(seo.twitterImage).width(1200).height(600).url()
			}

			// Robots
			robotsIndex = seo.robotsIndex !== false
			robotsFollow = seo.robotsFollow !== false
			robotsNoarchive = seo.robotsNoarchive === true

			// Verification
			googleVerification = seo.googleSiteVerification || undefined
			bingVerification = seo.bingSiteVerification || undefined
		}
	} catch {
		// fallback to defaults
	}

	const metadata: Metadata = {
		metadataBase: new URL('https://elektrykmajkel.pl'),
		title,
		description,
		keywords,
		authors: [{ name: 'Elektryk Majkel' }],
		creator: 'Elektryk Majkel',
		robots: {
			index: robotsIndex,
			follow: robotsFollow,
			...(robotsNoarchive && { noarchive: true }),
			googleBot: {
				index: robotsIndex,
				follow: robotsFollow,
				...(robotsNoarchive && { noarchive: true }),
				'max-video-preview': -1,
				'max-image-preview': 'large',
				'max-snippet': -1,
			},
		},
		openGraph: {
			type: ogType,
			locale: 'pl_PL',
			url: canonicalUrl,
			siteName: 'Elektryk Majkel',
			title: ogTitle,
			description: ogDescription,
			images: [
				{
					url: ogImageUrl,
					width: 1200,
					height: 630,
					alt: ogImageAlt,
				},
			],
		},
		twitter: {
			card: twitterCard,
			title: twitterTitle,
			description: twitterDescription,
			...(twitterImageUrl && {
				images: [twitterImageUrl],
			}),
		},
		alternates: {
			canonical: canonicalUrl,
		},
	}

	// Verification meta tags
	if (googleVerification || bingVerification) {
		metadata.verification = {}
		if (googleVerification) metadata.verification.google = googleVerification
		if (bingVerification) metadata.verification.other = { 'msvalidate.01': bingVerification }
	}

	return metadata
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const { isEnabled: isDraft } = await draftMode()

	// Fetch analytics IDs
	let gaId: string | undefined
	let gtmId: string | undefined
	let fbPixelId: string | undefined

	try {
		const seo = await getSeoSettings()
		if (seo) {
			gaId = seo.googleAnalyticsId || undefined
			gtmId = seo.googleTagManagerId || undefined
			fbPixelId = seo.facebookPixelId || undefined
		}
	} catch {
		// no analytics
	}

	return (
		<html lang="pl" suppressHydrationWarning className={`scroll-smooth ${inter.variable}`}>
			<body suppressHydrationWarning className={`${inter.className} antialiased bg-[#f7f6f3] text-gray-900`}>
				{isDraft && (
					<div className="fixed top-0 left-0 right-0 z-[200] bg-amber-500 text-gray-950 text-center text-sm font-semibold py-1">
						Tryb podglądu (Draft Mode) &mdash;{' '}
						<a href="/api/draft-mode/disable" className="underline hover:no-underline">
							Wyłącz
						</a>
					</div>
				)}
				{children}
				{isDraft && <SanityVisualEditing />}
				<Analytics gaId={gaId} gtmId={gtmId} fbPixelId={fbPixelId} />
				<SpeedInsights />
				<CookieConsent />
			</body>
		</html>
	)
}
