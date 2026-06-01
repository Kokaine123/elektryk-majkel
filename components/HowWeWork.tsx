export default function HowWeWork() {
	const steps = [
		{
			number: '01',
			icon: (
				<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
					/>
				</svg>
			),
			title: 'Kontakt i wycena',
			description: 'Zadzwoń lub napisz — opisz problem, a my bezpłatnie wycenimy zlecenie. Często orientacyjny koszt podamy już przez telefon.',
		},
		{
			number: '02',
			icon: (
				<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
					/>
				</svg>
			),
			title: 'Oględziny i plan',
			description: 'Przyjeżdżamy na miejsce, oceniamy zakres prac i ustalamy szczegółowy harmonogram. Wiesz dokładnie co, kiedy i za ile.',
		},
		{
			number: '03',
			icon: (
				<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"
					/>
				</svg>
			),
			title: 'Realizacja prac',
			description: 'Wykonujemy zlecenie terminowo, zgodnie z normami i uprawnieniami SEP. Dbamy o porządek i bezpieczeństwo na każdym etapie.',
		},
		{
			number: '04',
			icon: (
				<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1.5}
						d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z"
					/>
				</svg>
			),
			title: 'Odbiór i gwarancja',
			description: 'Po zakończeniu prac sprzątamy, wykonujemy pomiary i przekazujemy dokumentację. Udzielamy gwarancji do 5 lat na wykonane prace.',
		},
	]

	return (
		<section id="jak-dzialamy" aria-label="Jak działamy" className="bg-gray-950 py-20 sm:py-28 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<span className="text-amber-400 font-semibold text-sm uppercase tracking-wider">Proces współpracy</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white">
						Jak{' '}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
							działamy
						</span>
						?
					</h2>
					<p className="text-gray-400 max-w-2xl mx-auto text-lg">
						Od pierwszego telefonu do gotowej instalacji — przejrzysty proces, bez niespodzianek.
					</p>
				</div>

				{/* Steps */}
				<div className="relative">
					{/* Connecting dashed line (desktop) */}
					<div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-amber-500/30" />

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
						{steps.map((step, i) => (
							<div key={step.number} className="relative group text-center">
								{/* Step number + icon */}
								<div className="relative inline-flex flex-col items-center">
									<div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:bg-amber-500/20 group-hover:border-amber-500/40 group-hover:scale-110 transition-all duration-300">
										{step.icon}
									</div>
									{/* Number badge */}
									<span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-500 text-gray-950 rounded-full text-xs font-bold flex items-center justify-center shadow-lg shadow-amber-500/30">
										{step.number}
									</span>
								</div>

								{/* Desktop: chevron arrow on the dashed line */}
								{i < steps.length - 1 && (
									<div
										className="hidden lg:flex items-center justify-center absolute z-10 pointer-events-none"
										style={{ top: '1.625rem', left: 'calc(100% + 0.75rem)', transform: 'translateX(-50%)' }}>
										<div className="w-7 h-7 rounded-full bg-gray-950 border border-amber-500/30 flex items-center justify-center">
											<svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
											</svg>
										</div>
									</div>
								)}

								{/* Text */}
								<h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
									{step.title}
								</h3>
								<p className="text-gray-400 text-sm leading-relaxed max-w-[260px] mx-auto">
									{step.description}
								</p>

								{/* Mobile/Tablet: dashed vertical arrow connector */}
								{i < steps.length - 1 && (
									<div className="flex lg:hidden flex-col items-center mt-5">
										<div className="h-6 border-l-2 border-dashed border-amber-500/30" />
										<svg className="w-4 h-4 text-amber-400 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
										</svg>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
