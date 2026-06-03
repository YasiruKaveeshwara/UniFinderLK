import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { saveOLSubjects, saveALSubjects } from "../api/academicApi";
import olSubjectsConfig from "../config/ol_subjects_config.json";
import { AL_STREAMS, SRI_LANKA_DISTRICTS, INTEREST_SUGGESTIONS } from "../constants/degreeConstants";
import ProgressStepper from "../components/ProgressStepper";
import Reveal from "../components/ui/Reveal";
import {
	GraduationIcon,
	ArrowRightIcon,
	ArrowLeftIcon,
	SpinnerIcon,
	CheckCircleIcon,
	BookIcon,
	ChartBarIcon,
	LightbulbIcon,
	PhysicalScienceIcon,
	BiologicalScienceIcon,
	CommerceStreamIcon,
	EngineeringTechIcon,
	BioSystemsTechIcon,
	ArtsStreamIcon,
} from "../components/ui/Icons";

// ── Constants ─────────────────────────────────────────────────────────────────
const GRADES = ["A", "B", "C", "S", "W"];

const STEP_LABELS = ["Welcome", "O/L Results", "A/L Details", "Your Profile", "Complete"];

// ── A/L Stream icon map ───────────────────────────────────────────────────────
const STREAM_ICONS = {
	"physical-science": {
		bg: "bg-sky-100",
		activeBg: "bg-sky-200",
		icon: <PhysicalScienceIcon className='w-4.5 h-4.5 text-sky-600' />,
	},
	"biological-science": {
		bg: "bg-emerald-100",
		activeBg: "bg-emerald-200",
		icon: <BiologicalScienceIcon className='w-4.5 h-4.5 text-emerald-600' />,
	},
	commerce: {
		bg: "bg-blue-100",
		activeBg: "bg-blue-200",
		icon: <CommerceStreamIcon className='w-4.5 h-4.5 text-blue-600' />,
	},
	"engineering-technology": {
		bg: "bg-orange-100",
		activeBg: "bg-orange-200",
		icon: <EngineeringTechIcon className='w-4.5 h-4.5 text-orange-600' />,
	},
	"bio-systems-technology": {
		bg: "bg-teal-100",
		activeBg: "bg-teal-200",
		icon: <BioSystemsTechIcon className='w-4.5 h-4.5 text-teal-600' />,
	},
	arts: {
		bg: "bg-violet-100",
		activeBg: "bg-violet-200",
		icon: <ArtsStreamIcon className='w-4.5 h-4.5 text-violet-600' />,
	},
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SubLabel({ children }) {
	return <p className='mb-3 text-xs font-bold tracking-widest uppercase text-slate-400'>{children}</p>;
}

function NavRow({ onBack, onSkip, onNext, nextLabel = "Next", saving = false, nextDisabled = false }) {
	return (
		<div className='flex items-center justify-between gap-4 pt-6 mt-8 border-t border-slate-100'>
			<button
				type='button'
				onClick={onBack}
				className='inline-flex items-center gap-2 px-5 py-2.5 font-semibold text-slate-600 transition-colors bg-white border-2 rounded-xl border-slate-200 hover:bg-slate-50'>
				<ArrowLeftIcon className='w-4 h-4' /> Back
			</button>
			<div className='flex gap-3'>
				{onSkip && (
					<button
						type='button'
						onClick={onSkip}
						className='px-5 py-2.5 font-semibold text-slate-500 transition-colors rounded-xl bg-slate-100 hover:bg-slate-200'>
						Skip
					</button>
				)}
				<button
					type='button'
					onClick={onNext}
					disabled={nextDisabled || saving}
					className={`
						inline-flex items-center gap-2 px-7 py-2.5 rounded-xl font-semibold transition-all duration-300
						${
							!nextDisabled && !saving ?
								"bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5 shadow-blue-500/25 cursor-pointer"
							:	"bg-slate-100 text-slate-400 cursor-not-allowed"
						}
					`}>
					{saving ?
						<>
							<SpinnerIcon className='w-4 h-4 animate-spin' /> Saving...
						</>
					:	<>
							{nextLabel} <ArrowRightIcon className='w-4 h-4' />
						</>
					}
				</button>
			</div>
		</div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
export default function OnboardingPage() {
	const navigate = useNavigate();
	const currentUser = useSelector((state) => state.user?.currentUser);

	const [step, setStep] = useState(0);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	// O/L state
	const [olCore, setOlCore] = useState({});
	const [bucket1, setBucket1] = useState("");
	const [bucket2, setBucket2] = useState("");
	const [bucket3, setBucket3] = useState("");

	// A/L state
	const [alStream, setAlStream] = useState("");
	const [alSubjects, setAlSubjects] = useState(["", "", ""]);

	// Profile state
	const [district, setDistrict] = useState("");
	const [zscore, setZscore] = useState("");
	const [interests, setInterests] = useState("");
	const [selectedInterests, setSelectedInterests] = useState([]);
	const [customInterests, setCustomInterests] = useState([]);
	const [customInterestInput, setCustomInterestInput] = useState("");

	if (!currentUser) {
		navigate("/signin");
		return null;
	}

	const firstName = currentUser.name?.split(" ")[0] || "Student";
	const selectedStreamObj = AL_STREAMS.find((s) => s.name === alStream);

	const toggleInterest = (tag) =>
		setSelectedInterests((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

	const handleAddCustomInterest = () => {
		const val = customInterestInput.trim();
		if (val && !customInterests.includes(val) && !INTEREST_SUGGESTIONS.includes(val)) {
			setCustomInterests((p) => [...p, val]);
		}
		setCustomInterestInput("");
	};

	// ── API calls ─────────────────────────────────────────────────────────────
	const doSaveOL = async () => {
		setSaving(true);
		setError("");
		try {
			await saveOLSubjects({ core: olCore, bucket_1: bucket1, bucket_2: bucket2, bucket_3: bucket3 });
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setSaving(false);
		}
	};

	const doSaveALAndProfile = async () => {
		setSaving(true);
		setError("");
		try {
			const combinedInterests = [
				...selectedInterests,
				...customInterests,
				...(interests.trim() ? [interests.trim()] : []),
			].join(", ");
			await saveALSubjects({
				stream: alStream || undefined,
				subjects: alSubjects.filter((s) => s.trim() !== ""),
				district: district || undefined,
				zscore: zscore !== "" ? parseFloat(zscore) : undefined,
				interests: combinedInterests || undefined,
			});
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setSaving(false);
		}
	};

	// ── Navigation ────────────────────────────────────────────────────────────
	const goNext = () => {
		setError("");
		setStep((s) => s + 1);
	};

	const goBack = () => {
		setError("");
		setStep((s) => Math.max(s - 1, 0));
	};

	const handleOLSave = async () => {
		try {
			await doSaveOL();
			goNext();
		} catch (_) {}
	};

	const handleProfileSave = async () => {
		try {
			await doSaveALAndProfile();
			goNext();
		} catch (_) {}
	};

	// ══════════════════════════════════════════════════════════════════════════
	// STEP 0 — Welcome
	// ══════════════════════════════════════════════════════════════════════════
	const renderWelcome = () => (
		<Reveal delay={0.05}>
			<div className='py-4'>
				{/* Header */}
				<div className='flex items-center gap-4 mb-8'>
					<div className='flex items-center justify-center flex-shrink-0 w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/30'>
						<GraduationIcon className='w-6 h-6 text-white' />
					</div>
					<div>
						<h2 className='text-2xl font-extrabold tracking-tight text-slate-900'>Welcome, {firstName}</h2>
						<p className='text-sm text-slate-500'>Set up your academic profile in about 2 minutes.</p>
					</div>
				</div>

				{/* Steps overview */}
				<div className='grid grid-cols-1 gap-3 mb-6 sm:grid-cols-3'>
					{[
						{
							icon: <BookIcon className='w-8 h-8' />,
							label: "O/L Results",
							desc: "Enter your Ordinary Level grades",
							color: "text-blue-600 bg-blue-50 border-blue-100",
						},
						{
							icon: <GraduationIcon className='w-8 h-8' />,
							label: "A/L Details",
							desc: "Select your stream and subjects",
							color: "text-indigo-600 bg-indigo-50 border-indigo-100",
						},
						{
							icon: <ChartBarIcon className='w-8 h-8' />,
							label: "Your Profile",
							desc: "District, Z-score and interests",
							color: "text-blue-700 bg-blue-50 border-blue-100",
						},
					].map(({ icon, label, desc, color }) => (
						<div
							key={label}
							className='flex items-center gap-3 px-4 py-2.5 border rounded-xl border-slate-200 bg-slate-50'>
							<div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg border ${color}`}>
								{icon}
							</div>
							<div>
								<p className='text-sm font-semibold leading-tight text-slate-700'>{label}</p>
								<p className='mt-0.5 text-xs leading-tight text-slate-400'>{desc}</p>
							</div>
						</div>
					))}
				</div>

				{/* Info notice */}
				<div className='flex items-start gap-3 p-3.5 mb-6 border rounded-xl bg-blue-50 border-blue-200/60'>
					<LightbulbIcon className='w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0' />
					<p className='text-sm text-blue-700'>
						Every step is <strong>optional</strong> — skip anything you don't have yet. You can always update your
						profile later.
					</p>
				</div>

				<div className='flex items-center gap-3'>
					<button
						type='button'
						onClick={goNext}
						className='inline-flex items-center gap-2 px-7 py-2.5 font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 shadow-blue-500/25 transition-all duration-300'>
						Get Started <ArrowRightIcon className='w-4 h-4' />
					</button>
					<button
						type='button'
						onClick={() => navigate("/")}
						className='px-5 py-2.5 font-semibold text-slate-500 transition-colors rounded-xl bg-slate-100 hover:bg-slate-200'>
						Skip for now
					</button>
				</div>
			</div>
		</Reveal>
	);

	// ══════════════════════════════════════════════════════════════════════════
	// STEP 1 — O/L Results
	// ══════════════════════════════════════════════════════════════════════════
	const renderOL = () => (
		<Reveal delay={0.05}>
			<div>
				<div className='mb-6'>
					<h2 className='mb-1 text-xl font-extrabold tracking-tight text-slate-900'>O/L Results</h2>
					<p className='text-sm text-slate-500'>
						Enter your Ordinary Level grades. Leave any subject blank if not applicable.
					</p>
				</div>

				{/* Core Subjects — 3 cols × 2 rows grid */}
				<div className='mb-6'>
					<SubLabel>Core Subjects</SubLabel>
					<div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
						{olSubjectsConfig.core_subjects.map((subject) => (
							<div
								key={subject.id}
								className='flex flex-col gap-2 px-4 pt-3 transition-colors border -pb-3 p rounded-xl bg-slate-50 border-slate-200 hover:border-blue-200 hover:bg-blue-50/30'>
								<div className='flex items-start justify-between gap-2'>
									<p className='text-sm font-semibold leading-tight text-slate-700'>{subject.name}</p>
									<select
										value={olCore[subject.id] || ""}
										onChange={(e) => setOlCore({ ...olCore, [subject.id]: e.target.value })}
										className='px-2 py-1 text-xs font-semibold bg-white border rounded-lg border-slate-200 text-slate-700 min-w-[68px] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'>
										<option value=''>Grade</option>
										{GRADES.map((g) => (
											<option key={g} value={g}>
												{g}
											</option>
										))}
									</select>
								</div>
								{subject.critical && (
									<span className='inline-block self-start mb-3 px-1.5 py-0.5 -mt-3 text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-md'>
										Important for A/L
									</span>
								)}
							</div>
						))}
					</div>
				</div>

				{/* Optional Baskets */}
				<div className='mb-4'>
					<SubLabel>
						Optional Subjects <span className='font-normal normal-case text-slate-400'>(Baskets)</span>
					</SubLabel>
					<div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
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
							<div key={key} className='p-3 border rounded-lg bg-slate-50 border-slate-200'>
								<p className='mb-0.5 text-[11px] font-bold text-slate-600'>{label}</p>
								<p className='mb-1.5 text-[10px] text-slate-400 leading-tight'>{config.name}</p>
								<select
									value={value}
									onChange={(e) => setValue(e.target.value)}
									className='w-full px-3 py-2 mb-2 text-xs bg-white border rounded-lg border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'>
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
										className='w-full px-2 py-1.5 text-xs bg-white border rounded-md border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none'>
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

				<NavRow onBack={goBack} onSkip={goNext} onNext={handleOLSave} nextLabel='Save & Continue' saving={saving} />
			</div>
		</Reveal>
	);

	// ══════════════════════════════════════════════════════════════════════════
	// STEP 2 — A/L Stream & Subjects
	// ══════════════════════════════════════════════════════════════════════════
	const renderAL = () => (
		<Reveal delay={0.05}>
			<div>
				<div className='mb-6'>
					<h2 className='mb-1 text-xl font-extrabold tracking-tight text-slate-900'>A/L Details</h2>
					<p className='text-sm text-slate-500'>
						Select your Advanced Level stream and up to 3 subjects you are studying.
					</p>
				</div>

				{/* Stream selector */}
				<div className='mb-6'>
					<SubLabel>A/L Stream</SubLabel>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-3'>
						{AL_STREAMS.map((s) => {
							const active = alStream === s.name;
							const streamIcon = STREAM_ICONS[s.id];
							return (
								<button
									key={s.id}
									type='button'
									onClick={() => {
										setAlStream(s.name);
										setAlSubjects(["", "", ""]);
									}}
									className={`
										px-4 text-left border-2 rounded-xl transition-all duration-200
										${
											active ?
												"border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md shadow-blue-100"
											:	"border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm"
										}
									`}>
									<div className='grid items-center grid-cols-12 gap-4'>
										<div
											className={`col-span-3 sm:col-span-2 flex-shrink-0 w-10 h-10 p-1 rounded-lg flex items-center justify-center ${active ? streamIcon.activeBg : streamIcon.bg}`}>
											{streamIcon.icon}
										</div>
										<div className='col-span-9 mt-3 sm:col-span-10'>
											<p
												className={`font-bold mb-2 text-xs leading-tight ${active ? "text-blue-700" : "text-slate-700"}`}>
												{s.name}
											</p>
											<p className={`text-[10px] leading-tight ${active ? "text-blue-500" : "text-slate-400"}`}>
												{s.tagline}
											</p>
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Subject dropdowns */}
				{alStream && (
					<div className='mb-4'>
						<SubLabel>
							Subjects <span className='font-normal normal-case text-slate-400'>(select up to 3)</span>
						</SubLabel>
						<div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
							{[0, 1, 2].map((idx) => (
								<div key={idx} className='p-3 border rounded-xl bg-slate-50 border-slate-200'>
									<p className='mb-1.5 text-xs font-bold text-slate-500'>Subject {idx + 1}</p>
									<select
										value={alSubjects[idx]}
										onChange={(e) => {
											const next = [...alSubjects];
											next[idx] = e.target.value;
											setAlSubjects(next);
										}}
										className='w-full px-3 py-2 text-sm bg-white border rounded-lg border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'>
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

				<NavRow onBack={goBack} onSkip={goNext} onNext={goNext} nextLabel='Continue' saving={saving} />
			</div>
		</Reveal>
	);

	// ══════════════════════════════════════════════════════════════════════════
	// STEP 3 — District, Z-score, Interests
	// ══════════════════════════════════════════════════════════════════════════
	const renderProfile = () => (
		<Reveal delay={0.05}>
			<div>
				<div className='mb-6'>
					<h2 className='mb-1 text-xl font-extrabold tracking-tight text-slate-900'>Your Profile</h2>
					<p className='text-sm text-slate-500'>
						Add your district, Z-score and interest areas for more personalised recommendations.
					</p>
				</div>

				<div className='space-y-6'>
					{/* District + Z-score */}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						<div>
							<SubLabel>District</SubLabel>
							<select
								value={district}
								onChange={(e) => setDistrict(e.target.value)}
								className='w-full px-3 py-2.5 text-sm bg-white border rounded-xl border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'>
								<option value=''>Select district...</option>
								{SRI_LANKA_DISTRICTS.map((d) => (
									<option key={d} value={d}>
										{d}
									</option>
								))}
							</select>
						</div>
						<div>
							<SubLabel>
								Z-Score <span className='font-normal normal-case text-slate-400'>(A/L result)</span>
							</SubLabel>
							<input
								type='number'
								step='0.0001'
								min='-3'
								max='3'
								value={zscore}
								onChange={(e) => setZscore(e.target.value)}
								placeholder='e.g. 1.8450'
								className='w-full px-3 py-2.5 text-sm bg-white border rounded-xl border-slate-200 placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
							/>
							<p className='mt-1 text-[10px] text-slate-400'>Value between −3 and +3</p>
						</div>
					</div>

					{/* Interest chips + custom add */}
					<div>
						<SubLabel>Fields of Interest</SubLabel>
						<div className='flex flex-wrap gap-2 mb-3'>
							{INTEREST_SUGGESTIONS.map((tag) => {
								const active = selectedInterests.includes(tag);
								return (
									<button
										key={tag}
										type='button'
										onClick={() => toggleInterest(tag)}
										className={`
											px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200
											${
												active ?
													"bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30"
												:	"bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50"
											}
										`}>
										{active && <span className='mr-1'>✓</span>}
										{tag}
									</button>
								);
							})}
							{/* Custom added tags — same style as active preset chips */}
							{customInterests.map((tag) => (
								<button
									key={tag}
									type='button'
									onClick={() => setCustomInterests((p) => p.filter((t) => t !== tag))}
									className='inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30 hover:bg-blue-700 transition-colors'
									title='Click to remove'>
									<span>✓</span>
									{tag}
									<span className='ml-0.5 opacity-70 text-[10px]'>×</span>
								</button>
							))}
						</div>
						{/* Add custom interest input */}
						<div className='flex gap-2'>
							<input
								type='text'
								value={customInterestInput}
								onChange={(e) => setCustomInterestInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleAddCustomInterest();
									}
								}}
								placeholder='Add your own interest...'
								className='flex-1 px-3 py-2 text-sm bg-white border rounded-xl border-slate-200 placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
							/>
							<button
								type='button'
								onClick={handleAddCustomInterest}
								disabled={!customInterestInput.trim()}
								className='inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-md transition-all'>
								<svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'>
									<path strokeLinecap='round' strokeLinejoin='round' d='M12 4.5v15m7.5-7.5h-15' />
								</svg>
								Add
							</button>
						</div>
					</div>

					{/* Career goals textarea */}
					<div>
						<SubLabel>
							Career Goals or Ambitions <span className='font-normal normal-case text-slate-400'>(optional)</span>
						</SubLabel>
						<textarea
							rows={3}
							value={interests}
							onChange={(e) => setInterests(e.target.value)}
							placeholder='e.g. I want to become a software engineer and work in AI. I enjoy mathematics and problem solving...'
							className='w-full px-4 py-3 text-sm bg-white border resize-none rounded-xl border-slate-200 placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
						/>
					</div>
				</div>

				<NavRow onBack={goBack} onSkip={goNext} onNext={handleProfileSave} nextLabel='Save & Finish' saving={saving} />
			</div>
		</Reveal>
	);

	// ══════════════════════════════════════════════════════════════════════════
	// STEP 4 — Complete
	// ══════════════════════════════════════════════════════════════════════════
	const renderDone = () => (
		<Reveal delay={0.05}>
			<div className='relative overflow-hidden '>
				{/* Decorative dot grid background */}
				<div
					className='absolute inset-0 pointer-events-none opacity-[0.04]  '
					style={{
						backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>

				<div className='relative py-6 text-center'>
					{/* Success badge with glow rings */}
					<div className='relative flex items-center justify-center mx-auto mb-8 w-28 h-28'>
						{/* Outer pulse ring */}
						<div
							className='absolute inset-0 rounded-full bg-blue-200/50 animate-ping'
							style={{ animationDuration: "2.5s" }}
						/>
						{/* Mid ring */}
						<div className='absolute border-2 border-blue-200 rounded-full inset-2 bg-gradient-to-br from-blue-100 to-indigo-100' />
						{/* Inner icon circle */}
						<div className='relative flex items-center justify-center w-16 h-16 rounded-full shadow-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/40'>
							<CheckCircleIcon className='w-8 h-8 text-white' />
						</div>
					</div>

					<h2 className='mb-2 text-2xl font-extrabold tracking-tight text-slate-900'>Profile Complete</h2>
					<p className='max-w-2xl mx-auto mb-2 text-sm leading-relaxed text-slate-500'>
						Your academic profile has been saved. We'll use it to surface personalized degree recommendations every time
						you search.
					</p>
					<p className='mb-8 text-xs text-slate-400'>
						Update anytime from{" "}
						<button
							onClick={() => navigate("/profile")}
							className='inline p-0 font-semibold text-blue-500 underline bg-transparent border-0 hover:text-blue-700 underline-offset-2'>
							My Profile
						</button>
					</p>

					{/* Saved summary strip */}
					<div className='grid max-w-2xl grid-cols-3 gap-3 mx-auto mb-8 text-left'>
						{[
							{
								icon: <BookIcon className='w-4 h-4 text-blue-600' />,
								label: "O/L Results",
								bg: "bg-blue-50 border-blue-100",
							},
							{
								icon: <GraduationIcon className='w-4 h-4 text-indigo-600' />,
								label: "A/L Details",
								bg: "bg-indigo-50 border-indigo-100",
							},
							{
								icon: <ChartBarIcon className='w-4 h-4 text-blue-700' />,
								label: "Your Profile",
								bg: "bg-blue-50 border-blue-100",
							},
						].map(({ icon, label, bg }) => (
							<div key={label} className={`flex flex-col items-center gap-2 p-3 border rounded-2xl ${bg}`}>
								<div className='flex items-center justify-center bg-white border shadow-sm w-9 h-9 rounded-xl border-white/80'>
									{icon}
								</div>
								<p className='text-[11px] font-bold text-center text-slate-600 leading-tight'>{label}</p>
								<span className='inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-full'>
									<CheckCircleIcon className='w-2.5 h-2.5' /> Saved
								</span>
							</div>
						))}
					</div>

					{/* CTA cards */}
					<p className='mb-3 text-xs font-bold tracking-widest uppercase text-slate-400'>Where to next?</p>
					<div className='grid max-w-2xl grid-cols-1 gap-3 mx-auto mb-6 sm:grid-cols-2'>
						<button
							type='button'
							onClick={() => navigate("/degree-recommendations/al-students")}
							className='flex items-center gap-4 p-4 text-left border-2 rounded-2xl transition-all duration-200 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-0.5 group'>
							<div className='flex items-center justify-center flex-shrink-0 shadow-md w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/30'>
								<GraduationIcon className='w-5 h-5 text-white' />
							</div>
							<div className='flex-1 min-w-0'>
								<p className='text-sm font-extrabold text-blue-800'>A/L Degree Finder</p>
								<p className='text-xs text-blue-600/70 mt-0.5'>Match degrees by stream and Z-score</p>
							</div>
							<ArrowRightIcon className='flex-shrink-0 w-4 h-4 text-blue-400 transition-opacity opacity-0 group-hover:opacity-100' />
						</button>
						<button
							type='button'
							onClick={() => navigate("/degree-recommendations/all-students")}
							className='flex items-center gap-4 p-4 text-left border-2 rounded-2xl transition-all duration-200 border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 group'>
							<div className='flex items-center justify-center flex-shrink-0 shadow-md w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 shadow-indigo-500/30'>
								<BookIcon className='w-5 h-5 text-white' />
							</div>
							<div className='flex-1 min-w-0'>
								<p className='text-sm font-extrabold text-indigo-800'>O/L Explorer</p>
								<p className='text-xs text-indigo-600/70 mt-0.5'>Explore streams by O/L grades</p>
							</div>
							<ArrowRightIcon className='flex-shrink-0 w-4 h-4 text-indigo-400 transition-opacity opacity-0 group-hover:opacity-100' />
						</button>
					</div>

					<button
						type='button'
						onClick={() => navigate("/")}
						className='inline-flex items-center gap-1.5 text-sm font-semibold transition-colors text-slate-400 hover:text-slate-600 border-0 bg-transparent p-0'>
						Go to Home <ArrowRightIcon className='w-3.5 h-3.5' />
					</button>
				</div>
			</div>
		</Reveal>
	);

	const RENDERERS = [renderWelcome, renderOL, renderAL, renderProfile, renderDone];

	// ══════════════════════════════════════════════════════════════════════════
	// Layout — matches ALWizardFlow structure exactly
	// ══════════════════════════════════════════════════════════════════════════
	return (
		<div className='min-h-screen pb-20 bg-slate-50'>
			{/* ── Hero header (blue, same as ALWizardFlow) ── */}
			<div className='relative pt-24 overflow-hidden border-b pb-28 border-blue-900/30 bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-600'>
				{/* Ambient blobs */}
				<div className='absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />
				<div className='absolute bottom-0 left-10 w-[400px] h-[400px] bg-blue-400/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen' />

				<div className='relative z-10 max-w-6xl px-6 mx-auto'>
					{/* Badge */}
					<div className='inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-bold tracking-widest uppercase rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/40'>
						<GraduationIcon className='w-4 h-4' />
						<span>Academic Profile Setup</span>
					</div>

					<h1 className='mb-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl'>
						Set Up Your{" "}
						<span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300'>
							Academic Profile
						</span>
					</h1>
					<p className='mb-8 text-base leading-relaxed text-blue-100/80'>
						Enter your O/L and A/L details to get personalised degree recommendations. All fields are optional.
					</p>

					{/* ProgressStepper — exactly as in ALWizardFlow */}
					{step < STEP_LABELS.length - 1 && (
						<ProgressStepper steps={STEP_LABELS.slice(0, -1)} currentStep={step} theme='blue' />
					)}
				</div>
			</div>

			{/* ── Main content card (same -mt-16 pull-up as ALWizardFlow) ── */}
			<div className='relative z-20 max-w-6xl px-6 mx-auto -mt-16'>
				<div className='p-8 mb-6 bg-white border shadow-2xl sm:p-10 border-blue-100/60 rounded-3xl'>
					{/* Error banner */}
					{error && (
						<div className='flex gap-3 p-4 mb-6 text-red-700 border border-red-200 rounded-xl bg-red-50'>
							<div>
								<p className='font-bold'>Something went wrong</p>
								<p className='text-sm mt-0.5'>{error}</p>
							</div>
						</div>
					)}

					{RENDERERS[step]?.()}
				</div>
			</div>
		</div>
	);
}
