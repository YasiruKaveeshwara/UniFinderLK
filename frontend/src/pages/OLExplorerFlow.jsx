import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchAllDegreeCourses, fetchOLCareerTree } from "../api/DegreeAPI";
import { fetchAcademicProfile } from "../api/academicApi";
import olSubjectsConfig from "../config/ol_subjects_config.json";
import LoadingState, { OL_STAGES } from "../components/LoadingState";

const ArrowRightIcon = () => (
	<svg className='w-4 h-4' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
		<path strokeLinecap='round' strokeLinejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' />
	</svg>
);

const BookIcon = () => (
	<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25'
		/>
	</svg>
);

const SpinnerIcon = () => (
	<svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24'>
		<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
		<path
			className='opacity-75'
			fill='currentColor'
			d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
	</svg>
);

const AlertIcon = () => (
	<svg className='w-5 h-5 mt-0.5 shrink-0' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
		/>
	</svg>
);

const CAREER_INTEREST_PROMPTS = [
	"I love working with technology and solving complex problems",
	"I'm passionate about business, entrepreneurship, and managing people",
	"I want to make a positive impact in healthcare and science",
	"I'm interested in creative fields like design, art, and media",
	"I love teaching and helping others learn",
	"I'm fascinated by law, justice, and policy",
	"I want to work in finance, accounting, or economics",
];

export default function OLExplorerFlow() {
	const navigate = useNavigate();
	const currentUser = useSelector((state) => state.user?.currentUser);
	const isLoggedIn = Boolean(currentUser);

	const [interests, setInterests] = useState("");
	const [olMarks, setOlMarks] = useState({
		core: {
			religion: "",
			first_language: "",
			mathematics: "",
			science: "",
			english: "",
			history: "",
			bucket_1_grade: "",
			bucket_2_grade: "",
			bucket_3_grade: "",
		},
		bucket_1: "",
		bucket_2: "",
		bucket_3: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [autofilled, setAutofilled] = useState(false);
	const detailsRef = useRef(null); // ref to auto-open accordion

	// ── Autofill from saved profile ──────────────────────────────────────────
	useEffect(() => {
		if (!isLoggedIn) return;

		const loadSavedSubjects = async () => {
			try {
				const res = await fetchAcademicProfile();
				const ol = res.data?.olSubjects;
				const al = res.data?.alSubjects;

				// Pre-fill interests from saved AL profile if present
				if (al?.interests) {
					setInterests(al.interests);
				}

				if (!ol) return;

				// Check if there's any saved data to autofill
				const hasCore = Object.values(ol.core || {}).some((v) => v && v !== "");
				const hasBuckets = ol.bucket_1 || ol.bucket_2 || ol.bucket_3;
				if (!hasCore && !hasBuckets) return;

				setOlMarks({
					core: {
						religion: ol.core?.religion || "",
						first_language: ol.core?.first_language || "",
						mathematics: ol.core?.mathematics || "",
						science: ol.core?.science || "",
						english: ol.core?.english || "",
						history: ol.core?.history || "",
						bucket_1_grade: ol.core?.bucket_1_grade || "",
						bucket_2_grade: ol.core?.bucket_2_grade || "",
						bucket_3_grade: ol.core?.bucket_3_grade || "",
					},
					bucket_1: ol.bucket_1 || "",
					bucket_2: ol.bucket_2 || "",
					bucket_3: ol.bucket_3 || "",
				});
				setAutofilled(true);

				// Auto-open the O/L marks accordion so the user sees their pre-filled data
				if (detailsRef.current) {
					detailsRef.current.open = true;
				}
			} catch (_) {
				// Silently fail — autofill is a convenience, not critical
			}
		};

		loadSavedSubjects();
	}, [isLoggedIn]);

	const isFormValid = interests.trim().length >= 10;

	const handleSubmit = async () => {
		if (!isFormValid) return;

		setLoading(true);
		setError("");

		try {
			// Get all degree courses
			const coursesResponse = await fetchAllDegreeCourses();
			const courseCodes = coursesResponse.courses.map((c) => c.course_code || c.code);

			// Call career tree API with O/L marks
			const treeData = await fetchOLCareerTree({
				studentInput: interests,
				eligibleCourseCodes: courseCodes,
				olMarks: olMarks,
			});

			// Navigate to the dedicated results page, passing data via location state
			navigate("/degree-recommendations/ol-results", {
				state: { results: treeData, interests, olMarks },
			});
		} catch (err) {
			let errorMessage = "Failed to generate recommendations. Please try again.";

			if (err?.response?.data?.detail) {
				const detail = err.response.data.detail;
				if (Array.isArray(detail)) {
					errorMessage = detail.map((e) => e.msg || JSON.stringify(e)).join("; ");
				} else if (typeof detail === "string") {
					errorMessage = detail;
				} else if (detail.msg) {
					errorMessage = detail.msg;
				}
			}

			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const GraduationIcon = () => (
		<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5'
			/>
		</svg>
	);

	// Input Step — results navigate to OLResultsPage
	return (
		<div className='min-h-screen pb-20 bg-slate-50'>
			{/* Header */}
			<div className='relative pt-24 pb-32 overflow-hidden border-b border-teal-800/50 bg-gradient-to-br from-teal-700 via-emerald-600 to-teal-600'>
				{/* Ambient Blobs */}
				<div className='absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />
				<div className='absolute bottom-0 left-10 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen' />

				<div className='relative z-10 max-w-6xl px-6 mx-auto'>
					<div className='inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase rounded-full bg-white/10 text-emerald-50 border border-emerald-400/40'>
						<GraduationIcon />
						<span>O/L Stream & Degree Explorer</span>
					</div>
					<div className='grid items-center grid-cols-1 gap-12 md:grid-cols-2'>
						<div>
							<div className='flex items-center gap-4'>
								<h1 className='text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
									Discover Your <br />
									<span className='text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-cyan-300'>
										Ideal A/L Stream
									</span>
								</h1>
							</div>
							<p className='max-w-lg mt-2 text-lg leading-relaxed text-emerald-50/90'>
								Tell us your interests, and we'll suggest the best A/L streams, matching university degrees, and
								potential career directions to help you decide.
							</p>
						</div>
						<div className='relative hidden md:block'>
							<img
								src='/images/feature-career1.png'
								alt='A/L Stream Explorer'
								className='relative z-10 object-cover w-full h-56 border shadow-2xl rounded-3xl aspect-video border-white/10'
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='relative z-20 max-w-6xl px-6 mx-auto -mt-20'>
				<div className='p-8 bg-white border shadow-2xl sm:p-12 border-slate-200/60 rounded-3xl'>
					{loading ?
						<LoadingState theme='emerald' stages={OL_STAGES} title='Finding Your A/L Streams' />
					:	<>
							<div className='mb-10'>
								<h2 className='flex items-center gap-3 mb-3 text-3xl font-extrabold text-slate-900'>
									What are you passionate about?
								</h2>
								<p className='text-lg text-slate-500'>
									Share your interests, dreams, and hobbies. We'll suggest matching A/L streams, aligned degrees, and
									potential career directions.
								</p>
							</div>

							{/* Main Textarea */}
							<div className='mb-8'>
								<label className='block mb-2 text-sm font-semibold text-slate-700'>
									Your Interests & Goals <span className='text-red-500'>*</span>
								</label>
								<textarea
									placeholder={CAREER_INTEREST_PROMPTS[Math.floor(Math.random() * CAREER_INTEREST_PROMPTS.length)]}
									value={interests}
									onChange={(e) => setInterests(e.target.value)}
									className='w-full px-4 py-4 text-base transition-colors border shadow-inner resize-none bg-slate-50 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none'
									rows='3'
								/>
								<div className='flex items-center justify-between mt-2 text-sm'>
									<p className={interests.length >= 10 ? "text-emerald-600 font-medium" : "text-slate-400"}>
										{interests.length} / 10 characters minimum
									</p>
								</div>
							</div>

							{/* Optional O/L Marks */}
							<div className='mb-8'>
								<div className='flex items-center gap-2 mb-2'>
									<p className='text-sm font-medium text-slate-500'>Want more accurate predictions? (Optional)</p>
									{autofilled && (
										<span className='inline-flex shrink-0 -mt-4 items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200'>
											<svg className='w-3 h-3' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'>
												<path strokeLinecap='round' strokeLinejoin='round' d='M4.5 12.75l6 6 9-13.5' />
											</svg>
											Autofilled from profile
										</span>
									)}
								</div>
								<details ref={detailsRef} className='mb-2 overflow-hidden transition-all border group border-slate-200 rounded-2xl bg-slate-50 hover:border-emerald-200'>
									<summary className='flex items-center gap-3 px-3 py-4 font-semibold cursor-pointer select-none text-slate-700 hover:text-slate-900'>
										<div className='flex items-center justify-center w-8 rounded-lg bg-emerald-100 text-emerald-600'>
											<BookIcon />
										</div>
										Add Your O/L Marks
										<span className='ml-auto text-sm font-normal text-emerald-600 group-open:hidden'>Expand</span>
										<span className='hidden ml-auto text-sm font-normal text-slate-500 group-open:block'>Collapse</span>
									</summary>

									<div className='p-6 pt-0 border-t border-slate-200'>
										{/* Core Subjects */}
										<div className='mt-6 mb-8'>
											<h3 className='mb-4 text-sm font-semibold tracking-wide uppercase text-slate-500'>
												Compulsory Subjects
											</h3>
											<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
												{olSubjectsConfig.core_subjects.map((subject) => (
													<div key={subject.id}>
														<label className='block mb-1.5 text-xs font-semibold text-slate-700'>
															{subject.name}
															{subject.critical && <span className='ml-1 text-red-500'>*</span>}
														</label>
														<select
															value={olMarks.core[subject.id] || ""}
															onChange={(e) =>
																setOlMarks({
																	...olMarks,
																	core: { ...olMarks.core, [subject.id]: e.target.value },
																})
															}
															className='w-full px-3 py-2 text-sm bg-white border rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none'>
															<option value=''>Select Grade</option>
															{olSubjectsConfig.grading_scale.map((grade) => (
																<option key={grade} value={grade}>
																	{grade} ({olSubjectsConfig.grade_descriptions[grade]})
																</option>
															))}
														</select>
													</div>
												))}
											</div>
										</div>

										<div className='w-full h-px mb-6 bg-slate-200'></div>

										{/* Basket Subjects */}
										<div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
											{/* Bucket 1 */}
											<div>
												<h3 className='mb-1 text-sm font-semibold text-slate-700'>{olSubjectsConfig.bucket_1.name}</h3>
												<p className='mb-3 text-xs text-slate-500 line-clamp-1'>{olSubjectsConfig.bucket_1.category}</p>
												<select
													value={olMarks.bucket_1 || ""}
													onChange={(e) => setOlMarks({ ...olMarks, bucket_1: e.target.value })}
													className='w-full px-3 py-2 text-sm bg-white border rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none'>
													<option value=''>Select subject...</option>
													{olSubjectsConfig.bucket_1.subjects.map((subject) => (
														<option key={subject.id} value={subject.id}>
															{subject.name}
														</option>
													))}
												</select>
												{olMarks.bucket_1 && (
													<select
														value={olMarks.core.bucket_1_grade || ""}
														onChange={(e) =>
															setOlMarks({
																...olMarks,
																core: { ...olMarks.core, bucket_1_grade: e.target.value },
															})
														}
														className='w-full px-3 py-2 mt-2 text-sm bg-white border rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none'>
														<option value=''>Grade</option>
														{olSubjectsConfig.grading_scale.map((grade) => (
															<option key={grade} value={grade}>
																{grade}
															</option>
														))}
													</select>
												)}
											</div>

											{/* Bucket 2 */}
											<div>
												<h3 className='mb-1 text-sm font-semibold text-slate-700'>{olSubjectsConfig.bucket_2.name}</h3>
												<p className='mb-3 text-xs text-slate-500 line-clamp-1'>{olSubjectsConfig.bucket_2.category}</p>
												<select
													value={olMarks.bucket_2 || ""}
													onChange={(e) => setOlMarks({ ...olMarks, bucket_2: e.target.value })}
													className='w-full px-3 py-2 text-sm bg-white border rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none'>
													<option value=''>Select subject...</option>
													{olSubjectsConfig.bucket_2.subjects.map((subject) => (
														<option key={subject.id} value={subject.id}>
															{subject.name}
														</option>
													))}
												</select>
												{olMarks.bucket_2 && (
													<select
														value={olMarks.core.bucket_2_grade || ""}
														onChange={(e) =>
															setOlMarks({
																...olMarks,
																core: { ...olMarks.core, bucket_2_grade: e.target.value },
															})
														}
														className='w-full px-3 py-2 mt-2 text-sm bg-white border rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none'>
														<option value=''>Grade</option>
														{olSubjectsConfig.grading_scale.map((grade) => (
															<option key={grade} value={grade}>
																{grade}
															</option>
														))}
													</select>
												)}
											</div>

											{/* Bucket 3 */}
											<div>
												<h3 className='mb-1 text-sm font-semibold text-slate-700'>{olSubjectsConfig.bucket_3.name}</h3>
												<p className='mb-3 text-xs text-slate-500 line-clamp-1'>{olSubjectsConfig.bucket_3.category}</p>
												<select
													value={olMarks.bucket_3 || ""}
													onChange={(e) => setOlMarks({ ...olMarks, bucket_3: e.target.value })}
													className='w-full px-3 py-2 text-sm bg-white border rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none'>
													<option value=''>Select subject...</option>
													{olSubjectsConfig.bucket_3.subjects.map((subject) => (
														<option key={subject.id} value={subject.id}>
															{subject.name}
														</option>
													))}
												</select>
												{olMarks.bucket_3 && (
													<select
														value={olMarks.core.bucket_3_grade || ""}
														onChange={(e) =>
															setOlMarks({
																...olMarks,
																core: { ...olMarks.core, bucket_3_grade: e.target.value },
															})
														}
														className='w-full px-3 py-2 mt-2 text-sm bg-white border rounded-lg border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none'>
														<option value=''>Grade</option>
														{olSubjectsConfig.grading_scale.map((grade) => (
															<option key={grade} value={grade}>
																{grade}
															</option>
														))}
													</select>
												)}
											</div>
										</div>
									</div>
								</details>
							</div>

							{/* Primary Action Button placed right after required fields */}
							<div className='flex justify-end mb-2 border-b border-slate-100'>
								<button
									onClick={handleSubmit}
									disabled={!isFormValid || loading}
									className={`
									inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300
									${
										isFormValid && !loading ?
											"bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-xl hover:-translate-y-0.5 cursor-pointer shadow-emerald-500/25"
										:	"bg-slate-100 text-slate-400 cursor-not-allowed"
									}
								`}>
									{loading ?
										<>
											<SpinnerIcon /> Finding Streams & Degrees...
										</>
									:	<>
											Find My A/L Streams & Degrees <ArrowRightIcon />
										</>
									}
								</button>
							</div>

							{error && (
								<div className='flex gap-3 p-4 mt-6 text-red-700 border rounded-xl bg-red-50 border-red-200/60'>
									<AlertIcon />
									<div>
										<p className='font-semibold'>Error</p>
										<p className='text-sm'>{error}</p>
									</div>
								</div>
							)}
						</>
					}
				</div>
			</div>
		</div>
	);
}
