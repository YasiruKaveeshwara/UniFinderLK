const Feedback = require("../models/Feedback");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// ── POST /api/feedback ────────────────────────────────────────────────────────
// Public — works for guests and logged-in users
const createFeedback = catchAsync(async (req, res, next) => {
	const { name, email, rating, section, message, isAnonymous } = req.body;

	if (!rating || rating < 1 || rating > 5) {
		return next(new AppError("Rating must be between 1 and 5.", 400));
	}
	if (!message || message.trim().length < 10) {
		return next(new AppError("Feedback message must be at least 10 characters.", 400));
	}

	const feedback = await Feedback.create({
		userId: req.user ? req.user._id : null,
		name: isAnonymous ? "" : name || (req.user ? req.user.name : ""),
		email: isAnonymous ? "" : email || (req.user ? req.user.email : ""),
		rating: Number(rating),
		section: section || "general",
		message: message.trim(),
		isAnonymous: Boolean(isAnonymous),
	});

	res.status(201).json({ success: true, data: feedback });
});

// ── GET /api/feedback ─────────────────────────────────────────────────────────
// Public — returns all feedback, email never exposed
const getAllFeedback = catchAsync(async (req, res) => {
	const page = Math.max(1, parseInt(req.query.page) || 1);
	const limit = Math.min(50, parseInt(req.query.limit) || 20);
	const skip = (page - 1) * limit;

	const filter = {};
	if (req.query.section && ["general", "ol_system", "al_system"].includes(req.query.section)) {
		filter.section = req.query.section;
	}

	const [feedbacks, total] = await Promise.all([
		Feedback.find(filter)
			.select("-email") // Never expose email publicly
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean(),
		Feedback.countDocuments(filter),
	]);

	// Mask name for anonymous entries
	const publicFeedbacks = feedbacks.map((f) => ({
		...f,
		name: f.isAnonymous ? "Anonymous" : f.name || "User",
	}));

	res.status(200).json({
		success: true,
		data: publicFeedbacks,
		pagination: { page, limit, total, pages: Math.ceil(total / limit) },
	});
});

// ── GET /api/feedback/mine ────────────────────────────────────────────────────
// Protected — returns the current user's own feedback (with edit window info)
const getMyFeedback = catchAsync(async (req, res) => {
	const feedbacks = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();

	const now = Date.now();
	const withEditWindow = feedbacks.map((f) => ({
		...f,
		canEdit: now - new Date(f.createdAt).getTime() < SEVEN_DAYS_MS,
	}));

	res.status(200).json({ success: true, data: withEditWindow });
});

// ── PATCH /api/feedback/:id ───────────────────────────────────────────────────
// Protected — edit own feedback within 7 days
const updateFeedback = catchAsync(async (req, res, next) => {
	const feedback = await Feedback.findById(req.params.id);

	if (!feedback) return next(new AppError("Feedback not found.", 404));
	if (!feedback.userId || feedback.userId.toString() !== req.user._id.toString()) {
		return next(new AppError("You can only edit your own feedback.", 403));
	}

	const ageMs = Date.now() - new Date(feedback.createdAt).getTime();
	if (ageMs > SEVEN_DAYS_MS) {
		return next(new AppError("Feedback can only be edited within 7 days of submission.", 403));
	}

	const { rating, section, message, isAnonymous, name } = req.body;

	if (rating !== undefined) feedback.rating = Number(rating);
	if (section !== undefined) feedback.section = section;
	if (message !== undefined) feedback.message = message.trim();
	if (isAnonymous !== undefined) {
		feedback.isAnonymous = Boolean(isAnonymous);
		feedback.name = feedback.isAnonymous ? "" : name || req.user.name || "";
	} else if (name !== undefined) {
		feedback.name = name;
	}

	await feedback.save();

	res.status(200).json({
		success: true,
		data: { ...feedback.toObject(), canEdit: true },
	});
});

// ── DELETE /api/feedback/:id ──────────────────────────────────────────────────
// Protected — delete own feedback
const deleteFeedback = catchAsync(async (req, res, next) => {
	const feedback = await Feedback.findById(req.params.id);

	if (!feedback) return next(new AppError("Feedback not found.", 404));
	if (!feedback.userId || feedback.userId.toString() !== req.user._id.toString()) {
		return next(new AppError("You can only delete your own feedback.", 403));
	}

	await feedback.deleteOne();

	res.status(200).json({ success: true, message: "Feedback deleted." });
});

module.exports = { createFeedback, getAllFeedback, getMyFeedback, updateFeedback, deleteFeedback };
