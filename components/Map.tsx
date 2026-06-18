'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Circle, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix missing default marker icons in Next.js / Webpack
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
	iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
	shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const CENTER: L.LatLngExpression = [50.6808, 21.9447]
const RADIUS_KM = 100
const RADIUS_M = RADIUS_KM * 1000

const cityLabelIcon = (name: string) =>
	new L.DivIcon({
		html: `<span style="font-weight:700;font-size:13px;color:#000;text-shadow:0 0 3px #fff,0 0 2px #fff;white-space:nowrap">${name}</span>`,
		className: '',
		iconAnchor: [0, 0],
	})

const hqLabelIcon = new L.DivIcon({
	html: `<span style="font-weight:800;font-size:15px;color:#fbbf24;text-shadow:0 0 6px #000,0 0 3px #000;white-space:nowrap">⚡ Radomyśl nad Sanem — Siedziba</span>`,
	className: '',
	iconAnchor: [0, 12],
})

const DEFAULT_CITIES: { name: string; position: L.LatLngExpression }[] = [
	{ name: 'Sandomierz', position: [50.6826, 21.7489] },
	{ name: 'Stalowa Wola', position: [50.5829, 22.0537] },
]

interface MapProps {
	cities?: { _id: string; name: string; lat: number; lng: number }[]
}

export default function MapSection({ cities }: MapProps) {
	const CITIES =
		cities && cities.length > 0
			? cities.map(c => ({ id: c._id, name: c.name, position: [c.lat, c.lng] as L.LatLngExpression }))
			: DEFAULT_CITIES.map((c, i) => ({ id: `default-${i}`, ...c }))
	return (
		<section id="mapa" aria-label="Obszar działania" className="py-24 bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section header */}
				<div className="text-center mb-16">
					<span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">Gdzie działamy</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-white">
						Nasz{' '}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
							Obszar Działania
						</span>
					</h2>
					<p className="text-gray-400 max-w-2xl mx-auto text-lg">
						Działamy na terenie Radomyśla nad Sanem i okolic w promieniu 100&nbsp;km.
					</p>
				</div>

				{/* Map container */}
				<div className="rounded-xl shadow-lg border-2 border-amber-500/50 overflow-hidden">
					<MapContainer
						center={CENTER}
						zoom={8}
						scrollWheelZoom={false}
						className="w-full h-[500px] z-0"
						style={{ background: '#1f2937' }}>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						/>

						{/* Service area circle */}
						<Circle
							center={CENTER}
							radius={RADIUS_M}
							pathOptions={{
								color: '#d97706',
								weight: 2,
								fillColor: '#fbbf24',
								fillOpacity: 0.2,
							}}
						/>

						{/* HQ label */}
						<Marker position={CENTER} icon={hqLabelIcon} />

						{/* City labels */}
						{CITIES.map(city => (
							<Marker key={city.id} position={city.position} icon={cityLabelIcon(city.name)} />
						))}
					</MapContainer>
				</div>
			</div>
		</section>
	)
}
