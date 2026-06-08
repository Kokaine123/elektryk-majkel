import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
	subsets: ['latin', 'latin-ext'],
	weight: ['700', '800', '900'],
})

export default function CtaBanner() {
	return (
		<div className="relative w-full h-[170px] sm:h-[210px] lg:h-[300px] overflow-hidden">
			<div className="absolute inset-y-0 left-0 w-1/2">
				<div
					className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-scroll lg:bg-fixed"
					style={{
						backgroundImage: 'url("/banerPhoto.png")',
					}}
				/>
				<div className="absolute inset-0 bg-black/45" />
				<div className="relative z-10 h-full flex items-center justify-center -translate-x-6 px-6">
					<p
						className={`${montserrat.className} text-white font-black tracking-wide text-2xl sm:text-4xl lg:text-6xl`}>
						+48 537 751 820
					</p>
				</div>
			</div>
			<div className="relative ml-auto w-1/2 h-full bg-amber-500 before:content-[''] before:absolute before:top-0 before:-left-[8%] before:w-[20%] before:h-full before:bg-amber-500 before:skew-x-[10deg]">
				<div className="relative z-10 h-full flex items-center justify-center text-center px-6">
					<p
						className={`${montserrat.className} text-black font-black uppercase leading-[0.95] tracking-tight text-2xl sm:text-4xl lg:text-6xl`}>
						Potrzebujesz pomocy fachowca? Zadzwoń
					</p>
				</div>
			</div>
		</div>
	)
}
