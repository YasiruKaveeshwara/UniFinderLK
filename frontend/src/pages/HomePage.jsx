import React from "react";
import { useNavigate } from "react-router-dom";

const ArrowIcon = () => (
	<svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
		<path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' />
	</svg>
);

export default function HomePage() {
	const navigate = useNavigate();

	const cards = [
		{
			title: "A/L Degree Matching",
			description: "Get recommendations based on your stream, district, Z-score, and subjects.",
			action: () => navigate("/degree-recommendations/al-students"),
			accent: "from-blue-500 to-indigo-600",
		},
		{
			title: "O/L Pathway Guidance",
			description: "Use interests and optional marks to see the degree pathways that fit your profile.",
			action: () => navigate("/degree-recommendations/all-students"),
			accent: "from-emerald-500 to-teal-600",
		},
		{
			title: "Explainable Results",
			description: "See why each recommendation was chosen and how it ranks against your profile.",
			action: () => navigate("/degree-recommendations"),
			accent: "from-violet-500 to-fuchsia-600",
		},
	];

	return (
		<div className='relative overflow-hidden bg-slate-950'>
			<div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_26%),radial-gradient(circle_at_bottom,rgba(99,102,241,0.2),transparent_32%)]' />
			<div className='relative px-4 py-20 sm:py-24'>
				<div className='mx-auto max-w-7xl'>
					<div className='max-w-3xl'>
						<div className='inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.25em] uppercase rounded-full bg-white/10 text-cyan-100 border border-white/10 backdrop-blur-sm'>
							Uni-Finder Degree Recommendation System
						</div>
						<h1 className='text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl'>
							Find the right degree path without the noise from other systems.
						</h1>
						<p className='max-w-2xl mt-6 text-lg leading-relaxed text-slate-300'>
							Uni-Finder now focuses only on degree recommendation. Use your academic profile and interests to get a
							clear, explainable pathway into the degree programs that fit you best.
						</p>
						<div className='flex flex-col gap-3 mt-8 sm:flex-row'>
							<button
								type='button'
								onClick={() => navigate("/degree-recommendations")}
								className='inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-slate-950 bg-white rounded-xl shadow-lg shadow-cyan-500/20 transition-transform hover:-translate-y-0.5'>
								Open Degree System <ArrowIcon />
							</button>
							<button
								type='button'
								onClick={() => navigate("/degree-recommendations/al-students")}
								className='inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm transition-colors hover:bg-white/10'>
								Start A/L Recommendation <ArrowIcon />
							</button>
						</div>
					</div>

					<div className='grid grid-cols-1 gap-5 mt-16 md:grid-cols-3'>
						{cards.map((card) => (
							<button
								key={card.title}
								type='button'
								onClick={card.action}
								className='group text-left p-6 rounded-3xl border border-white/10 bg-white/8 backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.22)] transition-all hover:-translate-y-1 hover:bg-white/12'>
								<div
									className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-white shadow-lg`}>
									<ArrowIcon />
								</div>
								<h2 className='mt-5 text-xl font-bold text-white'>{card.title}</h2>
								<p className='mt-3 text-sm leading-relaxed text-slate-300'>{card.description}</p>
								<div className='inline-flex items-center gap-2 mt-5 text-sm font-semibold text-cyan-200 transition-transform group-hover:gap-3'>
									Open <ArrowIcon />
								</div>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
