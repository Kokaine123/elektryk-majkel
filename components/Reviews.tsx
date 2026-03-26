'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface Review {
	author: string
	rating: number
	text: string
	date: string
}

const defaultReviews: Review[] = [
	{
		author: 'Marcin Kowalski',
		rating: 5,
		text: 'Profesjonalna obsługa od A do Z. Pan Michał wykonał całą instalację elektryczną w nowym domu. Wszystko sprawnie, czysto i terminowo. Polecam gorąco!',
		date: '2 miesiące temu',
	},
	{
		author: 'Anna Nowak',
		rating: 5,
		text: 'Szybka reakcja na awarię — przyjechał w ciągu godziny wieczorem. Naprawił zwarcie i wymienił uszkodzony odcinek instalacji. Cena uczciwa, fachowa robota.',
		date: '3 miesiące temu',
	},
	{
		author: 'Tomasz Wiśniewski',
		rating: 5,
		text: 'Montaż oświetlenia LED w całym biurze. Efekt przeszedł nasze oczekiwania. Doradził najlepsze rozwiązania, a cena była konkurencyjna. Będziemy wracać!',
		date: '1 miesiąc temu',
	},
	{
		author: 'Katarzyna Zielińska',
		rating: 5,
		text: 'Modernizacja instalacji w starym mieszkaniu. Pan Michał wyjaśnił każdy etap prac, zadbał o bezpieczeństwo i porządek. Polecam z czystym sumieniem.',
		date: '4 miesiące temu',
	},
	{
		author: 'Piotr Mazur',
		rating: 5,
		text: 'Instalacja systemu Smart Home — sterowanie światłem i roletami z telefonu działa bez zarzutu. Bardzo profesjonalne podejście i świetny kontakt.',
		date: '2 tygodnie temu',
	},
	{
		author: 'Ewa Krawczyk',
		rating: 4,
		text: 'Szybko i sprawnie wymienił tablicę rozdzielczą. Wszystko działa jak należy. Jedyny minus to lekkie opóźnienie, ale efekt końcowy bez zastrzeżeń.',
		date: '5 miesięcy temu',
	},
	{
		author: 'Robert Dąbrowski',
		rating: 5,
		text: 'Pomiary elektryczne w firmie — pełna dokumentacja, protokoły i certyfikaty dostarczone następnego dnia. Bardzo solidna firma, polecam przedsiębiorcom.',
		date: '3 tygodnie temu',
	},
	{
		author: 'Monika Lewandowska',
		rating: 5,
		text: 'Podłączenie fotowoltaiki do sieci. Świetne doradztwo, szybka realizacja. Rachunki za prąd spadły o 70%! Dziękujemy za profesjonalizm.',
		date: '1 miesiąc temu',
	},
]

function Stars({ count }: { count: number }) {
	return (
		<div className="flex gap-0.5" role="img" aria-label={`Ocena: ${count} na 5 gwiazdek`}>
			{Array.from({ length: 5 }).map((_, i) => (
				<svg
					key={i}
					className={`w-5 h-5 ${i < count ? 'text-amber-400' : 'text-gray-300'}`}
					fill="currentColor"
					viewBox="0 0 20 20"
					aria-hidden="true">
					<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
				</svg>
			))}
		</div>
	)
}

export default function Reviews({ initialReviews }: { initialReviews?: Review[] }) {
	const reviews = initialReviews && initialReviews.length > 0 ? initialReviews : defaultReviews
	const [current, setCurrent] = useState(0)
	const [isAutoPlaying, setIsAutoPlaying] = useState(true)
	const [itemsPerView, setItemsPerView] = useState(1)
	const [touchStartX, setTouchStartX] = useState(0)
	const [touchEndX, setTouchEndX] = useState(0)
	const [isSwiping, setIsSwiping] = useState(false)
	const carouselRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const update = () => {
			setItemsPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
		}
		update()
		window.addEventListener('resize', update)
		return () => window.removeEventListener('resize', update)
	}, [])

	const maxIndex = Math.max(0, reviews.length - itemsPerView)

	const next = useCallback(() => {
		setCurrent(prev => (prev >= maxIndex ? 0 : prev + 1))
	}, [maxIndex])

	const prev = useCallback(() => {
		setCurrent(prev => (prev <= 0 ? maxIndex : prev - 1))
	}, [maxIndex])

	useEffect(() => {
		if (!isAutoPlaying) return
		const timer = setInterval(next, 5000)
		return () => clearInterval(timer)
	}, [isAutoPlaying, next])

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStartX(e.touches[0].clientX)
		setTouchEndX(e.touches[0].clientX)
		setIsSwiping(true)
		setIsAutoPlaying(false)
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		if (isSwiping) {
			setTouchEndX(e.touches[0].clientX)
		}
	}

	const handleTouchEnd = () => {
		if (!isSwiping) return
		setIsSwiping(false)
		const diff = touchStartX - touchEndX
		const threshold = 50
		if (diff > threshold) {
			next()
		} else if (diff < -threshold) {
			prev()
		}
		setTimeout(() => setIsAutoPlaying(true), 3000)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'ArrowLeft') {
			e.preventDefault()
			prev()
			setIsAutoPlaying(false)
			setTimeout(() => setIsAutoPlaying(true), 3000)
		} else if (e.key === 'ArrowRight') {
			e.preventDefault()
			next()
			setIsAutoPlaying(false)
			setTimeout(() => setIsAutoPlaying(true), 3000)
		}
	}

	const toggleAutoPlay = () => {
		setIsAutoPlaying(prev => !prev)
	}

	return (
		<section id="opinie" aria-label="Opinie klientów" className="py-24 bg-[#faf9f6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section header */}
				<div className="text-center mb-16">
					<span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Opinie</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4">
						Co mówią{' '}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
							Nasi Klienci
						</span>
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto text-lg">
						Zaufało nam ponad 500 klientów. Sprawdź, co o nas piszą w Google.
					</p>

					{/* Google rating summary */}
					<div className="inline-flex items-center gap-3 mt-6 bg-[#f3f2ef] border border-gray-200/80 rounded-full px-6 py-3">
						<svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							/>
						</svg>
						<Stars count={5} />
						<span className="text-gray-900 font-bold text-lg">4.9</span>
						<span className="text-gray-600 text-sm">(127 opinii)</span>
					</div>
				</div>

				{/* Carousel */}
				<div
					ref={carouselRef}
					className="relative"
					role="region"
					aria-roledescription="karuzela"
					aria-label="Opinie klientów"
					tabIndex={0}
					onKeyDown={handleKeyDown}
					onMouseEnter={() => setIsAutoPlaying(false)}
					onMouseLeave={() => setIsAutoPlaying(true)}>
					{/* Cards container */}
					<div
						className="overflow-hidden touch-pan-y"
						aria-live={isAutoPlaying ? 'off' : 'polite'}
						aria-atomic="false"
						onTouchStart={handleTouchStart}
						onTouchMove={handleTouchMove}
						onTouchEnd={handleTouchEnd}>
						<div
							className="flex transition-transform duration-500 ease-in-out"
							style={{
								transform: `translateX(-${current * (100 / itemsPerView)}%)`,
							}}>
							{reviews.map((review, i) => (
								<div key={i} className="flex-shrink-0 px-3" style={{ width: `${100 / itemsPerView}%` }}>
									<div className="bg-[#faf9f6] border border-gray-200/80 rounded-2xl p-8 h-full flex flex-col hover:border-amber-500/30 transition-colors duration-300 shadow-sm">
										{/* Header */}
										<div className="flex items-center gap-4 mb-4">
											<div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 font-bold text-lg flex-shrink-0">
												{review.author[0]}
											</div>
											<div>
												<h3 className="font-bold text-gray-900">{review.author}</h3>
												<p className="text-gray-600 text-sm">{review.date}</p>
											</div>
										</div>

										{/* Stars */}
										<Stars count={review.rating} />

										{/* Review text */}
										<p className="text-gray-600 leading-relaxed mt-4 flex-grow">"{review.text}"</p>

										{/* Google badge */}
										<div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-200">
											<svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
												<path
													fill="#4285F4"
													d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
												/>
												<path
													fill="#34A853"
													d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
												/>
												<path
													fill="#FBBC05"
													d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
												/>
												<path
													fill="#EA4335"
													d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
												/>
											</svg>
											<span className="text-gray-600 text-xs">Opinia z Google</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Navigation arrows */}
					<button
						onClick={prev}
						className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 w-12 h-12 bg-[#faf9f6] hover:bg-amber-500 border border-gray-200/80 hover:border-amber-500 rounded-full flex items-center justify-center text-gray-700 hover:text-white transition-all duration-200 cursor-pointer shadow-lg"
						aria-label="Poprzednia opinia">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>
					<button
						onClick={next}
						className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 w-12 h-12 bg-[#faf9f6] hover:bg-amber-500 border border-gray-200/80 hover:border-amber-500 rounded-full flex items-center justify-center text-gray-700 hover:text-white transition-all duration-200 cursor-pointer shadow-lg"
						aria-label="Następna opinia">
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>

					{/* Dots indicator */}
					<div className="flex justify-center items-center gap-1 mt-8">
						{Array.from({ length: maxIndex + 1 }).map((_, i) => (
							<button
								key={i}
								onClick={() => setCurrent(i)}
								className="relative h-11 w-11 flex items-center justify-center cursor-pointer"
								aria-label={`Przejdź do opinii ${i + 1}`}>
								<span
									className={`block rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2 bg-amber-500' : 'w-2 h-2 bg-gray-400 hover:bg-gray-500'}`}
								/>
							</button>
						))}
						{/* Pause/Play button (WCAG 2.2.2) */}
						<button
							onClick={toggleAutoPlay}
							className="ml-2 h-11 w-11 flex items-center justify-center rounded-full border border-gray-200/80 hover:border-amber-500/50 bg-[#faf9f6] hover:bg-amber-50 text-gray-600 hover:text-amber-600 transition-all duration-200 cursor-pointer"
							aria-label={isAutoPlaying ? 'Zatrzymaj automatyczne przewijanie' : 'Wznów automatyczne przewijanie'}>
							{isAutoPlaying ? (
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
									<path
										fillRule="evenodd"
										d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
										clipRule="evenodd"
									/>
								</svg>
							) : (
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
									<path
										fillRule="evenodd"
										d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
