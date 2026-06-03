import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import Reveal from "../components/ui/Reveal";
import StarRating from "../components/feedback/StarRating";
import FeedbackCard from "../components/feedback/FeedbackCard";
import { createFeedback, getAllFeedback } from "../api/feedbackApi";

const SECTIONS = [
	{ id: "general", label: "General" },
	{ id: "ol_system", label: "O/L System" },
	{ id: "al_system", label: "A/L System" },
];

function avg(feedbacks) {
	if (!feedbacks.length) return 0;
	return (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1);
}

export default function FeedbackPage() {
	const currentUser = useSelector((s) => s.user?.currentUser);
	const isLoggedIn = Boolean(currentUser);

	// ── Form state ───────────────────────────────────────────────────────────
	const [name, setName] = useState(currentUser?.name || "");
	const [email, setEmail] = useState(currentUser?.email || "");
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [rating, setRating] = useState(0);
	const [section, setSection] = useState("general");
	const [message, setMessage] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [formError, setFormError] = useState("");
	const [submitted, setSubmitted] = useState(false);

	// ── Wall state ───────────────────────────────────────────────────────────
	const [feedbacks, setFeedbacks] = useState([]);
	const [wallLoading, setWallLoading] = useState(true);
	const [wallError, setWallError] = useState("");
	const [wallSection, setWallSection] = useState("all");
	const [page, setPage] = useState(1);
	const [pagination, setPagination] = useState(null);

	// ── Autofill on login change ─────────────────────────────────────────────
	useEffect(() => {
		if (!isAnonymous) {
			setName(currentUser?.name || "");
			setEmail(currentUser?.email || "");
		}
	}, [currentUser, isAnonymous]);

	// ── Load feedback wall ───────────────────────────────────────────────────
	const loadFeedbacks = useCallback(async () => {
		setWallLoading(true);
		setWallError("");
		try {
			const params = { page, limit: 12 };
			if (wallSection !== "all") params.section = wallSection;
			const res = await getAllFeedback(params);
			setFeedbacks(res.data || []);
			setPagination(res.pagination || null);
		} catch (e) {
			setWallError(e.message || "Failed to load feedback.");
		} finally {
			setWallLoading(false);
		}
	}, [page, wallSection]);

	useEffect(() => {
		loadFeedbacks();
	}, [loadFeedbacks]);

	// Reset page on filter change
	useEffect(() => {
		setPage(1);
	}, [wallSection]);

	// ── Submit ───────────────────────────────────────────────────────────────
	const handleSubmit = async (e) => {
		e.preventDefault();
		setFormError("");

		if (rating === 0) return setFormError("Please select a star rating.");
		if (!isAnonymous && !name.trim()) return setFormError("Please enter your name.");
		if (message.trim().length < 10) return setFormError("Feedback must be at least 10 characters.");

		setSubmitting(true);
		try {
			await createFeedback({ name, email, rating, section, message, isAnonymous });
			setSubmitted(true);
			setRating(0);
			setMessage("");
			setSection("general");
			loadFeedbacks();
		} catch (e) {
			setFormError(e.message || "Failed to submit feedback. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	// ── Quick stats ──────────────────────────────────────────────────────────
	const totalCount = pagination?.total ?? feedbacks.length;
	const avgRating = avg(feedbacks);

	return (
		<div className='min-h-screen pb-20 bg-slate-50'>
			{/* ── Hero ── */}
			<div className='relative pt-24 overflow-hidden border-b pb-28 border-orange-900/20 bg-gradient-to-br from-amber-600 via-orange-500 to-amber-500'>
				<div className='absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-300/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />
				<div className='absolute bottom-0 left-10 w-[400px] h-[400px] bg-orange-300/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen' />

				<div className='relative z-10 max-w-6xl px-6 mx-auto'>
					<div className='inline-flex items-center gap-2 px-4 py-2 mb-4 text-xs font-bold tracking-widest uppercase border rounded-full bg-white/15 text-amber-50 border-amber-300/40'>
						<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 24 24'>
							<path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
						</svg>
						<span>User Feedback</span>
					</div>
					<h1 className='mb-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl'>
						Share Your{" "}
						<span className='text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-100'>
							Experience
						</span>
					</h1>
					<p className='max-w-2xl text-lg leading-relaxed text-amber-100/80'>
						Your feedback helps us improve UniFinderLK for every student in Sri Lanka. Rate your experience and let us
						know what we can do better.
					</p>

					{/* Stats row */}
					<div className='flex flex-wrap gap-4 mt-8'>
						{[
							{ label: "Total Reviews", value: totalCount || "0" },
							{ label: "Average Rating", value: avgRating > 0 ? `${avgRating} / 5` : "—" },
						].map((s, i) => (
							<div
								key={s.label}
								className={`flex items-center gap-4 px-4 py-3 rounded-2xl bg-white/15 border border-white/20 backdrop-blur-sm`}>
								<div>
									<p className='text-lg font-semibold text-amber-200'>{s.label}</p>
									<p className='text-2xl font-extrabold text-center text-white'>{s.value}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* ── Main content ── */}
			<div className='relative z-20 max-w-6xl px-6 mx-auto -mt-16'>
				<div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
					{/* ── LEFT: Submit form ── */}
					<Reveal className='lg:col-span-2'>
						<div className='sticky p-6 bg-white border border-orange-100 shadow-2xl rounded-3xl sm:p-8 top-24'>
							<div className='flex items-center gap-3 mb-6'>
								<div className='flex items-center justify-center w-12 h-12 border rounded-xl bg-amber-50 border-amber-100'>
									<svg
										className='w-6 h-6 text-amber-600'
										fill='none'
										stroke='currentColor'
										strokeWidth='2'
										viewBox='0 0 24 24'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
										/>
									</svg>
								</div>
								<div className='-mb-4'>
									<h2 className='text-sm font-bold text-slate-900'>Leave a Review</h2>
									<p className='text-xs text-slate-400'>Takes less than a minute</p>
								</div>
							</div>

							{submitted ?
								<div className='flex flex-col items-center gap-3 py-8 text-center'>
									<div className='flex items-center justify-center border w-14 h-14 rounded-2xl bg-amber-50 border-amber-100'>
										<svg
											className='w-7 h-7 text-amber-500'
											fill='none'
											stroke='currentColor'
											strokeWidth='2.5'
											viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												d='M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
											/>
										</svg>
									</div>
									<div>
										<p className='text-sm font-bold text-slate-800'>Thank You!</p>
										<p className='text-xs text-slate-500 mt-0.5'>
											Your feedback has been submitted and is now visible on the wall.
										</p>
									</div>
									<button
										type='button'
										onClick={() => setSubmitted(false)}
										className='px-5 py-2 mt-2 text-xs font-bold transition-colors border text-amber-700 border-amber-200 rounded-xl bg-amber-50 hover:bg-amber-100'>
										Submit Another
									</button>
								</div>
							:	<form onSubmit={handleSubmit} className='space-y-4'>
									{/* Anonymous toggle */}
									<label className='flex items-center justify-between gap-2 px-4 py-2 border cursor-pointer rounded-xl bg-slate-50 border-slate-100'>
										<div>
											<p className='text-xs font-bold text-slate-700'>Submit Anonymously</p>
											<p className='text-[10px] -mt-3 text-slate-400 -mb-1'>Your name will not appear publicly</p>
										</div>
										<div
											onClick={() => {
												const next = !isAnonymous;
												setIsAnonymous(next);
												if (next) {
													setName("");
													setEmail("");
												} else {
													setName(currentUser?.name || "");
													setEmail(currentUser?.email || "");
												}
											}}
											className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${isAnonymous ? "bg-amber-500" : "bg-slate-200"}`}>
											<div
												className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isAnonymous ? "translate-x-5" : "translate-x-0.5"}`}
											/>
										</div>
									</label>

									{/* Name + Email */}
									{!isAnonymous && (
										<div className='grid grid-cols-1 gap-3'>
											<div>
												<label className='block mb-1 text-xs font-bold text-slate-700'>Name</label>
												<input
													type='text'
													value={name}
													onChange={(e) => setName(e.target.value)}
													readOnly={isLoggedIn}
													placeholder='Your name'
													className={`w-full px-3 py-2 text-sm border rounded-xl ${isLoggedIn ? "bg-slate-50 text-slate-500 border-slate-100" : "bg-white border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"} focus:outline-none`}
												/>
											</div>
											<div>
												<label className='block mb-1 text-xs font-bold text-slate-700'>
													Email <span className='font-normal text-slate-400'>(not shown publicly)</span>
												</label>
												<input
													type='email'
													value={email}
													onChange={(e) => setEmail(e.target.value)}
													readOnly={isLoggedIn}
													placeholder='Your email'
													className={`w-full px-3 py-2 text-sm border rounded-xl ${isLoggedIn ? "bg-slate-50 text-slate-500 border-slate-100" : "bg-white border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"} focus:outline-none`}
												/>
											</div>
										</div>
									)}

									{/* Section */}
									<div>
										<label className='block mb-2 text-xs font-bold text-slate-700'>Section</label>
										<div className='flex flex-wrap gap-2'>
											{SECTIONS.map((s) => (
												<button
													key={s.id}
													type='button'
													onClick={() => setSection(s.id)}
													className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 ${
														section === s.id ?
															"bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/30"
														:	"bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700"
													}`}>
													{s.label}
												</button>
											))}
										</div>
									</div>

									{/* Star rating */}
									<div>
										<label className='block mb-2 text-xs font-bold text-slate-700'>
											Rating <span className='text-red-400'>*</span>
										</label>
										<StarRating value={rating} onChange={setRating} size='lg' />
										{rating > 0 && (
											<p className='mt-1 text-xs font-semibold text-amber-600'>
												{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
											</p>
										)}
									</div>

									{/* Message */}
									<div>
										<label className='block mb-1 text-xs font-bold text-slate-700'>
											Your Feedback <span className='text-red-400'>*</span>
										</label>
										<textarea
											value={message}
											onChange={(e) => setMessage(e.target.value)}
											placeholder='Share your experience with UniFinderLK...'
											rows={4}
											className='w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl resize-none bg-slate-50 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none placeholder:text-slate-300'
										/>
										<div className='flex justify-between mt-1'>
											<p className={`text-xs ${message.length >= 10 ? "text-amber-600" : "text-slate-400"}`}>
												{message.length >= 10 ? "Looks good!" : `${10 - message.length} more characters needed`}
											</p>
											<p className='text-xs text-slate-400'>{message.length}/1000</p>
										</div>
									</div>

									{/* Error */}
									{formError && (
										<div className='flex items-center gap-2 px-3 py-2.5 text-xs font-medium text-red-700 border border-red-200 rounded-xl bg-red-50'>
											<svg
												className='flex-shrink-0 w-4 h-4'
												fill='none'
												stroke='currentColor'
												strokeWidth='2'
												viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z'
												/>
											</svg>
											{formError}
										</div>
									)}

									{/* Submit */}
									<button
										type='submit'
										disabled={submitting}
										className={`w-full py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
											submitting ?
												"bg-slate-100 text-slate-400 cursor-not-allowed"
											:	"bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
										}`}>
										{submitting ? "Submitting..." : "Submit Feedback"}
									</button>
								</form>
							}
						</div>
					</Reveal>

					{/* ── RIGHT: Public wall ── */}
					<div className='space-y-4 lg:col-span-3'>
						{/* Filter bar */}
						<Reveal>
							<div className='flex flex-wrap items-center gap-2 p-4 bg-white border shadow-sm border-slate-100 rounded-2xl'>
								<span className='mr-1 text-xs font-bold text-slate-500'>Filter by section:</span>
								{[{ id: "all", label: "All" }, ...SECTIONS].map((s) => (
									<button
										key={s.id}
										type='button'
										onClick={() => setWallSection(s.id)}
										className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 ${
											wallSection === s.id ?
												"bg-amber-500 text-white border-amber-500"
											:	"bg-white text-slate-500 border-slate-200 hover:border-amber-300"
										}`}>
										{s.label}
									</button>
								))}
							</div>
						</Reveal>

						{/* Cards */}
						{wallLoading ?
							<div className='flex items-center justify-center gap-2 py-16 text-slate-400'>
								<svg className='w-5 h-5 animate-spin' fill='none' viewBox='0 0 24 24'>
									<circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
									<path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
								</svg>
								<span className='text-sm font-medium'>Loading feedback...</span>
							</div>
						: wallError ?
							<div className='py-10 text-sm text-center text-red-500'>{wallError}</div>
						: feedbacks.length === 0 ?
							<Reveal>
								<div className='flex flex-col items-center gap-3 py-16 text-center border-2 border-dashed border-amber-200 bg-amber-50/40 rounded-3xl'>
									<div className='flex items-center justify-center border w-14 h-14 rounded-2xl bg-amber-100 border-amber-200'>
										<svg className='w-7 h-7 text-amber-400' fill='currentColor' viewBox='0 0 24 24'>
											<path d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' />
										</svg>
									</div>
									<p className='text-sm font-bold text-slate-700'>No feedback yet</p>
									<p className='text-xs text-slate-400'>Be the first to share your experience!</p>
								</div>
							</Reveal>
						:	<>
								<div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
									{feedbacks.map((fb, i) => (
										<Reveal key={fb._id} delay={i * 0.04}>
											<FeedbackCard feedback={fb} />
										</Reveal>
									))}
								</div>

								{/* Pagination */}
								{pagination && pagination.pages > 1 && (
									<Reveal>
										<div className='flex items-center justify-center gap-2 pt-2'>
											<button
												disabled={page === 1}
												onClick={() => setPage((p) => p - 1)}
												className='px-4 py-2 text-xs font-bold transition-colors bg-white border rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'>
												Previous
											</button>
											<span className='text-xs font-medium text-slate-500'>
												Page {page} of {pagination.pages}
											</span>
											<button
												disabled={page >= pagination.pages}
												onClick={() => setPage((p) => p + 1)}
												className='px-4 py-2 text-xs font-bold transition-colors bg-white border rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'>
												Next
											</button>
										</div>
									</Reveal>
								)}
							</>
						}
					</div>
				</div>
			</div>
		</div>
	);
}
