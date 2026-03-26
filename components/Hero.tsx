'use client'

import { SanityHeroSection } from '@/lib/queries'

interface HeroProps {
	data?: SanityHeroSection | null
}

const defaultStats = [
	{ value: '100%', label: 'Zaangażowania' },
	{ value: '50+', label: 'Zrealizowanych projektów' },
	{ value: '24/7', label: 'Awaryjne naprawy' },
	{ value: '100%', label: 'Zadowolonych klientów' },
]

export default function Hero({ data }: HeroProps) {
	const badgeText = data?.badgeText ?? 'Certyfikowany elektryk z uprawnieniami SEP'
	const headingLine1 = data?.headingLine1 ?? 'Profesjonalne'
	const headingLine2 = data?.headingLine2 ?? 'Usługi Elektryczne'
	const description =
		data?.description ??
		'Instalacje, naprawy i modernizacje elektryczne. Działamy szybko, solidnie i\u00a0bezpiecznie. Ponad 10 lat doświadczenia w branży.'
	const ctaText = data?.ctaText ?? 'Bezpłatna wycena →'
	const ctaLink = data?.ctaLink ?? '#kontakt'
	const phoneNumber = data?.phoneNumber ?? '+48 537 751 820'
	const stats = data?.stats !== undefined ? data.stats : defaultStats

	// Build tel: link – strip spaces and non-digit chars except leading +
	const telHref = phoneNumber ? `tel:${phoneNumber.replace(/(?!^\+)\D/g, '')}` : ''

	return (
		<section
			id="start"
			aria-label="Strona główna"
			className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Background gradient */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#f3f2ef] via-[#faf9f6] to-[#f0efec]" />

			{/* Decorative electricity lines */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
				<div className="absolute top-2/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
				<div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
			</div>

			{/* Glowing orb */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />

			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
				{/* Badge */}
				{badgeText && (
					<div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-8">
						<div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
						<span className="text-amber-700 text-sm font-medium">{badgeText}</span>
					</div>
				)}

				{/* Main heading */}
				{(headingLine1 || headingLine2) && (
					<h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-gray-900">
						{headingLine1}
						{headingLine1 && headingLine2 && <br />}
						{headingLine2 && (
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
								{headingLine2}
							</span>
						)}
					</h1>
				)}

				{description && (
					<p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">{description}</p>
				)}

				{/* CTA buttons */}
				{(ctaText || phoneNumber) && (
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
						{ctaText && (
							<a
								href={ctaLink}
								className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 cursor-pointer">
								{ctaText}
							</a>
						)}
						{phoneNumber && (
							<a
								href={telHref}
								className="w-full sm:w-auto border border-gray-300 hover:border-amber-500 text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:bg-[#f3f2ef] cursor-pointer inline-flex items-center justify-center gap-2">
								<svg
									className="w-5 h-5 text-amber-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
									/>
								</svg>
								{phoneNumber}
							</a>
						)}
					</div>
				)}

				{/* Stats */}
				{stats && stats.length > 0 && (
					<div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
						{stats.map(stat => (
							<div key={stat.label} className="text-center min-w-[140px]">
								<div className="text-3xl md:text-4xl font-extrabold text-amber-500">{stat.value}</div>
								<div className="text-sm text-gray-600 mt-1">{stat.label}</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Scroll indicator */}
			<button
				onClick={() => {
					const hero = document.getElementById('start')
					if (hero) {
						const next = hero.nextElementSibling as HTMLElement | null
						next?.scrollIntoView({ behavior: 'smooth' })
					}
				}}
				aria-label="Przewiń do następnej sekcji"
				className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:text-amber-500 transition-colors">
				<svg
					className="w-6 h-6 text-gray-500 hover:text-amber-500 transition-colors"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
				</svg>
			</button>
		</section>
	)
}
