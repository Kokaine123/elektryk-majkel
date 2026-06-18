import Image from 'next/image'
import Link from 'next/link'
import { getContactInfo, getMapCities, getSiteSettings } from '@/lib/queries'

const visibleCitySlugs = new Set(['stalowa-wola', 'sandomierz'])

export default async function Footer() {
	let phone = '+48 537 751 820'
	let email = 'elektryk.majkel@gmail.com'
	let location = 'Radomyśl nad Sanem i okolice'
	let hours = 'Pon-Sob: Całodobowo | Nd: nieczynne'

	try {
		const info = await getContactInfo()
		if (info) {
			phone = info.phone || phone
			email = info.email || email
			location = info.location || location
			hours = `${info.workingHoursWeekday || 'Pon - Sob: Całodobowo'} | ${info.workingHoursSaturday || 'Niedziela: nieczynne'}`
		}
	} catch {
		// fallback to defaults
	}

	let cities: { _id: string; name: string; slug?: { current: string } }[] = []
	try {
		const fetched = await getMapCities()
		cities = fetched.filter(c => c.slug?.current && visibleCitySlugs.has(c.slug.current))
	} catch {
		// no cities
	}

	let navItems: { label: string; href: string }[] | undefined
	try {
		const settings = await getSiteSettings()
		if (settings?.navItems?.length) navItems = settings.navItems
	} catch {
		// fallback
	}

	const defaultLinks = [
		{ href: '#start', label: 'Start' },
		{ href: '#uslugi', label: 'Usługi' },
		{ href: '#o-nas', label: 'O nas' },
		{ href: '#realizacje', label: 'Realizacje' },
		{ href: '#kontakt', label: 'Kontakt' },
	]
	const footerLinks = navItems || defaultLinks

	const phoneHref = `tel:${phone.replace(/\s/g, '')}`
	const emailHref = `mailto:${email}`
	return (
		<footer className="bg-gray-950 border-t border-white/10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
					{/* Brand */}
					<div className="text-center md:text-left">
						<div className="flex items-center justify-center md:justify-start gap-2 mb-4">
							<Image
								src="/logo.webp"
								alt="Elektryk Majkel - Profesjonalne usługi elektryczne"
								width={420}
								height={240}
								sizes="84px"
								className="h-12 w-auto"
							/>
						</div>
						<p className="text-gray-400 text-sm leading-relaxed">
							Profesjonalne usługi elektryczne. Bezpiecznie, solidnie i na czas. Certyfikowany elektryk z uprawnieniami
							SEP.
						</p>
						<div className="mt-4 flex items-center justify-center md:justify-start">
							<a
								href="https://facebook.com/elektrykmajkel"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook - Elektryk Majkel"
								className="w-10 h-10 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 rounded-lg flex items-center justify-center text-gray-400 hover:text-amber-400 transition-all">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
								</svg>
							</a>
						</div>
					</div>

					{/* Quick links */}
					<nav aria-label="Szybkie linki" className="text-center md:text-left">
						<h3 className="font-bold text-lg mb-4 text-white">Szybkie linki</h3>
						<ul className="space-y-2">
							{footerLinks.map(link => (
								<li key={link.href}>
									<a
										href={link.href}
										className="text-gray-400 hover:text-amber-400 transition-colors text-sm cursor-pointer">
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</nav>

					{/* Contact summary */}
					<div className="text-center md:text-left">
						<h3 className="font-bold text-lg mb-4 text-white">Kontakt</h3>
						<div className="space-y-3 text-sm text-gray-400">
							<p className="flex items-center justify-center md:justify-start gap-2">
								<svg
									className="w-4 h-4 text-amber-400 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
									/>
								</svg>
								<a href={phoneHref} className="hover:text-amber-400 transition-colors cursor-pointer">
									{phone}
								</a>
							</p>
							<p className="flex items-center justify-center md:justify-start gap-2">
								<svg
									className="w-4 h-4 text-amber-400 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
									/>
								</svg>
								<a href={emailHref} className="hover:text-amber-400 transition-colors cursor-pointer">
									{email}
								</a>
							</p>
							<p className="flex items-center justify-center md:justify-start gap-2">
								<svg
									className="w-4 h-4 text-amber-400 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
									/>
								</svg>
								{location}
							</p>
							<p className="flex items-center justify-center md:justify-start gap-2">
								<svg
									className="w-4 h-4 text-amber-400 flex-shrink-0"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								{hours}
							</p>
						</div>
					</div>
				</div>

				{/* City service pages */}
				{cities.length > 0 && (
					<div className="mt-10 pt-8 border-t border-white/10">
						<h3 className="font-bold text-lg mb-4 text-white text-center">Obsługiwane miasta</h3>
						<div className="flex flex-wrap justify-center gap-2">
							{cities.map(city => (
								<Link
									key={city._id}
									href={`/uslugi/elektryk-${city.slug!.current}`}
									className="text-gray-400 hover:text-amber-400 transition-colors text-sm px-3 py-1.5 rounded-full border border-white/10 hover:border-amber-400/30">
									Elektryk {city.name}
								</Link>
							))}
						</div>
					</div>
				)}

				{/* Business info */}
				<div className="border-t border-white/10 mt-10 pt-8 text-center">
					<p className="text-gray-400 text-sm">
						Elektryk Majkel Michał Środek &nbsp;|&nbsp; NIP: 8652592539 &nbsp;|&nbsp; REGON: 544124643
					</p>
				</div>

				{/* Bottom bar */}
				<div className="border-t border-white/10 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
					<p className="text-gray-400 text-sm">
						&copy; {new Date().getFullYear()} Elektryk Majkel. Wszelkie prawa zastrzeżone.
					</p>
					<div className="flex items-center gap-4 text-gray-400 text-sm">
						<Link href="/polityka-prywatnosci" className="hover:text-amber-400 transition-colors">
							Polityka prywatności
						</Link>
						<span>•</span>
						<Link href="/regulamin" className="hover:text-amber-400 transition-colors">
							Regulamin
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
