import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { saveOLSubjects, saveALSubjects } from "../api/academicApi";
import olSubjectsConfig from "../config/ol_subjects_config.json";
import { AL_STREAMS } from "../constants/degreeConstants";
import {
	GraduationIcon,
	ArrowRightIcon,
	ArrowLeftIcon,
	SpinnerIcon,
	CheckCircleIcon,
	BookIcon,
} from "../components/ui/Icons";
import Reveal from "../components/ui/Reveal";

const GRADES = ["A", "B", "C", "S", "W"];

const STEPS = [
	{ label: "Welcome", icon: "👋" },
	{ label: "O/L Results", icon: "📋" },
	{ label: "A/L Details", icon: "🎓" },
	{ label: "Done", icon: "✅" },
];

export default function OnboardingPage() {
	const navigate = useNavigate();
	const currentUser = useSelector((state) => state.user?.currentUser);

	const [step, setStep] = useState(0);
	const [studentLevel, setStudentLevel] = useState(""); // "ol" | "al"
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	// OL state
	const [olCore, setOlCore] = useState({});
	const [bucket1, setBucket1] = useState("");
	const [bucket2, setBucket2] = useState("");
	const [bucket3, setBucket3] = useState("");

	// AL state
	const [alStream, setAlStream] = useState("");
	const [alSubjects, setAlSubjects] = useState(["", "", ""]);

	if (!currentUser) {
		navigate("/signin");
		return null;
	}

	// ── Handlers ────────────────────────────────────────────────────────────────
	const handleSaveOL = async () => {
		setSaving(true);
		setError("");
		try {
			await saveOLSubjects({ core: olCore, bucket_1: bucket1, bucket_2: bucket2, bucket_3: bucket3 });
			setStep(studentLevel === "al" ? 2 : 3);
		} catch (err) {
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const handleSaveAL = async () => {
		setSaving(true);
		setError("");
		try {
			await saveALSubjects({
				stream: alStream,
				subjects: alSubjects.filter((s) => s.trim() !== ""),
			});
			setStep(3);
		} catch (err) {
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const selectedStreamObj = AL_STREAMS.find((s) => s.name === alStream);

	// ── Step Content ────────────────────────────────────────────────────────────
	const renderStep = () => {
		// ── Step 0: Welcome ──────────────────────────────────────────────────
		if (step === 0) {
			return (
				<Reveal delay={0.1}>
					<div className='text-center'>
						<div className='flex items-center justify-center w-20 h-20 mx-auto mb-6 text-4xl rounded-full bg-gradient-to-br from-indigo-100 to-blue-100'>
							👋
						</div>
						<h2 className='mb-3 text-3xl font-extrabold tracking-tight text-slate-900'>
							Welcome, {currentUser.name?.split(" ")[0] || "Student"}!
						</h2>
						<p className='max-w-md mx-auto mb-10 text-lg leading-relaxed text-slate-500'>
							Let's set up your academic profile. This helps us give you personalized degree recommendations.
						</p>

						<p className='mb-4 text-sm font-bold tracking-wider uppercase text-slate-400'>What stage are you at?</p>

						<div className='grid max-w-lg grid-cols-1 gap-4 mx-auto sm:grid-cols-2'>
							{/* O/L Student */}
							<button
								type='button'
								onClick={() => {
									setStudentLevel("ol");
									setStep(1);
								}}
								className={`
									group relative p-6 text-left border-2 rounded-2xl transition-all duration-300
									hover:shadow-xl hover:-translate-y-1
									border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50
									hover:border-emerald-400
								`}>
								<div className='flex items-center gap-3 mb-3'>
									<div className='flex items-center justify-center w-10 h-10 text-xl rounded-xl bg-emerald-100'>📗</div>
									<span className='text-lg font-bold text-emerald-800'>O/L Student</span>
								</div>
								<p className='text-sm leading-relaxed text-emerald-700/70'>
									I've completed or am studying for my O/L exams and exploring A/L streams.
								</p>
								<div className='absolute transition-opacity opacity-0 right-4 top-4 group-hover:opacity-100'>
									<ArrowRightIcon className='w-5 h-5 text-emerald-500' />
								</div>
							</button>

							{/* A/L Student */}
							<button
								type='button'
								onClick={() => {
									setStudentLevel("al");
									setStep(1);
								}}
								className={`
									group relative p-6 text-left border-2 rounded-2xl transition-all duration-300
									hover:shadow-xl hover:-translate-y-1
									border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50
									hover:border-blue-400
								`}>
								<div className='flex items-center gap-3 mb-3'>
									<div className='flex items-center justify-center w-10 h-10 text-xl bg-blue-100 rounded-xl'>📘</div>
									<span className='text-lg font-bold text-blue-800'>A/L Student</span>
								</div>
								<p className='text-sm leading-relaxed text-blue-700/70'>
									I've selected my A/L stream and subjects and want to find matching degrees.
								</p>
								<div className='absolute transition-opacity opacity-0 right-4 top-4 group-hover:opacity-100'>
									<ArrowRightIcon className='w-5 h-5 text-blue-500' />
								</div>
							</button>
						</div>

						<button
							onClick={() => navigate("/")}
							className='mt-8 text-sm font-medium transition-colors text-slate-400 hover:text-slate-600'>
							Skip for now →
						</button>
					</div>
				</Reveal>
			);
		}

		// ── Step 1: O/L Results ──────────────────────────────────────────────
		if (step === 1) {
			return (
				<Reveal delay={0.1}>
					<div>
						<div className='flex items-center gap-3 mb-2'>
							<div className='flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700'>
								<BookIcon className='w-5 h-5' />
							</div>
							<div>
								<h2 className='text-2xl font-extrabold text-slate-900'>Your O/L Results</h2>
								<p className='text-sm text-slate-500'>
									{studentLevel === "al" ?
										"Enter your O/L marks first, then we'll set up your A/L details."
									:	"Enter your O/L subjects and grades."}
								</p>
							</div>
						</div>

						{/* Core Subjects */}
						<div className='mt-6 mb-6'>
							<p className='mb-3 text-xs font-bold tracking-wider uppercase text-slate-400'>Core Subjects</p>
							<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'>
								{olSubjectsConfig.core_subjects.map((subject) => (
									<div
										key={subject.id}
										className='flex items-center justify-between gap-3 p-3 border rounded-xl bg-slate-50/80 border-slate-200/80'>
										<span className='text-sm font-medium text-slate-700'>{subject.name}</span>
										<select
											value={olCore[subject.id] || ""}
											onChange={(e) => setOlCore({ ...olCore, [subject.id]: e.target.value })}
											className='px-3 py-1.5 text-xs font-semibold bg-white border rounded-lg border-slate-200 text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none min-w-[80px]'>
											<option value=''>Grade</option>
											{GRADES.map((g) => (
												<option key={g} value={g}>
													{g}
												</option>
											))}
										</select>
									</div>
								))}
							</div>
						</div>

						{/* Optional Subjects */}
						<div className='mb-6'>
							<p className='mb-3 text-xs font-bold tracking-wider uppercase text-slate-400'>
								Optional Subjects (Baskets)
							</p>
							<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
								{[
									{
										key: "bucket_1",
										label: "Basket I",
										config: olSubjectsConfig.bucket_1,
										value: bucket1,
										setValue: setBucket1,
									},
									{
										key: "bucket_2",
										label: "Basket II",
										config: olSubjectsConfig.bucket_2,
										value: bucket2,
										setValue: setBucket2,
									},
									{
										key: "bucket_3",
										label: "Basket III",
										config: olSubjectsConfig.bucket_3,
										value: bucket3,
										setValue: setBucket3,
									},
								].map(({ key, label, config, value, setValue }) => (
									<div key={key} className='p-4 border rounded-xl bg-slate-50/80 border-slate-200/80'>
										<p className='mb-1 text-xs font-bold text-slate-500'>{label}</p>
										<p className='mb-2 text-[10px] text-slate-400'>{config.name}</p>
										<select
											value={value}
											onChange={(e) => setValue(e.target.value)}
											className='w-full px-3 py-2 mb-2 text-xs bg-white border rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'>
											<option value=''>Select subject...</option>
											{config.subjects.map((s) => (
												<option key={s.id} value={s.id}>
													{s.name}
												</option>
											))}
										</select>
										{value && (
											<select
												value={olCore[`${key}_grade`] || ""}
												onChange={(e) => setOlCore({ ...olCore, [`${key}_grade`]: e.target.value })}
												className='w-full px-3 py-2 text-xs bg-white border rounded-lg border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'>
												<option value=''>Grade</option>
												{GRADES.map((g) => (
													<option key={g} value={g}>
														{g}
													</option>
												))}
											</select>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Actions */}
						<div className='flex items-center justify-between pt-4 border-t border-slate-100'>
							<button
								onClick={() => setStep(0)}
								className='inline-flex items-center gap-2 text-sm font-semibold transition-colors text-slate-500 hover:text-slate-700'>
								<ArrowLeftIcon className='w-4 h-4' /> Back
							</button>
							<div className='flex gap-3'>
								<button
									onClick={() => setStep(studentLevel === "al" ? 2 : 3)}
									className='px-5 py-2.5 text-sm font-semibold rounded-xl text-slate-400 bg-slate-100 hover:bg-slate-200 transition-colors'>
									Skip
								</button>
								<button
									onClick={handleSaveOL}
									disabled={saving}
									className={`
										inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300
										${saving ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 hover:shadow-xl"}
									`}>
									{saving ?
										<>
											<SpinnerIcon className='w-4 h-4 animate-spin' /> Saving...
										</>
									:	<>
											Save & Continue <ArrowRightIcon className='w-4 h-4' />
										</>
									}
								</button>
							</div>
						</div>
					</div>
				</Reveal>
			);
		}

		// ── Step 2: A/L Details ──────────────────────────────────────────────
		if (step === 2) {
			return (
				<Reveal delay={0.1}>
					<div>
						<div className='flex items-center gap-3 mb-6'>
							<div className='flex items-center justify-center w-10 h-10 text-blue-700 bg-blue-100 rounded-xl'>
								<GraduationIcon className='w-5 h-5' />
							</div>
							<div>
								<h2 className='text-2xl font-extrabold text-slate-900'>Your A/L Details</h2>
								<p className='text-sm text-slate-500'>Select your stream and subjects.</p>
							</div>
						</div>

						{/* Stream Selection */}
						<div className='mb-6'>
							<p className='mb-3 text-xs font-bold tracking-wider uppercase text-slate-400'>A/L Stream</p>
							<div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
								{AL_STREAMS.map((s) => (
									<button
										key={s.id}
										type='button'
										onClick={() => {
											setAlStream(s.name);
											setAlSubjects(["", "", ""]);
										}}
										className={`
											p-3 text-left border-2 rounded-xl transition-all duration-200 text-sm
											${
												alStream === s.name ?
													"border-blue-500 bg-blue-50 shadow-md"
												:	"border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
											}
										`}>
										<p className={`font-bold ${alStream === s.name ? "text-blue-700" : "text-slate-700"}`}>{s.name}</p>
										<p className='mt-0.5 text-[10px] text-slate-400 leading-tight'>{s.tagline}</p>
									</button>
								))}
							</div>
						</div>

						{/* Subject Selection */}
						{alStream && (
							<div className='mb-6'>
								<p className='mb-3 text-xs font-bold tracking-wider uppercase text-slate-400'>
									Subjects <span className='font-normal normal-case text-slate-300'>(select 3)</span>
								</p>
								<div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
									{[0, 1, 2].map((idx) => (
										<div key={idx} className='p-3 border rounded-xl bg-slate-50/80 border-slate-200/80'>
											<p className='mb-1.5 text-xs font-bold text-slate-500'>Subject {idx + 1}</p>
											<select
												value={alSubjects[idx]}
												onChange={(e) => {
													const newSubjects = [...alSubjects];
													newSubjects[idx] = e.target.value;
													setAlSubjects(newSubjects);
												}}
												className='w-full px-3 py-2 text-sm bg-white border rounded-lg border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none'>
												<option value=''>Select subject...</option>
												{selectedStreamObj?.availableSubjects
													.filter((subj) => !alSubjects.includes(subj) || alSubjects[idx] === subj)
													.map((subj) => (
														<option key={subj} value={subj}>
															{subj}
														</option>
													))}
											</select>
										</div>
									))}
								</div>
							</div>
						)}

						{/* Actions */}
						<div className='flex items-center justify-between pt-4 border-t border-slate-100'>
							<button
								onClick={() => setStep(1)}
								className='inline-flex items-center gap-2 text-sm font-semibold transition-colors text-slate-500 hover:text-slate-700'>
								<ArrowLeftIcon className='w-4 h-4' /> Back
							</button>
							<div className='flex gap-3'>
								<button
									onClick={() => setStep(3)}
									className='px-5 py-2.5 text-sm font-semibold rounded-xl text-slate-400 bg-slate-100 hover:bg-slate-200 transition-colors'>
									Skip
								</button>
								<button
									onClick={handleSaveAL}
									disabled={saving || !alStream}
									className={`
										inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300
										${saving || !alStream ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-xl"}
									`}>
									{saving ?
										<>
											<SpinnerIcon className='w-4 h-4 animate-spin' /> Saving...
										</>
									:	<>
											Save & Finish <ArrowRightIcon className='w-4 h-4' />
										</>
									}
								</button>
							</div>
						</div>
					</div>
				</Reveal>
			);
		}

		// ── Step 3: Done ─────────────────────────────────────────────────────
		if (step === 3) {
			return (
				<Reveal delay={0.1}>
					<div className='py-8 text-center'>
						<div className='flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100'>
							<CheckCircleIcon className='w-10 h-10 text-emerald-500' />
						</div>
						<h2 className='mb-3 text-3xl font-extrabold tracking-tight text-slate-900'>You're All Set!</h2>
						<p className='max-w-md mx-auto mb-8 text-lg leading-relaxed text-slate-500'>
							Your academic profile is saved. You can always update it from your profile page.
						</p>

						<div className='flex flex-col items-center gap-3 sm:flex-row sm:justify-center'>
							<button
								onClick={() =>
									navigate(
										studentLevel === "al" ?
											"/degree-recommendations/al-students"
										:	"/degree-recommendations/all-students",
									)
								}
								className='inline-flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white transition-all rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-xl'>
								<GraduationIcon className='w-5 h-5' />
								Find My Degrees
							</button>
							<button
								onClick={() => navigate("/")}
								className='inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-colors border rounded-xl text-slate-600 border-slate-200 bg-white hover:bg-slate-50'>
								Go to Home
							</button>
						</div>
					</div>
				</Reveal>
			);
		}
	};

	// ── Main Render ──────────────────────────────────────────────────────────
	return (
		<div className='flex items-start justify-center min-h-screen px-4 pt-24 pb-12 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/60'>
			{/* Ambient orbs */}
			<div className='absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-300/10 rounded-full blur-[140px] pointer-events-none' />
			<div className='absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[120px] pointer-events-none' />

			<div className='relative z-10 w-full max-w-3xl mx-auto'>
				{/* Progress indicator */}
				{step > 0 && step < 3 && (
					<Reveal delay={0}>
						<div className='flex items-center justify-center gap-2 mb-8'>
							{STEPS.map((s, i) => (
								<React.Fragment key={i}>
									<div
										className={`
										flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300
										${
											i < step ? "bg-emerald-100 text-emerald-700"
											: i === step ? "bg-indigo-100 text-indigo-700 shadow-sm"
											: "bg-slate-100 text-slate-400"
										}
									`}>
										<span>{s.icon}</span>
										<span className='hidden sm:inline'>{s.label}</span>
									</div>
									{i < STEPS.length - 1 && (
										<div
											className={`w-8 h-0.5 rounded-full transition-colors ${i < step ? "bg-emerald-300" : "bg-slate-200"}`}
										/>
									)}
								</React.Fragment>
							))}
						</div>
					</Reveal>
				)}

				{/* Card */}
				<div className='p-8 bg-white border shadow-xl sm:p-10 border-slate-200/60 rounded-3xl'>
					{error && (
						<div className='flex items-center gap-3 p-4 mb-6 border rounded-xl bg-red-50 border-red-200/60'>
							<span className='text-sm font-medium text-red-700'>{error}</span>
						</div>
					)}
					{renderStep()}
				</div>
			</div>
		</div>
	);
}
