'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getConsentStatus } from './CookieConsent'

interface AnalyticsProps {
	gaId?: string
	gtmId?: string
	fbPixelId?: string
}

// Strict allowlists prevent script injection via CMS-provided IDs.
const GTM_ID_RE = /^GTM-[A-Z0-9]{1,12}$/
const GA_ID_RE = /^G-[A-Z0-9]{6,20}$/
const FB_PIXEL_ID_RE = /^\d{5,20}$/

function sanitizeGtmId(value?: string): string | undefined {
	if (!value) return undefined
	const normalized = value.trim().toUpperCase()
	return GTM_ID_RE.test(normalized) ? normalized : undefined
}

function sanitizeGaId(value?: string): string | undefined {
	if (!value) return undefined
	const normalized = value.trim().toUpperCase()
	return GA_ID_RE.test(normalized) ? normalized : undefined
}

function sanitizeFbPixelId(value?: string): string | undefined {
	if (!value) return undefined
	const normalized = value.trim()
	return FB_PIXEL_ID_RE.test(normalized) ? normalized : undefined
}

export default function Analytics({ gaId, gtmId, fbPixelId }: AnalyticsProps) {
	const [consented, setConsented] = useState(false)
	const safeGtmId = sanitizeGtmId(gtmId)
	const safeGaId = sanitizeGaId(gaId)
	const safeFbPixelId = sanitizeFbPixelId(fbPixelId)

	useEffect(() => {
		const check = () => setConsented(getConsentStatus() === 'accepted')
		check()
		window.addEventListener('cookie-consent-change', check)
		return () => window.removeEventListener('cookie-consent-change', check)
	}, [])

	if (!consented) return null

	return (
		<>
			{/* Google Tag Manager */}
			{safeGtmId && (
				<>
					<Script id="gtm" strategy="afterInteractive">
						{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
						new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
						j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
						'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer',${JSON.stringify(safeGtmId)});`}
					</Script>
					<noscript>
						<iframe
							src={`https://www.googletagmanager.com/ns.html?id=${safeGtmId}`}
							height="0"
							width="0"
							style={{ display: 'none', visibility: 'hidden' }}
						/>
					</noscript>
				</>
			)}

			{/* Google Analytics (only if no GTM) */}
			{safeGaId && !safeGtmId && (
				<>
					<Script src={`https://www.googletagmanager.com/gtag/js?id=${safeGaId}`} strategy="afterInteractive" />
					<Script id="ga" strategy="afterInteractive">
						{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
						gtag('js',new Date());gtag('config',${JSON.stringify(safeGaId)});`}
					</Script>
				</>
			)}

			{/* Facebook Pixel */}
			{safeFbPixelId && (
				<Script id="fb-pixel" strategy="afterInteractive">
					{`!function(f,b,e,v,n,t,s)
					{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
					n.callMethod.apply(n,arguments):n.queue.push(arguments)};
					if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
					n.queue=[];t=b.createElement(e);t.async=!0;
					t.src=v;s=b.getElementsByTagName(e)[0];
					s.parentNode.insertBefore(t,s)}(window,document,'script',
					'https://connect.facebook.net/en_US/fbevents.js');
					fbq('init',${JSON.stringify(safeFbPixelId)});fbq('track','PageView');`}
				</Script>
			)}
		</>
	)
}
