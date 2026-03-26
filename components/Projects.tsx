import Image from 'next/image'
import { getProjects, type SanityProject } from '@/lib/queries'
import { urlFor } from '@/lib/sanity'

const fallbackProjects = [
	{
		title: 'Instalacja w domu jednorodzinnym',
		category: 'Instalacje',
		description:
			'Kompleksowa instalacja elektryczna w nowym domu o pow. 180m². Inteligentne oświetlenie, gniazdka w każdym pokoju.',
		image: '/img/instalacjaWDomuJednorodzinnym.jpg',
	},
	{
		title: 'Modernizacja biura',
		category: 'Modernizacja',
		description:
			'Wymiana całej instalacji w biurze 300m². Nowa rozdzielnica, okablowanie strukturalne, oświetlenie LED.',
	},
	{
		title: 'System Smart Home',
		category: 'Smart Home',
		description: 'Wdrożenie systemu inteligentnego domu. Sterowanie oświetleniem, roletami i klimatyzacją.',
	},
	{
		title: 'Automatyka bramowa',
		category: 'Automatyka',
		description:
			'Montaż i konfiguracja napędów do bram wjazdowych i garażowych. Piloty, fotokomórki, sterowanie z telefonu.',
	},
	{
		title: 'Naprawa awaryjna',
		category: 'Awaria',
		description: 'Szybka lokalizacja i naprawa zwarcia w instalacji mieszkania. Wymiana uszkodzonego odcinka.',
	},
	{
		title: 'Montaż fotowoltaiki',
		category: 'Fotowoltaika',
		description: 'Instalacja paneli fotowoltaicznych 10kW z podłączeniem do sieci i optymalizacja zużycia energii.',
	},
]

type Project = {
	title: string
	category: string
	description: string
	image?: string
}

function sanityToProject(p: SanityProject): Project {
	return {
		title: p.title,
		category: p.category,
		description: p.description,
		image: p.image ? urlFor(p.image).width(600).height(400).format('webp').quality(80).url() : undefined,
	}
}

export default async function Projects() {
	let projects: Project[]

	try {
		const sanityProjects = await getProjects()
		projects = sanityProjects.length > 0 ? sanityProjects.map(sanityToProject) : []
	} catch {
		projects = []
	}

	if (projects.length === 0) return null

	return (
		<section id="realizacje" aria-label="Nasze realizacje" className="py-24 bg-[#f3f2ef]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section header */}
				<div className="text-center mb-16">
					<span className="text-amber-700 font-semibold text-sm uppercase tracking-wider">Portfolio</span>
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-3 mb-4">
						Nasze{' '}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
							Realizacje
						</span>
					</h2>
					<p className="text-gray-600 max-w-2xl mx-auto text-lg">
						Przykładowe projekty, które zrealizowaliśmy. Każde zlecenie to dla nas powód do dumy.
					</p>
				</div>

				{/* Projects grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map(project => (
						<div
							key={project.title}
							className="group relative bg-[#faf9f6] border border-gray-200/80 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300">
							{/* Image area */}
							<div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
								{project.image ? (
									<Image
										src={project.image}
										alt={project.title}
										width={600}
										height={400}
										sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
								) : (
									<svg
										className="w-12 h-12 text-gray-300 group-hover:text-amber-500/50 transition-colors"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={1.5}
											d="M13 10V3L4 14h7v7l9-11h-7z"
										/>
									</svg>
								)}
							</div>

							<div className="p-6">
								<span className="inline-block text-xs font-semibold text-amber-900 bg-amber-500/15 px-3 py-1 rounded-full mb-3">
									{project.category}
								</span>
								<h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-amber-600 transition-colors">
									{project.title}
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
