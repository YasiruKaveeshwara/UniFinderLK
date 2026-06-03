import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { fetchAcademicProfile, saveOLSubjects } from "../../api/academicApi";
import { ClipboardIcon, CheckCircleIcon, AlertCircleIcon, SpinnerIcon } from "../ui/Icons";
import olSubjectsConfig from "../../config/ol_subjects_config.json";

// Build id → display name lookup across all three buckets
const BUCKET_SUBJECT_NAME = {};
[olSubjectsConfig.bucket_1, olSubjectsConfig.bucket_2, olSubjectsConfig.bucket_3].forEach((bucket) => {
	bucket.subjects.forEach(({ id, name }) => {
		BUCKET_SUBJECT_NAME[id] = name;
	});
});

const CORE_SUBJECTS = [
	{ id: "religion", label: "Religion" },
	{ id: "first_language", label: "First Language" },
	{ id: "mathematics", label: "Mathematics" },
	{ id: "science", label: "Science" },
	{ id: "english", label: "English" },
	{ id: "history", label: "History" },
];

const GRADES = ["A", "B", "C", "S", "W"];

const GRADE_COLORS = {
	A: "bg-teal-600 text-white",
	B: "bg-teal-500 text-white",
	C: "bg-teal-400 text-white",
	S: "bg-amber-400 text-white",
	W: "bg-slate-400 text-white",
};

/**
 * OLSubjectsCard — displays and allows editing of saved O/L subjects on the Profile page.
 * Green/teal theme to match the O/L Explorer.
 */
export default function OLSubjectsCard() {
	const currentUser = useSelector((state) => state.user?.currentUser);

	const [profile, setProfile] = useState(null);
	const [loadingFetch, setLoadingFetch] = useState(true);
	const [saving, setSaving] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	const [core, setCore] = useState({});
	const [bucket1, setBucket1] = useState("");
	const [bucket2, setBucket2] = useState("");
	const [bucket3, setBucket3] = useState("");

	const loadProfile = useCallback(async () => {
		if (!currentUser) return;
		try {
			setLoadingFetch(true);
			const res = await fetchAcademicProfile();
			const ol = res.data?.olSubjects || {};
			setProfile(res.data);
			setCore(ol.core || {});
			setBucket1(ol.bucket_1 || "");
			setBucket2(ol.bucket_2 || "");
			setBucket3(ol.bucket_3 || "");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoadingFetch(false);
		}
	}, [currentUser]);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	const handleCoreChange = (subjectId, grade) => {
		setCore((prev) => ({ ...prev, [subjectId]: grade }));
		setSuccess("");
	};

	const handleBucketGradeChange = (bucket, grade) => {
		setCore((prev) => ({ ...prev, [`${bucket}_grade`]: grade }));
		setSuccess("");
	};

	const handleSave = async () => {
		setError("");
		setSuccess("");
		setSaving(true);
		try {
			const res = await saveOLSubjects({ core, bucket_1: bucket1, bucket_2: bucket2, bucket_3: bucket3 });
			setProfile(res.data);
			setEditMode(false);
			setSuccess("O/L subjects saved successfully!");
		} catch (err) {
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const hasSavedData =
		profile &&
		(Object.values(profile.olSubjects?.core || {}).some((v) => v && v !== "") ||
			profile.olSubjects?.bucket_1 ||
			profile.olSubjects?.bucket_2 ||
			profile.olSubjects?.bucket_3);

	if (!currentUser) return null;

	if (loadingFetch) {
		return (
			<div className='p-6 bg-white border shadow-sm border-slate-100 rounded-2xl'>
				<div className='flex items-center justify-center gap-2 py-8 text-slate-400'>
					<SpinnerIcon className='w-5 h-5 animate-spin' />
					<span className='text-sm font-medium'>Loading academic data...</span>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6 bg-white border shadow-sm border-slate-100 rounded-2xl sm:p-8'>
			{/* Header */}
			<div className='flex items-center justify-between mb-4'>
				<div className='flex items-center gap-3'>
					<div>
						<h3 className='text-lg font-bold text-slate-900'>O/L Subjects &amp; Results</h3>
						<p className='text-xs text-slate-400'>Ordinary Level academic record</p>
					</div>
				</div>
				{hasSavedData && (
					<button
						type='button'
						onClick={() => {
							setEditMode(!editMode);
							setSuccess("");
							setError("");
						}}
						className={`px-3 py-1.5 text-xs font-semibold transition-colors border rounded-lg ${
							editMode ?
								"text-slate-600 border-slate-200 bg-slate-100 hover:bg-slate-200"
							:	"text-teal-700 border-teal-200 bg-teal-50 hover:bg-teal-100"
						}`}>
						{editMode ? "Cancel" : "Edit"}
					</button>
				)}
			</div>

			{/* Alerts */}
			{success && (
				<div className='flex items-center gap-3 p-3 mb-4 border rounded-xl bg-teal-50 border-teal-200/60'>
					<CheckCircleIcon className='w-4 h-4 text-teal-500 shrink-0' />
					<p className='text-xs font-medium text-teal-700'>{success}</p>
				</div>
			)}
			{error && (
				<div className='flex items-center gap-3 p-3 mb-4 border rounded-xl bg-red-50 border-red-200/60'>
					<AlertCircleIcon className='w-4 h-4 text-red-500 shrink-0' />
					<p className='text-xs font-medium text-red-700'>{error}</p>
				</div>
			)}

			{!hasSavedData && !editMode ?
				<div className='flex flex-col items-center gap-3 py-8 text-center'>
					<div className='flex items-center justify-center w-12 h-12 border border-teal-100 rounded-2xl bg-teal-50'>
						<ClipboardIcon className='w-6 h-6 text-teal-400' />
					</div>
					<div>
						<p className='text-sm font-semibold text-slate-600'>No O/L subjects saved yet</p>
						<p className='text-xs text-slate-400 mt-0.5'>
							Use the <span className='font-semibold text-teal-600'>O/L Explorer</span> to get recommendations, then
							save your results.
						</p>
					</div>
					<button
						type='button'
						onClick={() => setEditMode(true)}
						className='px-4 py-2 mt-1 text-xs font-semibold text-teal-700 transition-colors border border-teal-200 rounded-xl bg-teal-50 hover:bg-teal-100'>
						Add Manually
					</button>
				</div>
			:	<div className='space-y-5'>
					{/* Core Subjects */}
					<div>
						<p className='mb-3 text-xs font-bold tracking-widest uppercase text-slate-400'>Core Subjects</p>
						<div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
							{CORE_SUBJECTS.map(({ id, label }) => {
								const grade = core[id] || "";
								return (
									<div
										key={id}
										className='flex items-center justify-between gap-3 px-3 py-2.5 border rounded-xl bg-slate-50 border-slate-100'>
										<span className='text-sm font-medium text-slate-700'>{label}</span>
										{editMode ?
											<select
												value={grade}
												onChange={(e) => handleCoreChange(id, e.target.value)}
												className='px-2 py-1 text-xs font-semibold bg-white border rounded-lg border-slate-200 text-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 focus:outline-none'>
												<option value=''>—</option>
												{GRADES.map((g) => (
													<option key={g} value={g}>
														{g}
													</option>
												))}
											</select>
										: grade ?
											<span
												className={`px-2 py-0.5 text-xs font-extrabold rounded-md ${GRADE_COLORS[grade] || "bg-slate-400 text-white"}`}>
												{grade}
											</span>
										:	<span className='text-xs text-slate-300'>—</span>}
									</div>
								);
							})}
						</div>
					</div>

					{/* Optional Subjects */}
					{(bucket1 || bucket2 || bucket3 || editMode) && (
						<div>
							<p className='mb-2 text-xs font-bold tracking-widest uppercase text-slate-400'>Optional Subjects</p>
							<div className='grid grid-cols-1 gap-1.5 sm:grid-cols-3'>
								{[
									{
										key: "bucket_1",
										label: "Basket I",
										value: bucket1,
										setValue: setBucket1,
										config: olSubjectsConfig.bucket_1,
									},
									{
										key: "bucket_2",
										label: "Basket II",
										value: bucket2,
										setValue: setBucket2,
										config: olSubjectsConfig.bucket_2,
									},
									{
										key: "bucket_3",
										label: "Basket III",
										value: bucket3,
										setValue: setBucket3,
										config: olSubjectsConfig.bucket_3,
									},
								].map(({ key, label, value, setValue, config }) => {
									const grade = core[`${key}_grade`] || "";
									// Resolve display name from id
									const displayName = BUCKET_SUBJECT_NAME[value] || value;
									return (
										<div
											key={key}
											className='flex items-center justify-between gap-2 px-2.5 py-2 border rounded-xl bg-slate-50 border-slate-100'>
											<div className='flex-1 min-w-0'>
												<p className='text-[10px] font-bold text-slate-400 mb-0.5'>{label}</p>
												{editMode ?
													<select
														value={value}
														onChange={(e) => {
															setValue(e.target.value);
															setSuccess("");
														}}
														className='w-full px-2 py-1 text-xs bg-white border rounded-lg border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 focus:outline-none'>
														<option value=''>Select subject...</option>
														{config.subjects.map((s) => (
															<option key={s.id} value={s.id}>
																{s.name}
															</option>
														))}
													</select>
												:	<p className='text-xs font-semibold leading-tight truncate text-slate-700'>
														{displayName || <span className='font-normal text-slate-300'>—</span>}
													</p>
												}
											</div>
											{/* Grade */}
											{editMode ?
												<select
													value={grade}
													onChange={(e) => handleBucketGradeChange(key, e.target.value)}
													className='flex-shrink-0 px-1 py-1 text-xs font-semibold bg-white border rounded-lg w-14 border-slate-200 text-slate-700 focus:border-teal-500 focus:outline-none'>
													<option value=''>—</option>
													{GRADES.map((g) => (
														<option key={g} value={g}>
															{g}
														</option>
													))}
												</select>
											: grade ?
												<span
													className={`flex-shrink-0 px-2 py-0.5 text-xs font-extrabold rounded-md ${GRADE_COLORS[grade] || "bg-slate-400 text-white"}`}>
													{grade}
												</span>
											:	null}
										</div>
									);
								})}
							</div>
						</div>
					)}

					{/* Save button */}
					{editMode && (
						<button
							type='button'
							onClick={handleSave}
							disabled={saving}
							className={`
								w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl transition-all duration-300
								${saving ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "text-white bg-gradient-to-r from-teal-600 to-teal-500 shadow-lg shadow-teal-500/25 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"}
							`}>
							{saving ?
								<>
									<SpinnerIcon className='w-4 h-4 animate-spin' />
									Saving...
								</>
							:	"Save O/L Subjects"}
						</button>
					)}
				</div>
			}
		</div>
	);
}
