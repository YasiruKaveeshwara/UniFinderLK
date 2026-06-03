import { Link } from "react-router-dom";
import { LogoMark } from "./ui/Icons";

export default function Footer() {
	const year = new Date().getFullYear();

	const sections = [
		{
			heading: "Explore",
			color: "text-blue-600",
			links: [
				{ label: "Home", href: "/" },
				{ label: "O/L Stream Explorer", href: "/degree-recommendations/all-students" },
				{ label: "A/L Degree Finder", href: "/degree-recommendations/al-students" },
				{ label: "Feedback", href: "/feedback" },
				{ label: "My Profile", href: "/profile" },
			],
		},
		{
			heading: "Account",
			color: "text-indigo-600",
			links: [
				{ label: "Sign In", href: "/signin" },
				{ label: "Create Account", href: "/signup" },
				{ label: "Onboarding", href: "/onboarding" },
			],
		},
		{
			heading: "About",
			color: "text-blue-500",
			links: [
				{ label: "About UniFinderLK", href: "/about" },
				{ label: "Contact", href: "/about" },
			],
		},
	];

	return (
		<footer id='site-footer' className='w-full mt-auto bg-white border-t border-slate-100'>
			{/* Top stripe — colored accent line */}
			<div className='w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-500' />

			<div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
				{/* Main grid */}
				<div className='grid grid-cols-1 gap-6 py-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-6'>
					{/* Brand column */}
					<div className='space-y-2.5 md:col-span-2 lg:col-span-1'>
						<Link to='/' className='flex items-center gap-2 no-underline group w-fit'>
							<LogoMark className='transition-transform duration-300 w-7 h-7 group-hover:scale-105' />
							<span className='text-base font-extrabold tracking-tight text-slate-900'>UniFinderLK</span>
						</Link>

						<p className='max-w-xs text-xs leading-relaxed text-slate-500'>
							Discover the right university degree for your academic profile. Powered by real UGC data and AI matching,
							built for Sri Lankan students.
						</p>
					</div>

					{/* Link columns */}
					{sections.map((section) => (
						<div key={section.heading} className='space-y-2'>
							<h4 className={`text-[11px] font-bold tracking-widest uppercase ${section.color}`}>{section.heading}</h4>
							<ul className='pl-0 space-y-1.5 list-none'>
								{section.links.map((link) => (
									<li key={link.href}>
										<Link
											to={link.href}
											className='text-xs no-underline transition-colors text-slate-500 hover:text-slate-900 hover:font-medium'>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom bar */}
				<div className='flex flex-col gap-1.5 py-3 text-xs border-t border-slate-100 sm:flex-row sm:items-center sm:justify-between'>
					<p className='text-slate-400 text-[11px]'>
						&copy; {year} <span className='font-semibold text-slate-600'>UniFinderLK</span>. All rights reserved.
					</p>
					<p className='text-[11px] text-slate-400'>
						Designed and built by{" "}
						<a
							href='mailto:kaveeshwaray@gmail.com'
							className='font-semibold no-underline transition-colors text-slate-600 hover:text-blue-600'>
							Yasiru Kaveeshwara
						</a>
					</p>
					<div className='flex items-center gap-1.5 text-slate-400 text-[11px]'>
						<span className='inline-block w-1.5 h-1.5 rounded-full bg-blue-500' />
						<span>AI-powered</span>
						<span className='mx-1 text-slate-200'>·</span>
						<span className='inline-block w-1.5 h-1.5 rounded-full bg-indigo-500' />
						<span>UGC-verified</span>
						<span className='mx-1 text-slate-200'>·</span>
						<span className='inline-block w-1.5 h-1.5 rounded-full bg-blue-400' />
						<span>Private by design</span>
					</div>
				</div>
			</div>
		</footer>
	);
}
