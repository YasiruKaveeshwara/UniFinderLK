import { Link } from "react-router-dom";

const LogoMark = () => (
	<svg className='w-8 h-8' viewBox='0 0 32 32' fill='none'>
		<rect width='32' height='32' rx='8' fill='url(#flogo)' />
		<path d='M16 7L8 12v8l8 5 8-5v-8l-8-5z' stroke='#fff' strokeWidth='1.6' strokeLinejoin='round' fill='none' />
		<path d='M16 7v10m0 0l8-5m-8 5l-8-5m8 5v8' stroke='#fff' strokeWidth='1.2' strokeLinejoin='round' opacity='0.6' />
		<circle cx='16' cy='17' r='2.5' fill='#fff' />
		<defs>
			<linearGradient id='flogo' x1='0' y1='0' x2='32' y2='32'>
				<stop stopColor='#6366F1' />
				<stop offset='1' stopColor='#0EA5E9' />
			</linearGradient>
		</defs>
	</svg>
);

export default function Footer() {
	const year = new Date().getFullYear();

	const platformLinks = [
		{ label: "Home", href: "/" },
		{ label: "Degree Recommendations", href: "/#pathways-section" },
	];

	const legalLinks = [
		{ label: "Privacy Policy", href: "/privacy-policy" },
		{ label: "Terms of Service", href: "/terms-of-service" },
		{ label: "Cookie Policy", href: "/cookie-policy" },
		{ label: "Accessibility", href: "/accessibility" },
	];

	return (
		<footer
			id='site-footer'
			className='w-full mt-auto border-t shadow-[0_-8px_30px_-5px_rgba(14,165,233,0.12)] border-sky-100/80 bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50/80'>
			<div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 gap-10 py-14 md:grid-cols-3 lg:gap-16'>
					<div className='space-y-5'>
						<div className='flex items-center gap-2.5'>
							<LogoMark />
							<span className='text-lg font-bold tracking-tight text-slate-900'>UniFinderLK</span>
						</div>
						<p className='max-w-xs text-sm leading-relaxed text-slate-500'>
							AI-driven degree recommendation for Sri Lankan students. The app now focuses on one system: helping you
							choose a degree path with clarity.
						</p>
					</div>

					<div className='space-y-4'>
						<h4 className='text-sm font-semibold tracking-wider uppercase text-slate-900'>Platform</h4>
						<ul className='pl-0 space-y-2.5 list-none'>
							{platformLinks.map((link) => (
								<li key={link.href}>
									<Link
										to={link.href}
										className='text-sm no-underline transition-colors text-slate-500 hover:text-sky-600'>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className='space-y-4'>
						<h4 className='text-sm font-semibold tracking-wider uppercase text-slate-900'>Legal</h4>
						<ul className='pl-0 space-y-2.5 list-none'>
							{legalLinks.map((link) => (
								<li key={link.href}>
									<Link
										to={link.href}
										className='text-sm no-underline transition-colors text-slate-500 hover:text-sky-600'>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className='flex flex-col items-center justify-between gap-4 py-6 text-xs border-t sm:flex-row border-slate-200 text-slate-400'>
					<p>&copy; {year} UniFinderLK. All rights reserved.</p>
					<div className='flex gap-5'>
						<span>Degree-first</span>
						<span className='w-0.5 h-3 bg-slate-200 rounded' />
						<span>Private by design</span>
						<span className='w-0.5 h-3 bg-slate-200 rounded' />
						<span>Made in Sri Lanka</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
