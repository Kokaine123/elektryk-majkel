'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

export default function DeferredSection({
	children,
	rootMargin = '300px 0px',
	minHeight = 0,
}: {
	children: ReactNode
	rootMargin?: string
	minHeight?: number
}) {
	const [visible, setVisible] = useState(false)
	const targetRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		if (visible) return
		const node = targetRef.current
		if (!node) return

		const observer = new IntersectionObserver(
			entries => {
				if (entries.some(entry => entry.isIntersecting)) {
					setVisible(true)
					observer.disconnect()
				}
			},
			{ rootMargin, threshold: 0.01 },
		)

		observer.observe(node)
		return () => observer.disconnect()
	}, [rootMargin, visible])

	return (
		<div ref={targetRef} style={{ minHeight }}>
			{visible ? children : null}
		</div>
	)
}
