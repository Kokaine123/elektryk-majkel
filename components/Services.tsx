import { getServices, SanityService } from '@/lib/queries'

const defaultServices = [
	{
		icon: 'home',
		title: 'Instalacje elektryczne',
		description:
			'Kompleksowe instalacje elektryczne w domach, mieszkaniach i obiektach komercyjnych. Nowe budynki i remonty.',
	},
	{
		icon: 'alert',
		title: 'Naprawy awaryjne 24/7',
		description:
			'Szybka reakcja na awarie elektryczne o każdej porze dnia i nocy. Zwarcia, przepięcia, brak prądu — przyjadę natychmiast.',
	},
	{
		icon: 'bolt',
		title: 'Modernizacja instalacji',
		description:
			'Wymiana starych instalacji aluminiowych na miedziane. Dostosowanie do aktualnych norm i zwiększenie bezpieczeństwa.',
	},
	{
		icon: 'beaker',
		title: 'Pomiary elektryczne',
		description:
			'Profesjonalne pomiary ochronne, rezystancji izolacji, impedancji pętli zwarcia. Protokoły i certyfikaty.',
	},
	{
		icon: 'lightbulb',
		title: 'Oświetlenie LED',
		description:
			'Projektowanie i montaż nowoczesnego oświetlenia LED. Inteligentne sterowanie, oświetlenie dekoracyjne i energooszczędne.',
	},
	{
		icon: 'house',
		title: 'Smart Home',
		description:
			'Instalacja systemów inteligentnego domu. Sterowanie oświetleniem, roletami i ogrzewaniem z poziomu smartfona.',
	},
]

function ServiceIcon({ icon }: { icon?: string }) {
	switch (icon) {
		case 'home':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
					/>
				</svg>
			)
		case 'alert':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
					/>
				</svg>
			)
		case 'bolt':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			)
		case 'beaker':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
					/>
				</svg>
			)
		case 'lightbulb':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
					/>
				</svg>
			)
		case 'house':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
					/>
				</svg>
			)
		case 'wrench':
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"
					/>
				</svg>
			)
		default:
			return (
				<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			)
	}
}

export default async function Services() {
	let services: { icon?: string; title: string; description: string }[] = defaultServices

	try {
		const sanityServices = await getServices()
		if (sanityServices && sanityServices.length > 0) {
			services = sanityServices.map(s => ({
				icon: s.icon || undefined,
				title: s.title,
				description: s.description,
			}))
		}
	} catch {
		// fallback to defaults
	}

	return (
		<section id="uslugi" aria-label="Nasze usługi" className="py-24 bg-[#f3f2ef]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section header */}
				<div className="text-center mb-16">
					<span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Co oferujemy</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4">
						Nasze{' '}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Usługi</span>
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto text-lg">
						Oferujemy szeroki zakres usług elektrycznych. Każde zlecenie realizujemy z pełnym profesjonalizmem i
						dbałością o szczegóły.
					</p>
				</div>

				{/* Services grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{services.map(service => (
						<div
							key={service.title}
							className="group bg-[#faf9f6] border border-gray-200/80 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-300 hover:bg-amber-50/30 hover:shadow-lg hover:shadow-amber-500/5">
							<div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500/20 transition-colors">
								<ServiceIcon icon={service.icon} />
							</div>
							<h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition-colors">
								{service.title}
							</h3>
							<p className="text-gray-600 leading-relaxed">{service.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
