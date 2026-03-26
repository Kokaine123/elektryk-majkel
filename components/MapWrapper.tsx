'use client'

import dynamic from 'next/dynamic'

const MapSection = dynamic(() => import('@/components/Map'), { ssr: false })

export default function MapWrapper({ cities }: { cities?: { _id: string; name: string; lat: number; lng: number }[] }) {
	return <MapSection cities={cities} />
}
