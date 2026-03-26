'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Navbar({ phone, navItems }: { phone?: string; navItems?: { label: string; href: string }[] }) {
	const displayPhone = phone || '+48 537 751 820'
	const phoneHref = `tel:${displayPhone.replace(/\s/g, '')}`
	const [isOpen, setIsOpen] = useState(false)
	const [hidden, setHidden] = useState(false)
	const [activeSection, setActiveSection] = useState('#start')
	const [scrolled, setScrolled] = useState(false)
	const lastScrollY = useRef(0)

	const defaultLinks = [
		{ href: '#start', label: 'Start' },
		{ href: '#uslugi', label: 'Usługi' },
		{ href: '#o-nas', label: 'O nas' },
		{ href: '#realizacje', label: 'Realizacje' },
		{ href: '#kontakt', label: 'Kontakt' },
	]

	const links = navItems && navItems.length > 0 ? navItems : defaultLinks
	const linksRef = useRef(links)
	linksRef.current = links

	useEffect(() => {
		const onScroll = () => {
			const currentScrollY = window.scrollY

			// Hide/show on scroll direction
			if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
				setHidden(true)
				setIsOpen(false)
			} else {
				setHidden(false)
			}
			lastScrollY.current = currentScrollY

			// Background on scroll
			setScrolled(currentScrollY > 20)

			// Active section detection — sort by actual DOM position
			const currentLinks = linksRef.current
			const sectionEls = currentLinks
				.map(l => ({ id: l.href.replace('#', ''), el: document.getElementById(l.href.replace('#', '')) }))
				.filter((s): s is { id: string; el: HTMLElement } => s.el !== null)
				.sort((a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top)

			let found = false
			for (let i = sectionEls.length - 1; i >= 0; i--) {
				if (sectionEls[i].el.getBoundingClientRect().top <= 120) {
					setActiveSection(`#${sectionEls[i].id}`)
					found = true
					break
				}
			}
			if (!found && sectionEls.length > 0) {
				setActiveSection(`#${sectionEls[0].id}`)
			}
		}

		window.addEventListener('scroll', onScroll, { passive: true })
		return () => window.removeEventListener('scroll', onScroll)
	}, [])

	// Smooth scroll to section
	const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
		e.preventDefault()
		const id = href.replace('#', '')
		const el = document.getElementById(id)
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
		setActiveSection(href)
		setIsOpen(false)
	}

	return (
		<nav
			aria-label="Nawigacja główna"
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				hidden ? '-translate-y-[300px]' : 'translate-y-0'
			} ${
				scrolled
					? 'bg-[#faf9f6]/95 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-200/80'
					: 'bg-[#faf9f6]/60 backdrop-blur-md border-b border-gray-200/30'
			}`}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 relative">
					{/* Logo - centered on mobile */}
					<a
						href="#start"
						onClick={e => scrollToSection(e, '#start')}
						className="flex items-center gap-2 group lg:relative absolute left-1/2 lg:left-auto -translate-x-1/2 lg:translate-x-0 cursor-pointer">
						<Image
							src="/elektrykMajkel-ciemne.webp"
							alt="Elektryk Majkel - Profesjonalne usługi elektryczne"
							width={1050}
							height={600}
							priority
							sizes="210px"
							className="h-[120px] w-auto transition-transform duration-300 group-hover:scale-105"
							style={{ marginTop: '30%' }}
						/>
					</a>

					{/* Desktop Navigation */}
					<div className="flex items-center gap-2 max-lg:hidden">
						{links.map(link => (
							<a
								key={link.href}
								href={link.href}
								onClick={e => scrollToSection(e, link.href)}
								className={`relative px-4 py-2 text-base font-semibold rounded-lg transition-all duration-200 group cursor-pointer ${
									activeSection === link.href
										? 'text-amber-600 bg-amber-500/10'
										: 'text-gray-700 hover:text-amber-600 hover:bg-gray-100'
								}`}>
								{link.label}
								{/* Animated underline */}
								<span
									className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-amber-500 rounded-full transition-all duration-300 ${
										activeSection === link.href ? 'w-6' : 'w-0 group-hover:w-4'
									}`}
								/>
							</a>
						))}

						{/* Separator */}
						<div className="w-px h-6 bg-gray-300 mx-2" />

						{/* CTA Button */}
						<a
							href={phoneHref}
							className="relative overflow-hidden bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-2 rounded-lg transition-all duration-200 text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-amber-500/25 cursor-pointer">
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
								/>
							</svg>
							Zadzwoń
						</a>
					</div>

					{/* Mobile hamburger */}
					<button
						className="lg:hidden relative w-10 h-10 flex items-center justify-center text-gray-600 hover:text-amber-500 transition-colors cursor-pointer"
						onClick={() => setIsOpen(!isOpen)}
						aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
						aria-expanded={isOpen}
						aria-controls="mobile-menu">
						<div className="w-6 flex flex-col gap-1.5 items-center">
							<span
								className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
									isOpen ? 'w-6 rotate-45 translate-y-2' : 'w-6'
								}`}
							/>
							<span
								className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
									isOpen ? 'w-0 opacity-0' : 'w-4'
								}`}
							/>
							<span
								className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${
									isOpen ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'
								}`}
							/>
						</div>
					</button>
				</div>
			</div>

			{/* Mobile menu */}
			<div
				id="mobile-menu"
				role="dialog"
				aria-modal="false"
				aria-hidden={!isOpen}
				className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
					isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
				}`}>
				<div className="bg-[#faf9f6]/95 backdrop-blur-xl border-t border-gray-200/80">
					<div className="px-4 py-4 space-y-1">
						{links.map((link, i) => (
							<a
								key={link.href}
								href={link.href}
								onClick={e => scrollToSection(e, link.href)}
								className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
									activeSection === link.href
										? 'bg-amber-500/10 text-amber-600 border-l-2 border-amber-500'
										: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
								}`}
								tabIndex={isOpen ? 0 : -1}
								style={{ animationDelay: `${i * 50}ms` }}>
								<span className="font-medium">{link.label}</span>
							</a>
						))}

						{/* Mobile CTA */}
						<div className="pt-3 border-t border-gray-200">
							<a
								href={phoneHref}
								className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-gray-950 font-semibold px-5 py-3 rounded-lg transition-all duration-200 cursor-pointer">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								Zadzwoń teraz
							</a>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
