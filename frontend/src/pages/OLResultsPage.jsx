import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CareerPathwayTree from "../components/CareerPathwayTree";
import { ArrowLeftIcon, ClipboardIcon, GraduationIcon, RefreshIcon, UserIcon } from "../components/ui/Icons";

export default function OLResultsPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { results, interests, olMarks } = location.state || {};

	// If no results (e.g. direct navigation), redirect back
	if (!results) {
		navigate("/degree-recommendations/all-students");
		return null;
	}

	// Build a readable list of O/L marks if provided
	const hasMarks =
		olMarks &&
		(Object.values(olMarks.core || {}).some((v) => v !== "") ||
			olMarks.bucket_1 ||
			olMarks.bucket_2 ||
			olMarks.bucket_3);

	const coreSubjectKeys = ["religion", "first_language", "mathematics", "science", "english", "history"];
	const coreLabels = {
		religion: "Religion",
		first_language: "First Language",
		mathematics: "Mathematics",
		science: "Science",
		english: "English",
		history: "History",
	};

	// Core marks: only the 6 defined subjects with a value
	const coreMarks = coreSubjectKeys
		.filter((k) => olMarks?.core?.[k])
		.map((k) => ({ label: coreLabels[k], grade: olMarks.core[k] }));

	// Optional subjects: pair bucket name + grade from core
	const optionals = [1, 2, 3]
		.map((n) => ({
			subject: olMarks?.[`bucket_${n}`],
			grade: olMarks?.core?.[`bucket_${n}_grade`] || olMarks?.[`bucket_${n}_grade`],
		}))
		.filter((o) => o.subject);

	return (
		<div className='min-h-screen pb-20 bg-slate-50'>
			{/* Hero Header */}
			<div className='relative pt-24 overflow-hidden border-b pb-28 border-green-900/40 bg-gradient-to-br from-teal-900 via-emerald-800 to-teal-900'>
				{/* Ambient Blobs */}
				<div className='absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />
				<div className='absolute bottom-0 left-10 w-[400px] h-[400px] bg-teal-400/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen' />

				<div className='relative z-10 max-w-6xl px-6 mx-auto'>
					<div className='inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase rounded-full bg-white/10 text-emerald-50 border border-emerald-400/40'>
						<GraduationIcon className='w-5 h-5' />
						<span>O/L Education Explorer</span>
					</div>
					<h1 className='mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
						Your Career{" "}
						<span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300'>
							Pathway Map
						</span>
					</h1>
					<p className='max-w-xl text-lg leading-relaxed text-emerald-50/80'>
						We've discovered A/L streams perfectly matched to your interests and mapped out your ideal degree pathways.
					</p>
				</div>
			</div>

			{/* Main Content */}
			<div className='relative z-20 max-w-6xl px-6 mx-auto -mt-16'>
				{/* User Input Summary Card */}
				<div className='p-6 mb-8 bg-white border border-green-100 shadow-xl rounded-3xl'>
					<div className='flex flex-wrap items-start gap-8'>
						{/* Interests */}
						<div className='flex-1 min-w-[200px]'>
							<div className='flex items-center gap-2 mb-2'>
								<div className='p-1.5 rounded-lg bg-emerald-100 text-emerald-700'>
									<UserIcon className='w-5 h-5' />
								</div>
								<p className='text-xs font-bold tracking-widest uppercase text-emerald-700'>Your Interests</p>
							</div>
							<p className='text-sm italic leading-relaxed text-slate-700'>"{interests}"</p>
						</div>

						{/* O/L Marks — only if provided */}
						{hasMarks && (
							<div className='flex-1 min-w-[260px]'>
								<div className='flex items-center gap-2 mb-3'>
									<div className='p-1.5 rounded-lg bg-emerald-100 text-emerald-700'>
										<ClipboardIcon className='w-5 h-5' />
									</div>
									<p className='text-xs font-bold tracking-widest uppercase text-emerald-700'>O/L Results</p>
								</div>

								{/* Core Subjects */}
								{coreMarks.length > 0 && (
									<div className='mb-3'>
										<p className='mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider'>
											Core Subjects
										</p>
										<div className='flex flex-wrap gap-1.5'>
											{coreMarks.map(({ label, grade }) => (
												<span
													key={label}
													className='inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200'>
													{label}:
													<span className='px-1.5 py-0.5 font-extrabold text-white bg-emerald-600 rounded-md'>
														{grade}
													</span>
												</span>
											))}
										</div>
									</div>
								)}

								{/* Optional Subjects */}
								{optionals.length > 0 && (
									<div>
										<p className='mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider'>
											Optional Subjects
										</p>
										<div className='flex flex-wrap gap-1.5'>
											{optionals.map(({ subject, grade }, i) => (
												<span
													key={i}
													className='inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 capitalize'>
													{subject}
													{grade && (
														<span className='px-1.5 py-0.5 font-extrabold text-white bg-teal-600 rounded-md'>
															{grade}
														</span>
													)}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						)}

						{/* Quick action */}
						<div className='flex-shrink-0'>
							<button
								onClick={() => navigate("/degree-recommendations/all-students")}
								className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all border text-emerald-700 border-emerald-200 rounded-xl bg-emerald-50 hover:bg-emerald-100 hover:shadow-md'>
								<RefreshIcon className='w-4 h-4' /> Try Again
							</button>
						</div>
					</div>
				</div>

				{/* Career Tree Visualization */}
				<CareerPathwayTree treeData={results} />

				{/* Single Footer Action Row */}
				<div className='flex flex-wrap items-center justify-center gap-4 mt-16'>
					<button
						onClick={() => navigate("/degree-recommendations/all-students")}
						className='inline-flex items-center gap-2 px-8 py-3.5 font-semibold transition-all bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 shadow-emerald-500/25'>
						<RefreshIcon className='w-4 h-4' /> Explore Again
					</button>
					<button
						onClick={() => navigate("/")}
						className='inline-flex items-center gap-2 px-6 py-3.5 font-medium transition-colors bg-white border shadow-sm rounded-xl text-slate-600 border-slate-200 hover:bg-slate-50'>
						<ArrowLeftIcon className='w-4 h-4' /> Back to Main Menu
					</button>
				</div>
			</div>
		</div>
	);
}
