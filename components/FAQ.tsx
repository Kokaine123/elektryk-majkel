'use client'

import { useState } from 'react'

interface FaqItem {
	_id: string
	question: string
	answer: string
}

const defaultFaqs: FaqItem[] = [
	{
		_id: '1',
		question: 'Jaki jest koszt dojazdu?',
		answer:
			'Dojazd na terenie Radomyśla nad Sanem i w promieniu 30 km jest bezpłatny. Dla dalszych lokalizacji koszt ustalamy indywidualnie.',
	},
	{
		_id: '2',
		question: 'Czy pracujecie w weekendy i święta?',
		answer:
			'Tak — w soboty pracujemy w godzinach 8:00-14:00. W nagłych awariach jesteśmy dostępni 24/7, również w niedziele i święta.',
	},
	{
		_id: '3',
		question: 'Jakie posiadacie uprawnienia?',
		answer:
			'Posiadamy pełne uprawnienia SEP (Stowarzyszenie Elektryków Polskich) do wykonywania prac przy instalacjach elektrycznych do 1 kV. Wszystkie prace wykonujemy zgodnie z aktualnymi normami.',
	},
	{
		_id: '4',
		question: 'Jak szybko możecie przyjechać na awarię?',
		answer:
			'W przypadku awarii staramy się dotrzeć w ciągu 1-2 godzin na terenie Radomyśla nad Sanem i najbliższych okolic. Dla dalszych lokalizacji czas reakcji wynosi do 3 godzin.',
	},
	{
		_id: '5',
		question: 'Czy wystawiacie fakturę?',
		answer:
			'Tak, wystawiamy faktury VAT. Na życzenie klienta przygotowujemy również szczegółowy kosztorys przed rozpoczęciem prac.',
	},
	{
		_id: '6',
		question: 'Jak często należy robić przegląd instalacji elektrycznej?',
		answer:
			'Zgodnie z przepisami, przegląd instalacji elektrycznej w budynkach mieszkalnych należy wykonywać co najmniej raz na 5 lat. W obiektach komercyjnych — co 1-5 lat, w zależności od typu obiektu.',
	},
	{
		_id: '7',
		question: 'Co zrobić, gdy wybiło korki?',
		answer:
			'Najpierw sprawdź, czy nie doszło do przeciążenia (zbyt wiele urządzeń na jednym obwodzie). Spróbuj załączyć bezpiecznik. Jeśli ponownie wybija — nie próbuj naprawiać samodzielnie i zadzwoń do nas.',
	},
	{
		_id: '8',
		question: 'Jaki jest zakres obsługiwanych miejscowości?',
		answer:
			'Obsługujemy Radomyśl nad Sanem i okolice w promieniu ok. 50 km, w tym: Stalową Wolę, Tarnobrzeg, Nisko, Rudnik nad Sanem, Sandomierz, Janów Lubelski i wiele innych. Dla większych zleceń dojeżdżamy dalej.',
	},
]

export default function FAQ({ initialFaqs }: { initialFaqs?: FaqItem[] }) {
	const faqs = initialFaqs && initialFaqs.length > 0 ? initialFaqs : defaultFaqs
	const [openId, setOpenId] = useState<string | null>(null)

	const toggle = (id: string) => {
		setOpenId(prev => (prev === id ? null : id))
	}

	return (
		<section id="faq" className="py-16 sm:py-24 bg-[#f3f2ef]">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-12">
					<span className="inline-block text-amber-700 font-semibold text-sm tracking-wider uppercase mb-3">
						Pytania i odpowiedzi
					</span>
					<h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Najczęściej zadawane pytania</h2>
					<p className="text-gray-600 mt-3 max-w-xl mx-auto">
						Odpowiedzi na pytania, które najczęściej zadają nasi klienci.
					</p>
				</div>

				<div className="space-y-3" role="list">
					{faqs.map(faq => {
						const isOpen = openId === faq._id
						return (
							<div
								key={faq._id}
								role="listitem"
								className={`bg-white rounded-xl border transition-all ${
									isOpen ? 'border-amber-300 shadow-md' : 'border-gray-200 shadow-sm'
								}`}>
								<button
									onClick={() => toggle(faq._id)}
									className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-xl cursor-pointer"
									aria-expanded={isOpen}
									aria-controls={`faq-answer-${faq._id}`}>
									<span className="font-semibold text-gray-900 pr-2">{faq.question}</span>
									<svg
										className={`w-5 h-5 text-amber-500 flex-shrink-0 transition-transform duration-200 ${
											isOpen ? 'rotate-180' : ''
										}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
									</svg>
								</button>
								<div
									id={`faq-answer-${faq._id}`}
									role="region"
									className={`overflow-hidden transition-all duration-200 ${
										isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
									}`}>
									<p className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.answer}</p>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
