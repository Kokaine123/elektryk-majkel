'use client'

import { useEffect, useState, type ComponentType } from 'react'

export default function SanityVisualEditing() {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [VE, setVE] = useState<ComponentType<any> | null>(null)

	useEffect(() => {
		import('@sanity/visual-editing/react').then(mod => {
			setVE(() => mod.VisualEditing)
		})
	}, [])

	if (!VE) return null
	return <VE portal />
}
