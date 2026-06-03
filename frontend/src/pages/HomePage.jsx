import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Reveal from "../components/ui/Reveal";
import {
	ArrowRightIcon,
	SparkleIcon,
	GraduationIcon,
	CheckIcon,
	CheckCircleIcon,
	CursorCompassIcon,
	ChartBarIcon,
	LightbulbIcon,
	ShieldCheckIcon,
	UserGroupIcon,
	ScrollDownIcon,
} from "../components/ui/Icons";

// ── Sub-components ────────────────────────────────────────────────────────────

function StepCard({ step, index }) {
	return (
		<div className='relative flex flex-col items-center text-center group'>
			<div className='relative z-10 flex items-center justify-center w-16 h-16 mb-5 text-xl font-extrabold text-blue-600 transition-transform duration-300 bg-blue-100 border-2 border-blue-200 rounded-full shadow-md group-hover:scale-110 group-hover:bg-blue-200 group-hover:border-blue-300'>
				{index + 1}
			</div>
			<h3 className='mb-2 text-base font-bold text-slate-800'>{step.title}</h3>
			<p className='max-w-[200px] text-sm leading-relaxed text-slate-500'>{step.description}</p>
		</div>
	);
}

function FeatureCard({ icon, title, description, accentFrom, accentTo, shadowColor, borderHover }) {
	return (
		<div
			className={`flex gap-5 p-7 transition-all duration-300 border group rounded-2xl border-slate-200/80 bg-white hover:shadow-xl hover:-translate-y-0.5 ${borderHover}`}>
			<div
				className={`flex items-center justify-center flex-shrink-0 w-12 h-12 text-white transition-transform duration-300 shadow-md bg-gradient-to-br ${accentFrom} ${accentTo} rounded-xl group-hover:scale-110 ${shadowColor}`}>
				{icon}
			</div>
			<div>
				<h3 className='mb-2 text-base font-bold text-slate-900'>{title}</h3>
				<p className='text-sm leading-relaxed text-slate-500'>{description}</p>
			</div>
		</div>
	);
}

function PathwayCard({
	id,
	onClick,
	gradient,
	blob1,
	blob2,
	badge,
	badgeBg,
	icon,
	iconBg,
	title,
	description,
	features,
	checkBg,
	checkText,
	cta,
	ctaColor,
	border,
}) {
	return (
		<button
			id={id}
			type='button'
			onClick={onClick}
			className={`
				relative flex flex-col h-full p-8 sm:p-10 text-left transition-all duration-300
				border-2 rounded-3xl overflow-hidden group focus:outline-none
				hover:shadow-2xl hover:-translate-y-1 ${border}
			`}>
			{/* Card background gradient */}
			<div className={`absolute inset-0 ${gradient} opacity-100`} />
			{/* Ambient blob inside card */}
			<div className={`absolute top-0 right-0 w-48 h-48 ${blob1} rounded-full blur-[80px] pointer-events-none`} />
			<div className={`absolute bottom-0 left-0 w-32 h-32 ${blob2} rounded-full blur-[60px] pointer-events-none`} />

			<div className='relative z-10 flex flex-col h-full'>
				{/* Icon + badge row */}
				<div className='flex items-start justify-between mb-6'>
					<div
						className={`flex items-center justify-center w-14 h-14 text-white rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 ${iconBg}`}>
						{icon}
					</div>
					<span className={`px-3 py-1 text-xs font-bold border rounded-full ${badgeBg}`}>{badge}</span>
				</div>

				<h3 className='mb-3 text-xl font-extrabold text-white'>{title}</h3>
				<p className='text-sm leading-relaxed mb-7 text-white/70'>{description}</p>

				<div className='mt-auto mb-7 space-y-2.5'>
					{features.map((f) => (
						<div key={f} className='flex items-center gap-3'>
							<div className={`flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full ${checkBg}`}>
								<CheckIcon className={`w-3 h-3 ${checkText}`} />
							</div>
							<span className='text-sm font-medium text-white/80'>{f}</span>
						</div>
					))}
				</div>

				<div
					className={`inline-flex items-center gap-2 text-sm font-bold transition-all ${ctaColor} group-hover:gap-3`}>
					<span>{cta}</span>
					<ArrowRightIcon className='w-4 h-4' />
				</div>
			</div>
		</button>
	);
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function HomePage() {
	const navigate = useNavigate();

	const steps = [
		{
			title: "Select Your Pathway",
			description: "O/L student exploring streams or A/L student checking degree eligibility — choose your path.",
		},
		{
			title: "Enter Your Details",
			description: "Share your stream, subjects, Z-score, or interests. Every field is optional.",
		},
		{
			title: "AI Analyses Your Profile",
			description: "Our AI cross-references UGC cutoffs, degree eligibility, and your interests.",
		},
		{
			title: "Get Personalised Results",
			description: "Receive ranked degree recommendations with clear explanations for every match.",
		},
	];

	const features = [
		{
			icon: <LightbulbIcon className='w-6 h-6' />,
			title: "Smart AI Matching",
			description:
				"Advanced NLP analyses your interests and maps them to the most relevant degree programs across all Sri Lankan universities.",
			accentFrom: "from-blue-600",
			accentTo: "to-indigo-600",
			shadowColor: "shadow-blue-500/25",
			borderHover: "hover:border-blue-200",
		},
		{
			icon: <ChartBarIcon className='w-6 h-6' />,
			title: "Real UGC Data",
			description: "Powered by actual UGC cutoff scores, eligibility rules, and subject requirements — not guesswork.",
			accentFrom: "from-emerald-600",
			accentTo: "to-emerald-500",
			shadowColor: "shadow-emerald-500/25",
			borderHover: "hover:border-emerald-200",
		},
		{
			icon: <ShieldCheckIcon className='w-6 h-6' />,
			title: "Explainable Results",
			description:
				"Every recommendation comes with a clear explanation of why it was chosen and how it ranks against your profile.",
			accentFrom: "from-emerald-600",
			accentTo: "to-emerald-500",
			shadowColor: "shadow-emerald-500/25",
			borderHover: "hover:border-emerald-200",
		},
		{
			icon: <UserGroupIcon className='w-6 h-6' />,
			title: "For Every Student",
			description:
				"Whether you've completed O/Ls or A/Ls, our system adapts to your academic stage and available data.",
			accentFrom: "from-blue-600",
			accentTo: "to-indigo-600",
			shadowColor: "shadow-blue-500/25",
			borderHover: "hover:border-blue-200",
		},
	];

	const stats = [
		{ value: "15+", label: "Universities", color: "text-emerald-300" },
		{ value: "200+", label: "Degree Programs", color: "text-teal-300" },
		{ value: "25", label: "Districts Covered", color: "text-emerald-300" },
		{ value: "5", label: "A/L Streams", color: "text-teal-300" },
	];

	return (
		<div className='relative overflow-hidden'>
			{/* ── Hero ─────────────────────────────────────────────────────── */}
			<section
				id='hero-section'
				className='relative flex flex-col justify-center min-h-screen overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-600'>
				{/* Ambient blobs — blue only */}
				<div className='absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[140px] pointer-events-none mix-blend-screen' />
				<div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />
				<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none' />

				<div className='relative z-10 flex flex-col items-center justify-center px-4 py-28 sm:px-6'>
					<div className='w-full max-w-5xl mx-auto text-center'>
						{/* Badge */}
						<Reveal delay={0.1}>
							<div className='inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold tracking-widest uppercase rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm'>
								<SparkleIcon className='w-4 h-4 text-cyan-300' />
								<span>AI-Powered Degree Discovery for Sri Lanka</span>
							</div>
						</Reveal>

						{/* H1 */}
						<Reveal delay={0.2}>
							<h1 className='mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl'>
								Find Your Perfect{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300'>
									University Path
								</span>
								<br />
								in Sri Lanka
							</h1>
						</Reveal>

						{/* Subtitle */}
						<Reveal delay={0.35}>
							<p className='max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-white/75'>
								Whether you're finishing O/Ls or ready with A/L results — our intelligent system maps out exactly which
								degree programs fit your profile, stream, and interests.
							</p>
						</Reveal>

						{/* CTAs */}
						<Reveal delay={0.5}>
							<div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
								<button
									type='button'
									onClick={() => navigate("/signup")}
									className='inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]'>
									Get Started Free
									<ArrowRightIcon className='w-4 h-4' />
								</button>
								<button
									type='button'
									onClick={() => document.getElementById("pathways-section")?.scrollIntoView({ behavior: "smooth" })}
									className='inline-flex items-center justify-center gap-2.5 px-7 py-4 text-base font-semibold text-white border-2 border-white/25 rounded-2xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:-translate-y-0.5'>
									Explore Pathways
								</button>
							</div>
						</Reveal>

						{/* Trust pills */}
						<Reveal delay={0.65}>
							<div className='flex flex-wrap items-center justify-center gap-6 mt-12'>
								{["Based on real UGC data", "O/L & A/L supported", "100% free"].map((text) => (
									<div key={text} className='flex items-center gap-2 text-sm font-medium text-white/70'>
										<CheckCircleIcon className='w-5 h-5 text-cyan-300' />
										<span>{text}</span>
									</div>
								))}
							</div>
						</Reveal>
					</div>

					{/* Scroll cue */}
					<motion.div
						className='absolute flex flex-col items-center gap-2 bottom-8 text-white/40'
						animate={{ y: [0, 8, 0] }}
						transition={{ duration: 2, repeat: Infinity }}>
						<span className='text-xs font-medium tracking-wider uppercase'>Scroll to explore</span>
						<ScrollDownIcon className='w-5 h-5' />
					</motion.div>
				</div>
			</section>

			{/* ── Pathways ─────────────────────────────────────────────────── */}
			<section id='pathways-section' className='relative px-4 overflow-hidden py-28 bg-slate-50 sm:px-6'>
				<div className='absolute top-[5%] left-[3%] w-[500px] h-[500px] bg-emerald-200/25 rounded-full blur-[140px] pointer-events-none' />
				<div className='absolute bottom-[5%] right-[3%] w-[400px] h-[400px] bg-blue-200/25 rounded-full blur-[120px] pointer-events-none' />

				<div className='relative z-10 max-w-5xl mx-auto'>
					<Reveal>
						<div className='mb-16 text-center'>
							<h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900'>
								Choose Your{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500'>
									Academic Journey
								</span>
							</h2>
							<p className='max-w-2xl mx-auto text-lg text-slate-500'>
								Two tailored pathways designed for different stages of your education.
							</p>
						</div>
					</Reveal>

					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						{/* O/L Card */}
						<Reveal delay={0.15} direction='left'>
							<PathwayCard
								id='pathway-ol'
								onClick={() => navigate("/degree-recommendations/all-students")}
								gradient='bg-gradient-to-br from-teal-700 via-emerald-600 to-teal-600'
								blob1='bg-emerald-400/20'
								blob2='bg-cyan-400/15'
								badge='For O/L Students'
								badgeBg='text-emerald-300 bg-white/10 border-emerald-400/30'
								icon={<CursorCompassIcon className='w-7 h-7' />}
								iconBg='bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30'
								title='Discover Your A/L Stream'
								description="Not sure which A/L stream suits you? Tell us your interests and we'll suggest fitting streams, potential degree paths, and career directions."
								features={["Interest-based stream suggestions", "Potential degree mapping", "AI-driven guidance"]}
								checkBg='bg-white/20'
								checkText='text-white'
								cta='Find My A/L Stream'
								ctaColor='text-emerald-300'
								border='border-teal-700/50 hover:border-emerald-400/60'
							/>
						</Reveal>

						{/* A/L Card */}
						<Reveal delay={0.3} direction='right'>
							<PathwayCard
								id='pathway-al'
								onClick={() => navigate("/degree-recommendations/al-students")}
								gradient='bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-600'
								blob1='bg-cyan-400/20'
								blob2='bg-indigo-400/15'
								badge='For A/L Students'
								badgeBg='text-blue-200 bg-white/10 border-blue-400/30'
								icon={<GraduationIcon className='w-7 h-7' />}
								iconBg='bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30'
								title='Check Degree Eligibility'
								description='Enter your stream, subjects, and Z-score step by step. Our AI detects the best matching approach and shows you eligible and ambitious degrees.'
								features={["Smart scenario detection", "Z-score cutoff matching", "AI-powered interest matching"]}
								checkBg='bg-white/20'
								checkText='text-white'
								cta='Check My Eligibility'
								ctaColor='text-cyan-300'
								border='border-blue-700/50 hover:border-blue-400/60'
							/>
						</Reveal>
					</div>
				</div>
			</section>

			{/* ── Stats ─────────────────────────────────────────────────────── */}
			<section
				id='stats-section'
				className='relative px-4 py-20 overflow-hidden bg-gradient-to-br from-teal-700 via-emerald-600 to-teal-600 sm:px-6'>
				{/* Ambient blobs — green only */}
				<div className='absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />
				<div className='absolute bottom-0 left-0 w-[300px] h-[300px] bg-teal-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen' />

				<div className='relative z-10 max-w-5xl mx-auto'>
					<Reveal>
						<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
							{stats.map((stat, index) => (
								<motion.div
									key={stat.label}
									className='px-5 py-8 text-center border shadow-sm border-white/10 rounded-3xl bg-white/10 backdrop-blur'
									initial={{ scale: 0.8, opacity: 0 }}
									whileInView={{ scale: 1, opacity: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}>
									<div className={`mb-2 text-4xl font-extrabold sm:text-5xl ${stat.color}`}>{stat.value}</div>
									<div className='text-sm font-semibold tracking-wider uppercase text-white/60'>{stat.label}</div>
								</motion.div>
							))}
						</div>
					</Reveal>
				</div>
			</section>

			{/* ── How It Works ─────────────────────────────────────────────── */}
			<section id='how-it-works' className='relative px-4 overflow-hidden py-28 bg-slate-50 sm:px-6'>
				{/* Blue blobs only */}
				<div className='absolute top-[-8%] right-[-5%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-[140px] pointer-events-none' />
				<div className='absolute bottom-[-8%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/25 rounded-full blur-[120px] pointer-events-none' />

				<div className='relative z-10 max-w-6xl mx-auto'>
					<Reveal>
						<div className='mb-16 text-center'>
							<h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900'>
								How It{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600'>
									Works
								</span>
							</h2>
							<p className='max-w-2xl mx-auto text-lg text-slate-500'>
								A few simple inputs — clear, ranked degree recommendations in seconds.
							</p>
						</div>
					</Reveal>

					{/* Connector line on desktop */}
					<div className='relative grid grid-cols-1 gap-12 md:grid-cols-4'>
						{/* Blue connector line only */}
						<div className='absolute hidden md:block h-0.5 top-8 left-[12.5%] right-[12.5%] bg-gradient-to-r from-blue-200 via-indigo-300 to-blue-200 opacity-60 rounded-full' />
						{steps.map((step, index) => (
							<Reveal key={step.title} delay={0.1 + index * 0.12}>
								<StepCard step={step} index={index} />
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ── Features ─────────────────────────────────────────────────── */}
			<section id='features-section' className='relative px-4 overflow-hidden bg-white py-28 sm:px-6'>
				{/* Green blobs only */}
				<div className='absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none' />
				<div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-100/50 rounded-full blur-[120px] pointer-events-none' />

				<div className='relative z-10 max-w-6xl mx-auto'>
					<Reveal>
						<div className='mb-16 text-center'>
							<h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900'>
								Why{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-500'>
									UniFinderLK
								</span>
							</h2>
							<p className='max-w-2xl mx-auto text-lg text-slate-500'>
								Built specifically for the Sri Lankan education system with real, verified data.
							</p>
						</div>
					</Reveal>

					<div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
						{features.map((feature, index) => (
							<Reveal key={feature.title} delay={0.1 + index * 0.1} direction={index % 2 === 0 ? "left" : "right"}>
								<FeatureCard
									icon={feature.icon}
									title={feature.title}
									description={feature.description}
									accentFrom={feature.accentFrom}
									accentTo={feature.accentTo}
									shadowColor={feature.shadowColor}
									borderHover={feature.borderHover}
								/>
							</Reveal>
						))}
					</div>
				</div>
			</section>

			{/* ── CTA Banner ───────────────────────────────────────────────── */}
			<section className='relative px-4 py-24 overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-600 sm:px-6'>
				{/* Blue blobs only */}
				<div className='absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />
				<div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen' />

				<Reveal>
					<div className='relative z-10 max-w-3xl mx-auto text-center'>
						<GraduationIcon className='w-12 h-12 mx-auto mb-6 text-cyan-300' />
						<h2 className='mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
							Ready to find your degree?
						</h2>
						<p className='max-w-xl mx-auto mb-10 text-lg text-white/70'>
							Create a free account, enter your results, and get personalised recommendations in under a minute.
						</p>
						<div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
							<button
								type='button'
								onClick={() => navigate("/signup")}
								className='inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]'>
								Create Free Account
								<ArrowRightIcon className='w-4 h-4' />
							</button>
							<button
								type='button'
								onClick={() => navigate("/degree-recommendations/all-students")}
								className='inline-flex items-center gap-2.5 px-7 py-4 text-base font-semibold text-white border-2 border-white/25 rounded-2xl bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:-translate-y-0.5'>
								Try Without Signing In
							</button>
						</div>
					</div>
				</Reveal>
			</section>
		</div>
	);
}
