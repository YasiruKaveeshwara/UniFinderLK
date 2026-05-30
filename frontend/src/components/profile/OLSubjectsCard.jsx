import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { fetchAcademicProfile, saveOLSubjects } from "../../api/academicApi";
import { ClipboardIcon, CheckCircleIcon, AlertCircleIcon, SpinnerIcon } from "../ui/Icons";

const CORE_SUBJECTS = [
	{ id: "religion", label: "Religion" },
	{ id: "first_language", label: "First Language" },
	{ id: "mathematics", label: "Mathematics" },
	{ id: "science", label: "Science" },
	{ id: "english", label: "English" },
	{ id: "history", label: "History" },
];

const GRADES = ["A", "B", "C", "S", "W"];

/**
 * OLSubjectsCard — displays and allows editing of saved O/L subjects on the Profile page.
 * Fetches from the backend on mount and supports inline editing.
 */
export default function OLSubjectsCard() {
	const currentUser = useSelector((state) => state.user?.currentUser);

	const [profile, setProfile] = useState(null);
	const [loadingFetch, setLoadingFetch] = useState(true);
	const [saving, setSaving] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	// Editable state — mirrors the backend olSubjects shape
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
			const res = await saveOLSubjects({
				core,
				bucket_1: bucket1,
				bucket_2: bucket2,
				bucket_3: bucket3,
			});
			setProfile(res.data);
			setEditMode(false);
			setSuccess("O/L subjects saved successfully!");
		} catch (err) {
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	// Check if there's any saved data
	const hasSavedData =
		profile &&
		(Object.values(profile.olSubjects?.core || {}).some((v) => v && v !== "") ||
			profile.olSubjects?.bucket_1 ||
			profile.olSubjects?.bucket_2 ||
			profile.olSubjects?.bucket_3);

	if (!currentUser) return null;

	if (loadingFetch) {
		return (
			<div className='p-6 mt-6 border bg-white/80 backdrop-blur-sm border-slate-200/60 rounded-2xl'>
				<div className='flex items-center justify-center gap-2 py-8 text-slate-400'>
					<SpinnerIcon className='w-5 h-5 animate-spin' />
					<span className='text-sm font-medium'>Loading academic data...</span>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6 mt-6 border bg-white/80 backdrop-blur-sm border-slate-200/60 rounded-2xl'>
			{/* Header */}
			<div className='flex items-center justify-between mb-5'>
				<div className='flex items-center gap-3'>
					<div className='p-2 rounded-lg bg-emerald-100 text-emerald-700'>
						<ClipboardIcon className='w-5 h-5' />
					</div>
					<h3 className='text-sm font-bold text-slate-800'>O/L Subjects & Results</h3>
				</div>
				{hasSavedData && (
					<button
						type='button'
						onClick={() => {
							setEditMode(!editMode);
							setSuccess("");
							setError("");
						}}
						className='px-3 py-1.5 text-xs font-semibold transition-colors border rounded-lg text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100'>
						{editMode ? "Cancel" : "Edit"}
					</button>
				)}
			</div>

			{/* Alerts */}
			{success && (
				<div className='flex items-center gap-3 p-3 mb-4 border rounded-xl bg-emerald-50 border-emerald-200/60'>
					<CheckCircleIcon className='w-4 h-4 text-emerald-500 shrink-0' />
					<p className='text-xs font-medium text-emerald-700'>{success}</p>
				</div>
			)}
			{error && (
				<div className='flex items-center gap-3 p-3 mb-4 border rounded-xl bg-red-50 border-red-200/60'>
					<AlertCircleIcon className='w-4 h-4 text-red-500 shrink-0' />
					<p className='text-xs font-medium text-red-700'>{error}</p>
				</div>
			)}

			{!hasSavedData && !editMode ?
				<p className='text-sm text-slate-400'>
					No O/L subjects saved yet. Use the <span className='font-semibold text-emerald-600'>O/L Explorer</span> to get
					career recommendations, then save your subjects from the results page.
				</p>
			:	<div className='space-y-4'>
					{/* Core Subjects */}
					<div>
						<p className='mb-2 text-xs font-semibold tracking-wider uppercase text-slate-400'>Core Subjects</p>
						<div className='space-y-2'>
							{CORE_SUBJECTS.map(({ id, label }) => {
								const grade = core[id] || "";
								return (
									<div key={id} className='flex items-center justify-between gap-3'>
										<span className='text-sm font-medium text-slate-700'>{label}</span>
										{editMode ?
											<select
												value={grade}
												onChange={(e) => handleCoreChange(id, e.target.value)}
												className='px-3 py-1.5 text-xs font-semibold border rounded-lg bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'>
												<option value=''>—</option>
												{GRADES.map((g) => (
													<option key={g} value={g}>
														{g}
													</option>
												))}
											</select>
										: grade ?
											<span className='px-2 py-0.5 text-xs font-extrabold text-white bg-emerald-600 rounded-md'>
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
							<p className='mb-2 text-xs font-semibold tracking-wider uppercase text-slate-400'>Optional Subjects</p>
							<div className='space-y-2'>
								{[
									{ key: "bucket_1", label: "Basket I", value: bucket1, setValue: setBucket1 },
									{ key: "bucket_2", label: "Basket II", value: bucket2, setValue: setBucket2 },
									{ key: "bucket_3", label: "Basket III", value: bucket3, setValue: setBucket3 },
								].map(({ key, label, value, setValue }) => {
									const grade = core[`${key}_grade`] || "";
									return (
										<div key={key} className='flex items-center justify-between gap-3'>
											{editMode ?
												<input
													type='text'
													value={value}
													onChange={(e) => {
														setValue(e.target.value);
														setSuccess("");
													}}
													placeholder={`${label} subject`}
													className='flex-1 px-3 py-1.5 text-sm border rounded-lg bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'
												/>
											:	<span className='text-sm font-medium capitalize text-slate-700'>
													{value || <span className='text-slate-300'>—</span>}
												</span>
											}
											{editMode ?
												<select
													value={grade}
													onChange={(e) => handleBucketGradeChange(key, e.target.value)}
													className='px-3 py-1.5 text-xs font-semibold border rounded-lg bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'>
													<option value=''>—</option>
													{GRADES.map((g) => (
														<option key={g} value={g}>
															{g}
														</option>
													))}
												</select>
											: grade ?
												<span className='px-2 py-0.5 text-xs font-extrabold text-white bg-teal-600 rounded-md'>
													{grade}
												</span>
											:	null}
										</div>
									);
								})}
							</div>
						</div>
					)}

					{/* Save button in edit mode */}
					{editMode && (
						<button
							type='button'
							onClick={handleSave}
							disabled={saving}
							className={`
								w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300
								${saving ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "text-white bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"}
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
