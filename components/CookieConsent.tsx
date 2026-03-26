'use client'

import { useState, useEffect } from 'react'

const COOKIE_CONSENT_KEY = 'cookie-consent'

type ConsentStatus = 'pending' | 'accepted' | 'rejected'

export function getConsentStatus(): ConsentStatus {
	if (typeof window === 'undefined') return 'pending'
	return (localStorage.getItem(COOKIE_CONSENT_KEY) as ConsentStatus) || 'pending'
}

export default function CookieConsent() {
	const [visible, setVisible] = useState(false)

	useEffect(() => {
		const status = getConsentStatus()
		if (status === 'pending') {
			setVisible(true)
		}
	}, [])

	const accept = () => {
		localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
		setVisible(false)
		window.dispatchEvent(new Event('cookie-consent-change'))
	}

	const reject = () => {
		localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected')
		setVisible(false)
		window.dispatchEvent(new Event('cookie-consent-change'))
	}

	if (!visible) return null

	return (
		<div className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4 sm:p-6 shadow-2xl">
			<div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
				<div className="flex-1 text-sm text-gray-300">
					<p className="font-semibold text-white mb-1">Szanujemy Twoją prywatność</p>
					<p>
						Używamy plików cookie i narzędzi analitycznych (Google Analytics, Facebook Pixel), aby ulepszać naszą
						stronę. Potrzebujemy Twojej zgody na przetwarzanie danych zgodnie z{' '}
						<a href="/polityka-prywatnosci" className="text-amber-400 hover:underline">
							Polityką prywatności
						</a>
						.
					</p>
				</div>
				<div className="flex gap-3 flex-shrink-0">
					<button
						onClick={reject}
						className="px-5 py-2.5 text-sm font-medium text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
						Odrzuć
					</button>
					<button
						onClick={accept}
						className="px-5 py-2.5 text-sm font-bold text-gray-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-colors cursor-pointer">
						Akceptuj wszystkie
					</button>
				</div>
			</div>
		</div>
	)
}
