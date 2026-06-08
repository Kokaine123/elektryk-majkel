import { getAboutSection } from '@/lib/queries'

const defaultFeatures = [
	{
		icon: 'shield',
		title: 'Uprawnienia SEP',
		description: 'Posiadamy pełne uprawnienia do eksploatacji i dozoru urządzeń elektrycznych.',
	},
	{
		icon: 'bolt',
		title: 'Szybka realizacja',
		description: 'Większość zleceń realizujemy w ciągu 24-48 godzin od zgłoszenia.',
	},
	{
		icon: 'clipboard',
		title: 'Gwarancja na prace',
		description: 'Na wszystkie wykonane prace udzielamy pisemnej gwarancji do 5 lat.',
	},
	{
		icon: 'coin',
		title: 'Uczciwe ceny',
		description: 'Transparentna wycena przed rozpoczęciem prac. Bez ukrytych kosztów.',
	},
]

function FeatureIcon({ name }: { name: string }) {
	const cls = 'w-6 h-6 text-amber-500'
	switch (name) {
		case 'shield':
		case '🛡️':
			return (
				<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					/>
				</svg>
			)
		case 'bolt':
		case '⚡':
			return (
				<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			)
		case 'clipboard':
		case '📋':
			return (
				<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
					/>
				</svg>
			)
		case 'coin':
		case '💰':
			return (
				<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			)
		default:
			return (
				<svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
				</svg>
			)
	}
}

const defaultAbout = {
	yearsExperience: 'SEP',
	description:
		'Jestem certyfikowanym elektrykiem z uprawnieniami SEP. Specjalizuję się w instalacjach elektrycznych dla domów jednorodzinnych, mieszkań oraz obiektów komercyjnych. Każde zlecenie traktuję indywidualnie, dbając o najwyższą jakość wykonania i bezpieczeństwo.',
	clientsCount: '50+',
	projectsCount: '100+',
	certifications: ['Uprawnienia SEP E i D', 'Ubezpieczenie OC'],
}

export default async function About() {
	let about = defaultAbout
	let features = defaultFeatures

	try {
		const sanityAbout = await getAboutSection()
		if (sanityAbout) {
			about = {
				yearsExperience: sanityAbout.yearsExperience || defaultAbout.yearsExperience,
				description: sanityAbout.description || defaultAbout.description,
				clientsCount: sanityAbout.clientsCount || defaultAbout.clientsCount,
				projectsCount: sanityAbout.projectsCount || defaultAbout.projectsCount,
				certifications: sanityAbout.certifications?.length ? sanityAbout.certifications : defaultAbout.certifications,
			}
			if (sanityAbout.features && sanityAbout.features.length > 0) {
				features = sanityAbout.features.map(f => ({
					icon: f.icon || 'bolt',
					title: f.title,
					description: f.description,
				}))
			}
		}
	} catch {
		// fallback to defaults
	}

	return (
		<section
			id="o-nas"
			aria-label="O nas"
			className="py-24 bg-gray-900 bg-cover bg-center bg-no-repeat bg-fixed"
			style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/backgrounsSectionSep.webp)' }}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					{/* Left: Text content */}
					<div>
						<span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">Dlaczego my</span>
						<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-6 text-white">
							Certyfikowany{' '}
							<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
								Elektryk {about.yearsExperience}
							</span>
						</h2>
						<p className="text-white text-lg leading-relaxed mb-8">{about.description}</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{features.map(feature => (
								<div key={feature.title} className="flex gap-4">
									<div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
										<FeatureIcon name={feature.icon} />
									</div>
									<div>
										<h3
											className={`font-bold mb-1 ${
												[
													'uprawnienia sep',
													'szybka realizacja',
													'gwarancja na prace',
													'uczciwe ceny',
												].some(label => feature.title.toLowerCase().includes(label))
													? 'text-amber-400'
													: 'text-white'
											}`}>
											{feature.title}
										</h3>
										<p className="text-white text-sm leading-relaxed">{feature.description}</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Right: Visual card */}
					<div className="relative">
						<div className="bg-gray-800/90 border border-white/10 rounded-3xl p-10 relative overflow-hidden shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-sm">
							{/* Decorative blurred background layers */}
							<div className="pointer-events-none absolute inset-0">
								<div className="absolute -top-14 -right-14 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl" />
								<div className="absolute -bottom-20 -left-16 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl" />
								<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[26rem] bg-white/5 rounded-full blur-3xl" />
								<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_48%)]" />
								<div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] via-transparent to-black/10" />
							</div>

							<div className="relative space-y-8">
								{/* Experience counter */}
								<div className="text-center">
									<div className="text-7xl font-extrabold text-amber-500 mb-2">{about.yearsExperience}</div>
									<div className="text-gray-400 text-lg">Uprawnienia elektryczne</div>
								</div>

								<div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

								{/* Trust indicators */}
								<div className="grid grid-cols-2 gap-6 text-center">
									<div>
										<div className="text-3xl font-bold text-white">{about.clientsCount}</div>
										<div className="text-gray-400 text-sm mt-1">Zadowolonych klientów</div>
									</div>
									<div>
										<div className="text-3xl font-bold text-white">{about.projectsCount}</div>
										<div className="text-gray-400 text-sm mt-1">Zrealizowanych zleceń</div>
									</div>
								</div>

								<div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

								{/* Certifications */}
								<div className="text-center space-y-3">
									{about.certifications.map((cert, i) => (
										<span key={i}>
											{i > 0 && <span className="block" />}
											<span className="inline-flex items-center gap-2 bg-green-900/30 text-green-400 px-4 py-2 rounded-full text-sm font-medium">
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
												{cert}
											</span>
										</span>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
