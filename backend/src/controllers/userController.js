const User = require("../models/User");
const AcademicProfile = require("../models/AcademicProfile");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

// ── GET /api/user/profile ─────────────────────────────────────────────────────
const getProfile = catchAsync(async (req, res) => {
	const user = await User.findById(req.user._id);

	res.status(200).json({
		success: true,
		...user.toJSON(),
	});
});

// ── PUT /api/user/profile ─────────────────────────────────────────────────────
const updateProfile = catchAsync(async (req, res, next) => {
	const { name, email, password } = req.body;

	const user = await User.findById(req.user._id).select("+password");
	if (!user) {
		return next(new AppError("User not found.", 404));
	}

	// Check if new email is already taken by another user
	if (email && email.toLowerCase() !== user.email) {
		const existingUser = await User.findOne({ email: email.toLowerCase() });
		if (existingUser) {
			return next(new AppError("Email is already in use by another account.", 409));
		}
		user.email = email;
	}

	if (name) user.name = name;
	if (password) user.password = password; // Pre-save hook will hash it

	// Update avatar if name changed
	if (name) {
		user.avatar = `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(name)}`;
	}

	await user.save();

	res.status(200).json({
		success: true,
		...user.toJSON(),
	});
});

// ── DELETE /api/user/profile ──────────────────────────────────────────────────
const deleteProfile = catchAsync(async (req, res) => {
	// Delete academic profile first, then the user account
	await AcademicProfile.findOneAndDelete({ user: req.user._id });
	await User.findByIdAndDelete(req.user._id);

	// Clear the auth cookie
	res.cookie("access_token", "", {
		httpOnly: true,
		expires: new Date(0),
		path: "/",
	});

	res.status(200).json({
		success: true,
		message: "Account deleted successfully.",
	});
});

module.exports = { getProfile, updateProfile, deleteProfile };
