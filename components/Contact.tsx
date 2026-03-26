'use client'

import { useState } from 'react'

export interface ContactInfoProps {
	phone?: string
	email?: string
	location?: string
	workingHoursWeekday?: string
	workingHoursSaturday?: string
	emergencyNote?: string
	emergencyAvailable?: string
	emailResponseTime?: string
}

const defaults: Required<ContactInfoProps> = {
	phone: '+48 537 751 820',
	email: 'elektryk.majkel@gmail.com',
	location: 'Radomyśl nad Sanem i okolice',
	workingHoursWeekday: 'Pon - Pt: 7:00 - 18:00',
	workingHoursSaturday: 'Sob: 8:00 - 14:00',
	emergencyNote: 'Awarie: całodobowo',
	emergencyAvailable: 'Dostępny 24/7 w nagłych wypadkach',
	emailResponseTime: 'Odpowiadamy w ciągu 24h',
}

export default function Contact({ contactInfo }: { contactInfo?: ContactInfoProps }) {
	const info = { ...defaults, ...contactInfo }
	const phoneHref = `tel:${info.phone.replace(/\s/g, '')}`
	const emailHref = `mailto:${info.email}`

	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		service: '',
		message: '',
		consent: false,
	})
	const [files, setFiles] = useState<File[]>([])
	const [sending, setSending] = useState(false)
	const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

	const MAX_FILES = 5
	const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
	const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']

	const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = Array.from(e.target.files || [])
		const valid = selected.filter(f => ALLOWED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE)
		setFiles(prev => [...prev, ...valid].slice(0, MAX_FILES))
		e.target.value = ''
	}

	const removeFile = (index: number) => {
		setFiles(prev => prev.filter((_, i) => i !== index))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setSending(true)
		setStatus('idle')

		try {
			const body = new FormData()
			body.append('name', formData.name)
			body.append('phone', formData.phone)
			body.append('email', formData.email)
			body.append('service', formData.service)
			body.append('message', formData.message)
			files.forEach(f => body.append('photos', f))

			const res = await fetch('/api/contact', {
				method: 'POST',
				body,
			})

			if (!res.ok) throw new Error()

			setStatus('success')
			setFormData({ name: '', phone: '', email: '', service: '', message: '', consent: false })
			setFiles([])
		} catch {
			setStatus('error')
		} finally {
			setSending(false)
		}
	}

	return (
		<section id="kontakt" aria-label="Kontakt i wycena" className="py-24 bg-[#faf9f6]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section header */}
				<div className="text-center mb-16">
					<span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Skontaktuj się</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4">
						Bezpłatna{' '}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Wycena</span>
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto text-lg">
						Opisz swój problem lub potrzebę — odezwiemy się w ciągu 24 godzin z bezpłatną wyceną.
					</p>
				</div>

				<div className="grid lg:grid-cols-5 gap-12">
					{/* Contact info */}
					<div className="lg:col-span-2 space-y-8">
						{/* Phone */}
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
									/>
								</svg>
							</div>
							<div>
								<h3 className="font-bold mb-1 text-gray-900">Telefon</h3>
								<a
									href={phoneHref}
									className="text-gray-600 hover:text-amber-600 transition-colors text-lg cursor-pointer">
									{info.phone}
								</a>
								<p className="text-gray-600 text-sm mt-1">{info.emergencyAvailable}</p>
							</div>
						</div>

						{/* Email */}
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
									/>
								</svg>
							</div>
							<div>
								<h3 className="font-bold mb-1 text-gray-900">Email</h3>
								<a href={emailHref} className="text-gray-600 hover:text-amber-600 transition-colors cursor-pointer">
									{info.email}
								</a>
								<p className="text-gray-600 text-sm mt-1">{info.emailResponseTime}</p>
							</div>
						</div>

						{/* Location */}
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
							</div>
							<div>
								<h3 className="font-bold mb-1 text-gray-900">Obszar działania</h3>
								<p className="text-gray-600">{info.location}</p>
							</div>
						</div>

						{/* Working hours */}
						<div className="flex items-start gap-4">
							<div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 flex-shrink-0">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div>
								<h3 className="font-bold mb-1 text-gray-900">Godziny pracy</h3>
								<p className="text-gray-600">{info.workingHoursWeekday}</p>
								<p className="text-gray-600">{info.workingHoursSaturday}</p>
								<p className="text-gray-600 text-sm mt-1">{info.emergencyNote}</p>
							</div>
						</div>
					</div>

					{/* Contact form */}
					<div className="lg:col-span-3">
						<form
							onSubmit={handleSubmit}
							aria-label="Formularz kontaktowy"
							className="bg-white border border-gray-200 rounded-2xl p-8">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
								<div>
									<label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-2">
										Imię i nazwisko *
									</label>
									<input
										id="contact-name"
										type="text"
										required
										maxLength={100}
										autoComplete="name"
										value={formData.name}
										onChange={e => setFormData({ ...formData, name: e.target.value })}
										className="w-full bg-[#fefdfb] border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
										placeholder="Jan Kowalski"
									/>
								</div>
								<div>
									<label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-2">
										Telefon *
									</label>
									<input
										id="contact-phone"
										type="tel"
										required
										maxLength={20}
										pattern="[\d\s\-+()]{7,20}"
										title="Wpisz prawidłowy numer telefonu (7-20 znaków)"
										autoComplete="tel"
										value={formData.phone}
										onChange={e => setFormData({ ...formData, phone: e.target.value })}
										className="w-full bg-[#fefdfb] border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
										placeholder="+48 123 456 789"
									/>
								</div>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
								<div>
									<label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-2">
										Email
									</label>
									<input
										id="contact-email"
										type="email"
										maxLength={100}
										autoComplete="email"
										value={formData.email}
										onChange={e => setFormData({ ...formData, email: e.target.value })}
										className="w-full bg-[#fefdfb] border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
										placeholder="jan@example.com"
									/>
								</div>
								<div>
									<label htmlFor="contact-service" className="block text-sm font-medium text-gray-700 mb-2">
										Rodzaj usługi
									</label>
									<select
										id="contact-service"
										value={formData.service}
										onChange={e => setFormData({ ...formData, service: e.target.value })}
										className="w-full bg-[#fefdfb] border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors cursor-pointer">
										<option value="">Wybierz usługę...</option>
										<option value="instalacja">Instalacja elektryczna</option>
										<option value="naprawa">Naprawa awaryjna</option>
										<option value="modernizacja">Modernizacja instalacji</option>
										<option value="pomiary">Pomiary elektryczne</option>
										<option value="oswietlenie">Oświetlenie LED</option>
										<option value="smart-home">Smart Home</option>
										<option value="inne">Inne</option>
									</select>
								</div>
							</div>

							<div className="mb-6">
								<label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
									Opis zlecenia *
								</label>
								<textarea
									id="contact-message"
									required
									maxLength={5000}
									rows={5}
									value={formData.message}
									onChange={e => setFormData({ ...formData, message: e.target.value })}
									className="w-full bg-[#fefdfb] border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors resize-none"
									placeholder="Opisz problem lub zakres prac, które potrzebujesz..."
								/>
							</div>

							{/* Photo upload */}
							<div className="mb-6">
								<label className="block text-sm font-medium text-gray-700 mb-2">Zdjęcia (opcjonalne)</label>
								<div className="flex items-center gap-3">
									<label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#fefdfb] border border-gray-300 rounded-xl text-gray-700 hover:border-amber-500 transition-colors cursor-pointer">
										<svg
											className="w-5 h-5 text-amber-500"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											aria-hidden="true">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
											/>
										</svg>
										Dodaj zdjęcia
										<input
											type="file"
											accept="image/jpeg,image/png,image/webp,image/heic"
											multiple
											onChange={handleFiles}
											className="hidden"
										/>
									</label>
									<span className="text-xs text-gray-500">Max {MAX_FILES} zdjęć, do 5 MB każde (JPG, PNG, WebP)</span>
								</div>
								{files.length > 0 && (
									<div className="flex flex-wrap gap-3 mt-3">
										{files.map((file, i) => (
											<div key={i} className="relative group">
												<img
													src={URL.createObjectURL(file)}
													alt={file.name}
													className="w-20 h-20 object-cover rounded-lg border border-gray-200"
												/>
												<button
													type="button"
													onClick={() => removeFile(i)}
													className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
													aria-label={`Usuń ${file.name}`}>
													×
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							<div className="mb-6">
								<label className="flex items-start gap-3 cursor-pointer">
									<input
										type="checkbox"
										required
										checked={formData.consent}
										onChange={e => setFormData({ ...formData, consent: e.target.checked })}
										className="mt-1 w-4 h-4 accent-amber-500 rounded border-gray-300 cursor-pointer flex-shrink-0"
									/>
									<span className="text-sm text-gray-600">
										Wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na zapytanie, zgodnie z{' '}
										<a
											href="/polityka-prywatnosci"
											target="_blank"
											className="text-amber-700 underline hover:text-amber-800">
											Polityką prywatności
										</a>
										. *
									</span>
								</label>
							</div>

							<button
								type="submit"
								disabled={sending}
								className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-400 disabled:cursor-not-allowed text-gray-950 font-bold py-4 rounded-xl text-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 cursor-pointer">
								{sending ? 'Wysyłanie...' : 'Wyślij zapytanie →'}
							</button>

							{status === 'success' && (
								<p className="text-green-600 text-sm text-center mt-4 font-medium">
									✅ Dziękujemy! Wiadomość została wysłana. Odezwiemy się w ciągu 24 godzin.
								</p>
							)}
							{status === 'error' && (
								<p className="text-red-600 text-sm text-center mt-4 font-medium">
									❌ Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń do nas.
								</p>
							)}
							{status === 'idle' && (
								<p className="text-gray-600 text-sm text-center mt-4">
									Odpowiadamy na wszystkie zapytania w ciągu 24 godzin.
								</p>
							)}
						</form>
					</div>
				</div>
			</div>
		</section>
	)
}
