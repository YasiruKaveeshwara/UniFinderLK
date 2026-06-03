import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserIcon, RefreshIcon, CheckCircleIcon, SpinnerIcon, AlertCircleIcon, ClipboardIcon } from "../ui/Icons";
import { saveALSubjects } from "../../api/academicApi";

/**
 * ALResultsSummary — shown at top of Step 3 results.
 * Displays the user's inputs as a clean summary card with a "Save My Details" button.
 */
export default function ALResultsSummary({ formData }) {
	const { stream, subjects, district, zscore, interests } = formData;
	const currentUser = useSelector((state) => state.user?.currentUser);
	const isLoggedIn = Boolean(currentUser);
	const navigate = useNavigate();

	const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
	const [saveError, setSaveError] = useState("");

	const handleSaveDetails = async () => {
		if (!isLoggedIn) {
			navigate("/signin");
			return;
		}

		setSaveStatus("saving");
		setSaveError("");

		try {
			await saveALSubjects({
				stream: stream || "",
				subjects: subjects || [],
				district: district || "",
				zscore: zscore !== "" ? Number(zscore) : null,
				interests: interests || "",
			});
			setSaveStatus("saved");
		} catch (err) {
			setSaveStatus("error");
			setSaveError(err.message || "Failed to save details");
		}
	};

	return (
		<div className='p-6 bg-white border-2 border-blue-100 shadow-lg rounded-3xl'>
			<div className='flex items-center justify-between'>
				<div className='flex flex-row items-center gap-2 mb-2'>
					<div className='flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-100 rounded-lg aspect-square shrink-0'>
						<UserIcon className='w-4 h-4' />
					</div>
					<div className='flex flex-col '>
						<p className='pt-3 text-base font-bold tracking-widest text-blue-600 uppercase'>Your Profile Summary</p>
					</div>
				</div>

				<div className='flex items-center gap-2'>
					{/* Save My Details button */}
					{saveStatus === "saved" ?
						<div className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border rounded-xl bg-emerald-50 text-emerald-700 border-emerald-200'>
							<CheckCircleIcon className='w-4 h-4' /> Saved!
						</div>
					:	<button
							onClick={handleSaveDetails}
							disabled={saveStatus === "saving"}
							className={`
								inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all
								${
									saveStatus === "saving" ?
										"bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
									:	"text-white bg-gradient-to-r from-indigo-600 to-blue-600 shadow-md shadow-indigo-500/20 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
								}
							`}>
							{saveStatus === "saving" ?
								<>
									<SpinnerIcon className='w-4 h-4 animate-spin' /> Saving...
								</>
							:	<>
									<ClipboardIcon className='w-4 h-4' />
									{isLoggedIn ? "Save My Details" : "Sign In to Save"}
								</>
							}
						</button>
					}

					<button
						onClick={() => (window.location.href = "/")}
						className='inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 transition-all border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 hover:shadow-md'>
						<RefreshIcon className='w-4 h-4' /> Search Again
					</button>
				</div>
			</div>

			{/* Save error message */}
			{saveStatus === "error" && (
				<div className='flex items-center gap-2 mt-3 text-xs font-medium text-red-600'>
					<AlertCircleIcon className='w-3.5 h-3.5' />
					{saveError}
				</div>
			)}

			<div className='flex flex-wrap gap-6'>
				{/* Stream */}
				{stream && (
					<div>
						<p className='mb-1.5 text-xs font-semibold tracking-wider uppercase text-slate-400'>Stream</p>
						<span className='inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded-xl bg-blue-600 text-white shadow-sm'>
							{stream}
						</span>
					</div>
				)}

				{/* Subjects */}
				{subjects.length > 0 && (
					<div>
						<p className='mb-1.5 text-xs font-semibold tracking-wider uppercase text-slate-400'>Subjects</p>
						<div className='flex flex-wrap gap-1.5'>
							{subjects.map((s) => (
								<span
									key={s}
									className='inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200'>
									{s}
								</span>
							))}
						</div>
					</div>
				)}

				{/* District */}
				{district && (
					<div>
						<p className='mb-1.5 text-xs font-semibold tracking-wider uppercase text-slate-400'>District</p>
						<span className='inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-50 text-cyan-800 border border-cyan-200'>
							{district}
						</span>
					</div>
				)}

				{/* Z-Score */}
				{zscore && (
					<div>
						<p className='mb-1.5 text-xs font-semibold tracking-wider uppercase text-slate-400'>Z-Score</p>
						<span className='inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white'>
							{zscore}
						</span>
					</div>
				)}

				{/* Interests */}
				{interests && interests.trim().length > 0 && (
					<div className='w-full'>
						<p className='mb-1.5 text-xs font-semibold tracking-wider uppercase text-slate-400'>Interests</p>
						<p className='text-sm italic leading-relaxed text-slate-600'>
							"{interests.length > 160 ? `${interests.slice(0, 160)}…` : interests}"
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
