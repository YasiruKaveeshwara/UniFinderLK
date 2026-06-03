import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { fetchAcademicProfile, saveALSubjects } from "../../api/academicApi";
import {
	GraduationIcon,
	CheckCircleIcon,
	AlertCircleIcon,
	SpinnerIcon,
	MapPinIcon,
	ChartBarIcon,
	LightbulbIcon,
} from "../ui/Icons";
import { SRI_LANKA_DISTRICTS, AL_STREAMS } from "../../constants/degreeConstants";

/**
 * ALSubjectsCard — displays and allows editing of saved A/L details on the Profile page.
 * Blue theme to match the A/L Degree Finder.
 */
export default function ALSubjectsCard() {
	const currentUser = useSelector((state) => state.user?.currentUser);

	const [profile, setProfile] = useState(null);
	const [loadingFetch, setLoadingFetch] = useState(true);
	const [saving, setSaving] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [success, setSuccess] = useState("");
	const [error, setError] = useState("");

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
			<div className='p-6 bg-white border shadow-sm border-slate-100 rounded-2xl'>
				<div className='flex items-center justify-center gap-2 py-8 text-slate-400'>
					<SpinnerIcon className='w-5 h-5 animate-spin' />
					<span className='text-sm font-medium'>Loading A/L data...</span>
				</div>
			</div>
		);
	}

	return (
		<div className='p-6 bg-white border shadow-sm border-slate-100 rounded-2xl sm:p-8'>
			{/* Header */}
			<div className='flex items-center justify-between mb-5'>
				<div className='flex items-center gap-3 -mb-4'>
					<div>
						<h3 className='text-lg font-bold text-slate-900'>A/L Stream &amp; Details</h3>
						<p className='text-xs text-slate-400'>Advanced Level academic profile</p>
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
							:	"text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
						}`}>
						{editMode ? "Cancel" : "Edit"}
					</button>
				)}
			</div>

			{/* Alerts */}
			{success && (
				<div className='flex items-center gap-3 p-3 mb-4 border rounded-xl bg-blue-50 border-blue-200/60'>
					<CheckCircleIcon className='w-4 h-4 text-blue-500 shrink-0' />
					<p className='text-xs font-medium text-blue-700'>{success}</p>
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
					<div className='flex items-center justify-center w-12 h-12 border border-blue-100 rounded-2xl bg-blue-50'>
						<GraduationIcon className='w-6 h-6 text-blue-400' />
					</div>
					<div>
						<p className='text-sm font-semibold text-slate-600'>No A/L details saved yet</p>
						<p className='text-xs text-slate-400 mt-0.5'>
							Use the <span className='font-semibold text-blue-600'>A/L Degree Finder</span> to search for degrees, then
							save your details.
						</p>
					</div>
					<button
						type='button'
						onClick={() => setEditMode(true)}
						className='px-4 py-2 mt-1 text-xs font-semibold text-blue-700 transition-colors border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100'>
						Add Manually
					</button>
				</div>
			:	<div className='space-y-5'>
					{/* Stream + Subjects in one row */}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
						{/* Stream — takes 1 col */}
						<div>
							<p className='mb-3 text-xs font-bold tracking-widest uppercase text-slate-400'>Stream</p>
							{editMode ?
								<select
									value={stream}
									onChange={(e) => {
										setStream(e.target.value);
										setSuccess("");
									}}
									className='w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'>
									<option value=''>Select stream...</option>
									{AL_STREAMS.map((s) => (
										<option key={s.id} value={s.name}>
											{s.name}
										</option>
									))}
								</select>
							: stream ?
								<span className='inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-sm shadow-blue-500/20'>
									<GraduationIcon className='w-3 h-3' />
									{stream}
								</span>
							:	<span className='text-sm text-slate-300'>—</span>}
						</div>

						{/* Subjects — takes 2 cols */}
						<div className='sm:col-span-2'>
							<p className='mb-3 text-xs font-bold tracking-widest uppercase text-slate-400'>Subjects</p>
							{editMode ?
								<div className='grid grid-cols-1 gap-2 sm:grid-cols-3'>
									{subjects.map((subj, i) => {
										const streamConfig = AL_STREAMS.find((s) => s.name === stream);
										return streamConfig ?
												<select
													key={i}
													value={subj}
													onChange={(e) => {
														const next = [...subjects];
														next[i] = e.target.value;
														setSubjects(next);
														setSuccess("");
													}}
													className='px-3 py-2 text-sm border rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none'>
													<option value=''>Subject {i + 1}...</option>
													{streamConfig.availableSubjects
														.filter((s) => !subjects.includes(s) || subjects[i] === s)
														.map((s) => (
															<option key={s} value={s}>
																{s}
															</option>
														))}
												</select>
											:	<input
													key={i}
													type='text'
													value={subj}
													onChange={(e) => {
														const next = [...subjects];
														next[i] = e.target.value;
														setSubjects(next);
														setSuccess("");
													}}
													placeholder={`Subject ${i + 1}`}
													className='px-3 py-2 text-sm border rounded-xl bg-slate-50 border-slate-200 placeholder:text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
												/>;
									})}
								</div>
							: profile?.alSubjects?.subjects?.length > 0 ?
								<div className='flex flex-wrap gap-2'>
									{profile.alSubjects.subjects.map((s) => (
										<span
											key={s}
											className='inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-blue-800 border border-blue-100'>
											{s}
										</span>
									))}
								</div>
							:	<span className='text-sm text-slate-300'>—</span>}
						</div>
					</div>

					{/* District & Z-Score row */}
					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						{/* District */}
						<div>
							<p className='mb-3 text-xs font-bold tracking-widest uppercase text-slate-400'>District</p>
							{editMode ?
								<select
									value={district}
									onChange={(e) => {
										setDistrict(e.target.value);
										setSuccess("");
									}}
									className='w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'>
									<option value=''>Select district...</option>
									{SRI_LANKA_DISTRICTS.map((d) => (
										<option key={d} value={d}>
											{d}
										</option>
									))}
								</select>
							: district ?
								<span className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-50 text-blue-800 border border-blue-100'>
									<MapPinIcon className='w-3 h-3' />
									{district}
								</span>
							:	<span className='text-sm text-slate-300'>—</span>}
						</div>

						{/* Z-Score */}
						<div>
							<p className='mb-3 text-xs font-bold tracking-widest uppercase text-slate-400'>Z-Score</p>
							{editMode ?
								<>
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
										className='w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 border-slate-200 placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
									/>
									<p className='mt-1 text-[10px] text-slate-400'>Value between −3 and +3</p>
								</>
							: zscore ?
								<span className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'>
									<ChartBarIcon className='w-3 h-3' />
									{zscore}
								</span>
							:	<span className='text-sm text-slate-300'>—</span>}
						</div>
					</div>

					{/* Interests */}
					<div>
						<p className='mb-3 text-xs font-bold tracking-widest uppercase text-slate-400'>Interests &amp; Goals</p>
						{editMode ?
							<textarea
								value={interests}
								onChange={(e) => {
									setInterests(e.target.value);
									setSuccess("");
								}}
								placeholder='Your interests, career goals, and ambitions...'
								rows='3'
								className='w-full px-3 py-2.5 text-sm border rounded-xl resize-none bg-slate-50 border-slate-200 placeholder:text-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
							/>
						: interests ?
							<div className='flex items-start gap-2 p-3 border border-blue-100 rounded-xl bg-blue-50'>
								<LightbulbIcon className='w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0' />
								<p className='text-sm italic leading-relaxed text-slate-600'>
									"{interests.length > 200 ? `${interests.slice(0, 200)}…` : interests}"
								</p>
							</div>
						:	<span className='text-sm text-slate-300'>—</span>}
					</div>

					{/* Save button */}
					{editMode && (
						<button
							type='button'
							onClick={handleSave}
							disabled={saving}
							className={`
								w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold rounded-xl transition-all duration-300
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
