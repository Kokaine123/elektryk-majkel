'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ServiceCard({
	icon,
	title,
	description,
	subItems,
	href,
}: {
	icon: React.ReactNode
	title: string
	description: string
	subItems?: string[]
	href?: string
}) {
	const [open, setOpen] = useState(false)

	return (
		<div className="relative group bg-[#faf9f6] border border-gray-200/80 rounded-2xl p-8 hover:border-amber-500/50 transition-all duration-300 hover:bg-amber-50/30 hover:shadow-lg hover:shadow-amber-500/5">
			{/* Info button — top right */}
			{subItems && subItems.length > 0 && (
				<button
					type="button"
					onClick={() => setOpen(v => !v)}
					aria-expanded={open}
					aria-label={open ? `Ukryj szczegóły: ${title}` : `Pokaż szczegóły: ${title}`}
					className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
						open
							? 'bg-amber-500 text-white shadow-md'
							: 'bg-gray-200 text-gray-500 hover:bg-amber-100 hover:text-amber-600 animate-pulse'
					}`}>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</button>
			)}

			<div className="w-14 h-14 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6 group-hover:bg-amber-500/20 transition-colors">
				{icon}
			</div>

			<h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-amber-600 transition-colors">{title}</h3>
			<p className="text-gray-600 leading-relaxed mb-2">{description}</p>

			{/* Sub-items — animated expand */}
			{subItems && subItems.length > 0 && (
				<div
					className={`grid transition-all duration-300 ease-in-out ${
						open ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
					}`}>
					<div className="overflow-hidden">
						<div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
							{subItems.map(sub => (
								<span
									key={sub}
									className="text-xs bg-amber-50 text-amber-700 border border-amber-200/60 px-2.5 py-1 rounded-full">
									{sub}
								</span>
							))}
						</div>
					</div>
				</div>
			)}

			{/* Link to service subpage */}
			{href && (
				<Link
					href={href}
					className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors mt-4 group/link">
					Dowiedz się więcej
					<svg
						className="w-4 h-4 transition-transform group-hover/link:translate-x-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</Link>
			)}
		</div>
	)
}
