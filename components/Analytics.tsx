'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { getConsentStatus } from './CookieConsent'

interface AnalyticsProps {
	gaId?: string
	gtmId?: string
	fbPixelId?: string
}

export default function Analytics({ gaId, gtmId, fbPixelId }: AnalyticsProps) {
	const [consented, setConsented] = useState(false)

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
			{gtmId && (
				<>
					<Script id="gtm" strategy="afterInteractive">
						{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
						new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
						j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
						'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
						})(window,document,'script','dataLayer','${gtmId}');`}
					</Script>
					<noscript>
						<iframe
							src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
							height="0"
							width="0"
							style={{ display: 'none', visibility: 'hidden' }}
						/>
					</noscript>
				</>
			)}

			{/* Google Analytics (only if no GTM) */}
			{gaId && !gtmId && (
				<>
					<Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
					<Script id="ga" strategy="afterInteractive">
						{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
						gtag('js',new Date());gtag('config','${gaId}');`}
					</Script>
				</>
			)}

			{/* Facebook Pixel */}
			{fbPixelId && (
				<Script id="fb-pixel" strategy="afterInteractive">
					{`!function(f,b,e,v,n,t,s)
					{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
					n.callMethod.apply(n,arguments):n.queue.push(arguments)};
					if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
					n.queue=[];t=b.createElement(e);t.async=!0;
					t.src=v;s=b.getElementsByTagName(e)[0];
					s.parentNode.insertBefore(t,s)}(window,document,'script',
					'https://connect.facebook.net/en_US/fbevents.js');
					fbq('init','${fbPixelId}');fbq('track','PageView');`}
				</Script>
			)}
		</>
	)
}
