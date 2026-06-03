import React from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal";
import {
	LogoMark,
	AccuracyIcon,
	UserGroupIcon,
	PrivacyIcon,
	FreeIcon,
	EmailIcon,
	StarFilledIcon,
	WarningTriangleIcon,
	LinkedInIcon,
} from "../components/ui/Icons";

function StatBadge({ value, label }) {
	return (
		<div className='flex flex-col items-center justify-center px-6 py-5 text-center border bg-white/10 border-white/20 rounded-2xl backdrop-blur-sm'>
			<span className='text-3xl font-extrabold text-white'>{value}</span>
			<span className='text-xs font-semibold text-blue-100 mt-0.5 uppercase tracking-wider'>{label}</span>
		</div>
	);
}

function ValueCard({ icon, title, description }) {
	return (
		<div className='flex gap-3 p-3 transition-shadow duration-200 bg-white border shadow-sm border-slate-100 rounded-2xl hover:shadow-md'>
			<div className='flex items-center justify-center flex-shrink-0 text-blue-600 border border-blue-100 w-11 h-11 rounded-xl bg-blue-50'>
				{icon}
			</div>
			<div className='-mb-4'>
				<h3 className='mb-1 text-sm font-bold text-slate-900'>{title}</h3>
				<p className='text-sm leading-relaxed text-slate-500'>{description}</p>
			</div>
		</div>
	);
}

export default function AboutPage() {
	return (
		<div className='min-h-screen pb-20 bg-slate-50'>
			{/* ── Hero ── */}
			<div className='relative pt-24 overflow-hidden border-b pb-28 border-blue-900/20 bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-600'>
				<div className='absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-400/15 rounded-full blur-[140px] pointer-events-none mix-blend-screen' />
				<div className='absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />

				<div className='relative z-10 max-w-4xl px-6 mx-auto text-center'>
					<div className='inline-flex items-center gap-2 px-4 py-1.5 mb-5 text-xs font-bold tracking-widest uppercase rounded-full bg-white/15 text-blue-100 border border-blue-300/40'>
						<LogoMark className='w-4 h-4' />
						<span>About UniFinderLK</span>
					</div>
					<h1 className='mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
						Helping Every Sri Lankan Student{" "}
						<span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200'>
							Find Their Path
						</span>
					</h1>
					<p className='max-w-2xl mx-auto text-lg leading-relaxed text-blue-100/80'>
						UniFinderLK is a free, AI-powered platform that connects Sri Lankan students with the right university
						degree programs based on their actual academic profile, stream, and interests.
					</p>

					{/* Stats */}
					<div className='flex flex-wrap justify-center gap-4 mt-10'>
						<StatBadge value='200+' label='Degree Programs' />
						<StatBadge value='100%' label='Free to Use' />
						<StatBadge value='AI' label='Powered Matching' />
					</div>
				</div>
			</div>

			{/* ── Main Content ── */}
			<div className='relative z-20 max-w-4xl px-6 mx-auto space-y-8 -mt-14'>
				{/* Mission Card */}
				<Reveal>
					<div className='p-8 bg-white border border-blue-100 shadow-2xl rounded-3xl sm:p-10'>
						<div className='flex items-center gap-3 mb-3'>
							<h2 className='text-lg font-extrabold text-slate-900'>Our Mission</h2>
						</div>
						<p className='mb-4 leading-relaxed text-slate-600'>
							Choosing the right university degree is one of the most important decisions a student makes. Yet for many
							Sri Lankan students, this process is confusing, overwhelming, and inaccessible.
						</p>
						<p className='-mb-2 leading-relaxed text-slate-600'>
							UniFinderLK was built to change that. By combining real UGC cutoff data, official subject eligibility
							rules, and AI-driven interest matching, we give every student a clear, personalized picture of where they
							stand and what opportunities are available to them.
						</p>
					</div>
				</Reveal>

				{/* Values */}
				<Reveal delay={0.1}>
					<div className='p-8 bg-white border shadow-sm border-slate-100 rounded-3xl sm:p-10'>
						<h2 className='mb-6 text-lg font-extrabold text-slate-900'>What We Stand For</h2>
						<div className='grid grid-cols-1 gap-2'>
							<ValueCard
								icon={<AccuracyIcon className='w-5 h-5' />}
								title='Accuracy First'
								description='All degree data, cutoff scores, and eligibility rules are sourced directly from official UGC publications.'
							/>
							<ValueCard
								icon={<UserGroupIcon className='w-5 h-5' />}
								title='For Every Student'
								description='Whether you are an O/L student planning your stream or an A/L student checking eligibility, UniFinderLK supports you at every stage.'
							/>
							<ValueCard
								icon={<PrivacyIcon className='w-5 h-5' />}
								title='Privacy by Design'
								description='Your academic data is stored securely and never shared or sold. You stay in full control of your information.'
							/>
							<ValueCard
								icon={<FreeIcon className='w-8 h-8' />}
								title='Always Free'
								description='UniFinderLK is and always will be completely free for all students. No paywalls, no premium tiers.'
							/>
						</div>
					</div>
				</Reveal>

				{/* Creator Section */}
				<Reveal delay={0.15}>
					<div className='p-8 bg-white border border-blue-100 shadow-sm rounded-3xl sm:p-10'>
						<div className='flex items-center gap-2 mb-6'>
							<span className='text-xs font-bold tracking-widest text-blue-500 uppercase'>Created by</span>
							<div className='flex-1 h-px bg-blue-100' />
						</div>
						<div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
							<div className='flex-1'>
								<h3 className='text-xl font-extrabold text-slate-900'>Yasiru Kaveeshwara</h3>
								<p className='text-sm font-medium text-blue-600 mt-0.5 mb-3'>Designer and Developer</p>
								<p className='mb-5 text-sm leading-relaxed text-slate-500'>
									UniFinderLK was designed and built from the ground up as a passion project to make university
									selection more transparent and accessible for Sri Lankan students.
								</p>
								<div className='flex flex-wrap gap-2'>
									<a
										href='mailto:kaveeshwaray@gmail.com'
										className='inline-flex items-center gap-2 px-4 py-2 text-xs font-bold no-underline transition-all duration-200 border text-slate-700 bg-slate-100 border-slate-200 rounded-xl hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'>
										<EmailIcon className='w-3.5 h-3.5' />
										kaveeshwaray@gmail.com
									</a>
									<a
										href='https://linkedin.com/in/kaveeshwaray'
										target='_blank'
										rel='noopener noreferrer'
										className='inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0A66C2] border border-[#0A66C2] rounded-xl hover:bg-[#004182] hover:border-[#004182] transition-all duration-200 no-underline'>
										<LinkedInIcon className='w-3.5 h-3.5' />
										LinkedIn
									</a>
								</div>
							</div>
						</div>
					</div>
				</Reveal>

				{/* Contact Section */}
				<Reveal delay={0.2}>
					<div className='p-8 bg-white border shadow-sm border-slate-100 rounded-3xl sm:p-10'>
						<div className='flex items-center gap-3 mb-2'>
							<h2 className='text-lg font-extrabold text-slate-900'>Get in Touch</h2>
						</div>
						<p className='mb-6 text-sm leading-relaxed text-slate-500'>
							Have a suggestion, found a data issue, or just want to say hello? Reach out directly.
						</p>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
							<a
								href='mailto:kaveeshwaray@gmail.com'
								className='flex items-center gap-4 px-4 py-2 no-underline transition-all duration-200 border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50/50 group'>
								<div className='flex items-center justify-center w-10 h-10 text-blue-600 transition-colors duration-200 bg-blue-100 rounded-xl group-hover:bg-blue-600 group-hover:text-white'>
									<EmailIcon className='w-5 h-5' />
								</div>
								<div className='-mb-4'>
									<p className='text-xs font-bold tracking-wider uppercase text-slate-500'>Email</p>
									<p className='-mt-2 text-sm font-semibold text-slate-800'>kaveeshwaray@gmail.com</p>
								</div>
							</a>
							<Link
								to='/feedback'
								className='flex items-center gap-4 px-4 no-underline transition-all duration-200 border border-slate-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50/50 group'>
								<div className='flex items-center justify-center w-10 h-10 transition-colors duration-200 rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'>
									<StarFilledIcon className='w-5 h-5' />
								</div>
								<div className='-mb-4'>
									<p className='text-xs font-bold tracking-wider uppercase text-slate-500'>Feedback</p>
									<p className='-mt-2 text-sm font-semibold text-slate-800'>Share your experience</p>
								</div>
							</Link>
						</div>
					</div>
				</Reveal>

				{/* Data disclaimer */}
				<Reveal delay={0.25}>
					<div className='px-5 pt-5 pb-3 border border-amber-200 rounded-2xl bg-amber-50/50'>
						<div className='grid grid-cols-[auto,1fr] gap-4 items-start'>
							<WarningTriangleIcon className='flex-shrink-0 w-8 h-8 mt-0.5 text-amber-500' />
							<div>
								<p className='-mt-2 text-lg font-bold text-amber-900'>Important Data & AI Disclaimer</p>
								<p className='-mt-2 text-xs leading-relaxed text-amber-800'>
									Please review the following information regarding our services and data accuracy.
								</p>
							</div>
							<div className='-mt-4 text-xs leading-relaxed col-span-full text-amber-800'>
								<ul className='pl-4 space-y-2 list-disc'>
									<li>
										<strong className='font-semibold text-amber-900'>UGC Publication Reference:</strong> The information
										provided is based on the 2024 University Grants Commission (UGC) publication data. Because official
										criteria and admission statistics are updated periodically, some details may have changed or been
										revised since publication.
									</li>
									<li>
										<strong className='font-semibold text-amber-900'>Guidance and Exploration Only:</strong> This
										platform is designed solely as a guidance system to assist you in exploring academic possibilities
										and understanding potential pathways. It is intended to help you discover what options are available
										before deciding on specifics.
									</li>
									<li>
										<strong className='font-semibold text-amber-900'>AI Limitation:</strong> Automated matching systems
										and AI models are helpful but can make mistakes. The recommendations should not be considered final
										or official.
									</li>
									<li>
										<strong className='font-semibold text-amber-900'>Mandatory Verification:</strong> Always verify and
										cross-reference your academic data and eligibility criteria with official UGC details and directly
										contact the respective universities before finalizing or submitting applications.
									</li>
								</ul>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</div>
	);
}
