import React from "react";
import StarRating from "./StarRating";

const SECTION_LABELS = {
	general: "General",
	ol_system: "O/L System",
	al_system: "A/L System",
};

const SECTION_COLORS = {
	general: "bg-amber-100 text-amber-800 border-amber-200",
	ol_system: "bg-teal-100 text-teal-800 border-teal-200",
	al_system: "bg-blue-100 text-blue-800 border-blue-200",
};

function getInitials(name) {
	if (!name || name === "Anonymous") return "?";
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function timeAgo(dateStr) {
	const diff = Date.now() - new Date(dateStr).getTime();
	const mins = Math.floor(diff / 60000);
	const hours = Math.floor(diff / 3600000);
	const days = Math.floor(diff / 86400000);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	if (hours < 24) return `${hours}h ago`;
	if (days < 7) return `${days}d ago`;
	return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * FeedbackCard — displays a single public feedback entry.
 * @param {object}   feedback  The feedback object from the API
 * @param {boolean}  owned     If true, shows Edit/Delete actions
 * @param {function} onEdit    Called when Edit is clicked
 * @param {function} onDelete  Called when Delete is clicked
 */
export default function FeedbackCard({ feedback, owned = false, onEdit, onDelete }) {
	const initials = getInitials(feedback.name);
	const sectionColor = SECTION_COLORS[feedback.section] || SECTION_COLORS.general;
	const sectionLabel = SECTION_LABELS[feedback.section] || "General";

	return (
		<div className='p-4 transition-shadow duration-200 bg-white border shadow-sm border-slate-100 rounded-2xl hover:shadow-md'>
			<div className='flex items-start gap-3'>
				{/* Avatar */}
				<div className='flex items-center justify-center flex-shrink-0 text-xs font-extrabold text-white rounded-full shadow-sm w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500'>
					{initials}
				</div>

				<div className='flex-1 min-w-0'>
					{/* Name + time */}
					<div className='flex flex-wrap items-center justify-between gap-2'>
						<span className='text-sm font-bold text-slate-800'>{feedback.name || "Anonymous"}</span>
						<span className='text-xs text-slate-400'>{timeAgo(feedback.createdAt)}</span>
					</div>

					{/* Stars + section */}
					<div className='flex items-center gap-2 mt-0.5'>
						<StarRating value={feedback.rating} readOnly size='sm' />
						<span
							className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full border ${sectionColor}`}>
							{sectionLabel}
						</span>
					</div>

					{/* Message */}
					<p className='mt-2 text-sm leading-relaxed text-slate-600'>{feedback.message}</p>

					{/* Owner actions */}
					{owned && (
						<div className='flex items-center gap-3 mt-2'>
							{feedback.canEdit && (
								<button
									type='button'
									onClick={onEdit}
									className='text-xs font-semibold transition-colors text-amber-600 hover:text-amber-700'>
									Edit
								</button>
							)}
							<button
								type='button'
								onClick={onDelete}
								className='text-xs font-semibold text-red-500 transition-colors hover:text-red-600'>
								Delete
							</button>
							{!feedback.canEdit && <span className='text-xs text-slate-400'>Edit window expired</span>}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
