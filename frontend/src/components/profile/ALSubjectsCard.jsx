import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { fetchAcademicProfile, saveALSubjects } from "../../api/academicApi";
import { GraduationIcon, CheckCircleIcon, AlertCircleIcon, SpinnerIcon } from "../ui/Icons";

/**
 * ALSubjectsCard — displays and allows editing of saved A/L details on the Profile page.
 * Shows stream, subjects, district, zscore, and interests.
 */
export default function ALSubjectsCard() {
	const currentUser = useSelector((state) => state.user?.currentUser);

	const [profile, setProfile] = useState(null);
	const [loadingFetch, setLoadingFetch] = useState(true);
	const [saving, setSaving] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

	// Editable state
	const [stream, setStream] = useState("");
	const [subjects, setSubjects] = useState(["", "", ""]);
	const [district, setDistrict] = useState("");
	const [zscore, setZscore] = useState("");
	const [interests, setInterests] = useState("");

	const loadProfile = useCallback(async () => {
		if (!currentUser) return;
		try {
			setLoadingFetch(true);
			const res = await fetchAcademicProfile();
			const al = res.data?.alSubjects || {};
			setProfile(res.data);
			setStream(al.stream || "");
			setSubjects(al.subjects?.length > 0 ? [...al.subjects] : ["", "", ""]);
			setDistrict(al.district || "");
			setZscore(al.zscore !== null && al.zscore !== undefined ? String(al.zscore) : "");
			setInterests(al.interests || "");
		} catch (err) {
			setError(err.message);
		} finally {
			setLoadingFetch(false);
		}
	}, [currentUser]);

	useEffect(() => {
		loadProfile();
	}, [loadProfile]);

	const handleSave = async () => {
		setError("");
		setSuccess("");
		setSaving(true);
		try {
			const res = await saveALSubjects({
				stream,
				subjects: subjects.filter((s) => s.trim() !== ""),
				district,
				zscore: zscore !== "" ? Number(zscore) : null,
				interests,
			});
			setProfile(res.data);
			setEditMode(false);
			setSuccess("A/L details saved successfully!");
		} catch (err) {
			setError(err.message);
		} finally {
			setSaving(false);
		}
	};

	const hasSavedData =
		profile &&
		(profile.alSubjects?.stream ||
			(profile.alSubjects?.subjects && profile.alSubjects.subjects.length > 0) ||
			profile.alSubjects?.district ||
			profile.alSubjects?.zscore !== null);

	if (!currentUser) return null;

	if (loadingFetch) {
		return (
			<div className='p-6 mt-6 border bg-white/80 backdrop-blur-sm border-slate-200/60 rounded-2xl'>
				<div className='flex items-center justify-center gap-2 py-8 text-slate-400'>
					<SpinnerIcon className='w-5 h-5 animate-spin' />
					<span className='text-sm font-medium'>Loading A/L data...</span>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6 mt-6 border bg-white/80 backdrop-blur-sm border-slate-200/60 rounded-2xl'>
			{/* Header */}
			<div className='flex items-center justify-between mb-5'>
				<div className='flex items-center gap-3'>
					<div className='p-2 text-blue-700 bg-blue-100 rounded-lg'>
						<GraduationIcon className='w-5 h-5' />
					</div>
					<h3 className='text-sm font-bold text-slate-800'>A/L Stream & Details</h3>
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
					No A/L details saved yet. Use the <span className='font-semibold text-blue-600'>A/L Degree Finder</span> to
					search for degrees, then save your details from the results page.
				</p>
			:	<div className='space-y-4'>
					{/* Stream */}
					<div className='flex items-center justify-between gap-3'>
						<span className='text-sm font-medium text-slate-700'>Stream</span>
						{editMode ?
							<input
								type='text'
								value={stream}
								onChange={(e) => {
									setStream(e.target.value);
									setSuccess("");
								}}
								placeholder='e.g. Physical Science'
								className='flex-1 max-w-xs px-3 py-1.5 text-sm border rounded-lg bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'
							/>
						: stream ?
							<span className='px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-lg'>{stream}</span>
						:	<span className='text-xs text-slate-300'>—</span>}
					</div>

					{/* Subjects */}
					<div>
						<span className='text-sm font-medium text-slate-700'>Subjects</span>
						{editMode ?
							<div className='flex flex-wrap gap-2 mt-2'>
								{subjects.map((subj, i) => (
									<input
										key={i}
										type='text'
										value={subj}
										onChange={(e) => {
											const newSubjects = [...subjects];
											newSubjects[i] = e.target.value;
											setSubjects(newSubjects);
											setSuccess("");
										}}
										placeholder={`Subject ${i + 1}`}
										className='flex-1 min-w-[120px] px-3 py-1.5 text-sm border rounded-lg bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'
									/>
								))}
							</div>
						: profile?.alSubjects?.subjects?.length > 0 ?
							<div className='flex flex-wrap gap-1.5 mt-1'>
								{profile.alSubjects.subjects.map((s) => (
									<span
										key={s}
										className='inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200'>
										{s}
									</span>
								))}
							</div>
						:	<span className='block mt-1 text-xs text-slate-300'>—</span>}
					</div>

					{/* District */}
					<div className='flex items-center justify-between gap-3'>
						<span className='text-sm font-medium text-slate-700'>District</span>
						{editMode ?
							<input
								type='text'
								value={district}
								onChange={(e) => {
									setDistrict(e.target.value);
									setSuccess("");
								}}
								placeholder='e.g. Colombo'
								className='flex-1 max-w-xs px-3 py-1.5 text-sm border rounded-lg bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'
							/>
						: district ?
							<span className='px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200'>
								{district}
							</span>
						:	<span className='text-xs text-slate-300'>—</span>}
					</div>

					{/* Z-Score */}
					<div className='flex items-center justify-between gap-3'>
						<span className='text-sm font-medium text-slate-700'>Z-Score</span>
						{editMode ?
							<input
								type='number'
								step='0.0001'
								min='-3'
								max='3'
								value={zscore}
								onChange={(e) => {
									setZscore(e.target.value);
									setSuccess("");
								}}
								placeholder='e.g. 1.5432'
								className='flex-1 max-w-xs px-3 py-1.5 text-sm border rounded-lg bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'
							/>
						: zscore ?
							<span className='px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white'>{zscore}</span>
						:	<span className='text-xs text-slate-300'>—</span>}
					</div>

					{/* Interests */}
					<div>
						<span className='text-sm font-medium text-slate-700'>Interests</span>
						{editMode ?
							<textarea
								value={interests}
								onChange={(e) => {
									setInterests(e.target.value);
									setSuccess("");
								}}
								placeholder='Your interests and goals...'
								rows='2'
								className='w-full px-3 py-2 mt-1 text-sm border rounded-lg resize-none bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none'
							/>
						: interests ?
							<p className='mt-1 text-sm italic leading-relaxed text-slate-600'>
								"{interests.length > 200 ? `${interests.slice(0, 200)}…` : interests}"
							</p>
						:	<span className='block mt-1 text-xs text-slate-300'>—</span>}
					</div>

					{/* Save button in edit mode */}
					{editMode && (
						<button
							type='button'
							onClick={handleSave}
							disabled={saving}
							className={`
								w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300
								${saving ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/25 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"}
							`}>
							{saving ?
								<>
									<SpinnerIcon className='w-4 h-4 animate-spin' />
									Saving...
								</>
							:	"Save A/L Details"}
						</button>
					)}
				</div>
			}
		</div>
	);
}
