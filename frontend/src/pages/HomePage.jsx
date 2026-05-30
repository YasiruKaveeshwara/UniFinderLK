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

function StepCard({ step, index, total }) {
	return (
		<div className='relative flex flex-col items-center text-center group'>
			{index < total - 1 && (
				<div
					className='absolute hidden h-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 md:block'
					style={{ left: "50%", width: "calc(100% + 2.5rem)", top: "2rem", transform: "translateY(-50%)" }}
				/>
			)}

			<div className='relative z-10 flex items-center justify-center w-16 h-16 mb-4 text-white transition-transform duration-300 rounded-full shadow-xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:scale-110 ring-2 ring-white/30'>
				<span className='text-2xl font-extrabold'>{index + 1}</span>
			</div>

			<h3 className='mb-2 text-lg font-semibold text-slate-900'>{step.title}</h3>
			<p className='max-w-xs text-sm leading-relaxed text-slate-500'>{step.description}</p>
		</div>
	);
}

function FeatureCard({ icon, title, description, accentFrom, accentTo, shadowColor }) {
	return (
		<div className='flex gap-5 p-7 transition-all duration-300 border group rounded-2xl border-slate-200/80 bg-white hover:shadow-xl hover:-translate-y-0.5 hover:border-blue-100'>
			<div
				className={`flex items-center justify-center flex-shrink-0 w-12 h-12 text-white transition-transform duration-300 shadow-md bg-gradient-to-br ${accentFrom} ${accentTo} rounded-xl group-hover:scale-110 ${shadowColor}`}>
				{icon}
			</div>
			<div>
				<h3 className='mb-2 text-lg font-bold text-slate-900'>{title}</h3>
				<p className='text-sm leading-relaxed text-slate-500'>{description}</p>
			</div>
		</div>
	);
}

function PathwayCard({
	id,
	onClick,
	bgColor,
	hoverBorder,
	iconBg,
	icon,
	badgeLabel,
	badgeBg,
	badgeText,
	badgeBorder,
	title,
	titleHoverColor,
	description,
	features,
	ctaText,
	ctaColor,
	checkBg,
	checkText,
}) {
	return (
		<button
			id={id}
			type='button'
			onClick={onClick}
			className={`relative flex flex-col h-full p-8 sm:p-10 text-left transition-all duration-300 border shadow-lg group rounded-3xl hover:shadow-xl hover:-translate-y-1 border-slate-200/80 ${hoverBorder} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${bgColor}`}>
			<div className='relative z-10 flex flex-col h-full'>
				<div className='flex items-start justify-between mb-8'>
					<div
						className={`flex items-center justify-center w-14 h-14 text-white transition-transform duration-300 shadow-md ${iconBg} rounded-2xl group-hover:scale-110`}>
						{icon}
					</div>
					<span className={`px-3 py-1 text-xs font-bold border rounded-full ${badgeBg} ${badgeText} ${badgeBorder}`}>
						{badgeLabel}
					</span>
				</div>

				<h3 className={`mb-3 text-2xl font-bold transition-colors text-slate-900 ${titleHoverColor}`}>{title}</h3>
				<p className='mb-8 text-sm leading-relaxed text-slate-500'>{description}</p>

				<div className='mt-auto mb-8 space-y-3'>
					{features.map((feature) => (
						<div key={feature} className='flex items-center gap-3'>
							<div
								className={`flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full ${checkBg} ${checkText}`}>
								<CheckIcon className='w-3 h-3' />
							</div>
							<span className='text-sm font-medium text-slate-600'>{feature}</span>
						</div>
					))}
				</div>

				<div
					className={`inline-flex items-center gap-2 text-sm font-bold transition-all ${ctaColor} group-hover:gap-3`}>
					<span>{ctaText}</span>
					<ArrowRightIcon className='w-4 h-4' />
				</div>
			</div>
		</button>
	);
}

export default function HomePage() {
	const navigate = useNavigate();

	const scrollToPathways = () => {
		document.getElementById("pathways-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const steps = [
		{
			title: "Select Your Pathway",
			description:
				"Choose whether you're an O/L student exploring higher education or an A/L student finding eligible degrees.",
		},
		{
			title: "Enter Your Details",
			description: "Share your academic info: stream, subjects, Z-score, or interests. Skip any optional fields.",
		},
		{
			title: "AI Analyzes Profile",
			description:
				"Our AI cross-references UGC cutoffs, degree eligibility, and your interests to find the best matches.",
		},
		{
			title: "Get Personalized Results",
			description: "Receive ranked degree recommendations with clear explanations of why each fits you.",
		},
	];

	const features = [
		{
			icon: <LightbulbIcon className='w-6 h-6' />,
			title: "Smart AI Matching",
			description:
				"Advanced NLP analyzes your interests and maps them to the most relevant degree programs across all Sri Lankan universities.",
			accentFrom: "from-blue-500",
			accentTo: "to-blue-400",
			shadowColor: "shadow-blue-500/20",
		},
		{
			icon: <ChartBarIcon className='w-6 h-6' />,
			title: "Real UGC Data",
			description: "Powered by actual UGC cutoff scores, eligibility rules, and subject requirements — not guesswork.",
			accentFrom: "from-green-500",
			accentTo: "to-green-400",
			shadowColor: "shadow-green-500/20",
		},
		{
			icon: <ShieldCheckIcon className='w-6 h-6' />,
			title: "Explainable Results",
			description:
				"Every recommendation comes with a clear explanation of why it was chosen and how it ranks against your profile.",
			accentFrom: "from-blue-600",
			accentTo: "to-blue-500",
			shadowColor: "shadow-blue-500/20",
		},
		{
			icon: <UserGroupIcon className='w-6 h-6' />,
			title: "For Every Student",
			description:
				"Whether you've completed O/Ls or A/Ls, our system adapts to your academic stage and available data.",
			accentFrom: "from-green-600",
			accentTo: "to-green-500",
			shadowColor: "shadow-green-500/20",
		},
	];

	const stats = [
		{ value: "15+", label: "Universities" },
		{ value: "200+", label: "Degree Programs" },
		{ value: "25", label: "Districts Covered" },
		{ value: "5", label: "A/L Streams" },
	];

	return (
		<div className='relative overflow-hidden'>
			<section
				id='hero-section'
				className='relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100/80'>
				<div className='absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-300/18 rounded-full blur-[140px] pointer-events-none' />
				<div className='absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/14 rounded-full blur-[120px] pointer-events-none' />
				<div className='absolute top-[40%] right-[30%] w-[250px] h-[250px] bg-blue-300/12 rounded-full blur-[100px] pointer-events-none' />

				<div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24 sm:px-6'>
					<div className='w-full max-w-5xl mx-auto text-center'>
						<Reveal delay={0.1}>
							<div className='inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-sm font-semibold border rounded-full shadow-sm bg-white/90 border-blue-100 text-blue-700'>
								<SparkleIcon className='w-4 h-4' />
								<span>AI-Powered Degree Discovery</span>
							</div>
						</Reveal>

						<Reveal delay={0.2}>
							<h1 className='mb-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl text-slate-900'>
								Find Your Perfect{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500'>
									University Path
								</span>
								<br />
								in Sri Lanka
							</h1>
						</Reveal>

						<Reveal delay={0.35}>
							<p className='max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-slate-500'>
								Whether you're finishing O/Ls or preparing with your A/L results, our intelligent system maps out
								exactly which degree programs fit your profile, stream, and career goals.
							</p>
						</Reveal>

						<Reveal delay={0.5}>
							<div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
								<button
									type='button'
									onClick={scrollToPathways}
									className='inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]'>
									Get Started Free
									<ArrowRightIcon className='w-4 h-4' />
								</button>
							</div>
						</Reveal>

						<Reveal delay={0.65}>
							<div className='flex flex-wrap items-center justify-center gap-6 mt-12'>
								{["Based on real UGC data", "100% free"].map((text) => (
									<div key={text} className='flex items-center gap-2 text-sm font-medium text-slate-500'>
										<CheckCircleIcon className='w-5 h-5 text-blue-500' />
										<span>{text}</span>
									</div>
								))}
							</div>
						</Reveal>
					</div>

					<motion.div
						className='absolute flex flex-col items-center gap-2 bottom-8 text-blue-500/70'
						animate={{ y: [0, 8, 0] }}
						transition={{ duration: 2, repeat: Infinity }}>
						<span className='text-xs font-medium tracking-wider uppercase'>Scroll to explore</span>
						<ScrollDownIcon className='w-5 h-5' />
					</motion.div>
				</div>
			</section>

			<section id='pathways-section' className='relative px-4 py-24 bg-white sm:px-6'>
				<div className='absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-green-200/25 rounded-full blur-[140px] pointer-events-none' />
				<div className='absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-green-300/20 rounded-full blur-[140px] pointer-events-none' />

				<div className='relative z-10 max-w-5xl mx-auto'>
					<Reveal>
						<div className='mb-16 text-center'>
							<h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-slate-900'>
								Choose Your{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500'>
									Academic Journey
								</span>
							</h2>
							<p className='max-w-2xl mx-auto text-lg text-slate-500'>
								Two tailored pathways designed for different stages of your education.
							</p>
						</div>
					</Reveal>

					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						<Reveal delay={0.15} direction='left'>
							<PathwayCard
								id='pathway-ol'
								onClick={() => navigate("/degree-recommendations/all-students")}
								bgColor='bg-green-50'
								hoverBorder='hover:border-green-300'
								iconBg='bg-gradient-to-br from-green-600 to-green-500 shadow-green-500/20'
								icon={<CursorCompassIcon className='w-7 h-7' />}
								badgeLabel='For O/L Students'
								badgeBg='bg-green-50'
								badgeText='text-green-700'
								badgeBorder='border-green-100'
								title='Choose Your A/L Stream'
								titleHoverColor='group-hover:text-green-900'
								description="Not sure which A/L stream to choose? Tell us your interests and strengths and we'll suggest suitable A/L stream options and potential degree programs that match your profile."
								features={["Interest-based stream suggestions", "Potential degree mapping", "AI-driven guidance"]}
								ctaText='Find Stream Options'
								ctaColor='text-green-600'
								checkBg='bg-green-100'
								checkText='text-green-600'
							/>
						</Reveal>

						<Reveal delay={0.3} direction='right'>
							<PathwayCard
								id='pathway-al'
								onClick={() => navigate("/degree-recommendations/al-students")}
								bgColor='bg-blue-50'
								hoverBorder='hover:border-blue-300'
								iconBg='bg-gradient-to-br from-blue-600 to-blue-500 shadow-blue-500/20'
								icon={<GraduationIcon className='w-7 h-7' />}
								badgeLabel='For A/L Students'
								badgeBg='bg-blue-50'
								badgeText='text-blue-700'
								badgeBorder='border-blue-100'
								title='Check Degree Eligibility'
								titleHoverColor='group-hover:text-blue-900'
								description='Just provide your details step-by-step! Our AI automatically detects the best matching approach based on what you share - stream, Z-score, and interests.'
								features={["Smart scenario detection", "Skip optional fields anytime", "AI-powered interest matching"]}
								ctaText='Check Eligibility'
								ctaColor='text-blue-600'
								checkBg='bg-blue-100'
								checkText='text-blue-600'
							/>
						</Reveal>
					</div>
				</div>
			</section>

			<section id='stats-section' className='relative px-4 py-20 overflow-hidden bg-white sm:px-6'>
				<div className='absolute top-0 right-0 w-[400px] h-[400px] bg-blue-300/15 rounded-full blur-[120px] pointer-events-none' />
				<div className='absolute bottom-0 left-10 w-[300px] h-[300px] bg-blue-400/12 rounded-full blur-[100px] pointer-events-none' />
				<div
					className='absolute inset-0 opacity-[0.06]'
					style={{
						backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
						backgroundSize: "24px 24px",
					}}
				/>

				<div className='relative z-10 max-w-5xl mx-auto'>
					<Reveal>
						<div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
							{stats.map((stat, index) => (
								<motion.div
									key={stat.label}
									className='px-5 py-8 text-center border border-blue-100 shadow-sm rounded-3xl bg-sky-100/50 backdrop-blur'
									initial={{ scale: 0.8, opacity: 0 }}
									whileInView={{ scale: 1, opacity: 1 }}
									viewport={{ once: true }}
									transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}>
									<div className='mb-2 text-4xl font-extrabold text-slate-900 sm:text-5xl'>{stat.value}</div>
									<div className='text-sm font-semibold tracking-wider uppercase text-slate-500'>{stat.label}</div>
								</motion.div>
							))}
						</div>
					</Reveal>
				</div>
			</section>

			<section id='how-it-works' className='relative px-4 py-24 overflow-hidden bg-white sm:px-6'>
				<div className='absolute top-[-8%] right-[-5%] w-[500px] h-[500px] bg-blue-200/25 rounded-full blur-[140px] pointer-events-none' />
				<div className='absolute bottom-[-8%] left-[-5%] w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-[120px] pointer-events-none' />

				<div className='relative z-10 max-w-6xl mx-auto'>
					<Reveal>
						<div className='mb-16 text-center'>
							<h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-slate-900'>
								How It Works
							</h2>
							<p className='max-w-3xl mx-auto mb-4 text-lg text-slate-600'>
								Our process turns a few simple inputs into clear, ranked degree recommendations. We combine verified UGC
								cutoff data, your academic details, and AI-powered semantic matching to produce explainable results
								tailored to your profile.
							</p>
						</div>
					</Reveal>

					<div className='grid grid-cols-1 gap-10 md:grid-cols-4'>
						{steps.map((step, index) => (
							<Reveal key={step.title} delay={0.1 + index * 0.12}>
								<StepCard step={step} index={index} total={steps.length} />
							</Reveal>
						))}
					</div>
				</div>
			</section>

			<section id='features-section' className='relative px-4 py-24 bg-white'>
				<div className='max-w-6xl mx-auto'>
					<Reveal>
						<div className='mb-16 text-center'>
							<h2 className='mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900'>
								Why{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500'>
									UniFinderLK
								</span>
							</h2>
							<p className='max-w-2xl mx-auto text-lg text-slate-500'>
								Built specifically for the Sri Lankan education system with real, verified data.
							</p>
						</div>
					</Reveal>

					<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
						{features.map((feature, index) => (
							<Reveal key={feature.title} delay={0.1 + index * 0.1} direction={index % 2 === 0 ? "left" : "right"}>
								<FeatureCard
									icon={feature.icon}
									title={feature.title}
									description={feature.description}
									accentFrom={feature.accentFrom}
									accentTo={feature.accentTo}
									shadowColor={feature.shadowColor}
								/>
							</Reveal>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
