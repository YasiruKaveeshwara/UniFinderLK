const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

/**
 * Generate a signed JWT for the given user ID.
 */
const signToken = (id) =>
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || "7d",
	});

/**
 * Create JWT, set it as an HTTP-only cookie, and send response.
 */
const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	const cookieOptions = {
		expires: new Date(Date.now() + (parseInt(process.env.COOKIE_EXPIRES_IN, 10) || 7) * 24 * 60 * 60 * 1000),
		httpOnly: true,
		sameSite: "lax",
		path: "/",
	};

	// Secure cookies in production
	if (process.env.NODE_ENV === "production") {
		cookieOptions.secure = true;
		cookieOptions.sameSite = "none";
	}

	res.cookie("access_token", token, cookieOptions);

	// Remove password from output
	const userObj = user.toJSON();

	res.status(statusCode).json({
		success: true,
		...userObj,
	});
};

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
const signup = catchAsync(async (req, res, next) => {
	const { name, email, password } = req.body;

	// Check if user already exists
	const existingUser = await User.findOne({ email: email.toLowerCase() });
	if (existingUser) {
		return next(new AppError("An account with this email already exists.", 409));
	}

	const user = await User.create({ name, email, password });

	// Auto-generate avatar from name
	user.avatar = `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(name)}`;
	await user.save({ validateBeforeSave: false });

	createSendToken(user, 201, res);
});

// ── POST /api/auth/signin ─────────────────────────────────────────────────────
const signin = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	// Find user and explicitly select password field
	const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

	if (!user || !(await user.comparePassword(password))) {
		return next(new AppError("Invalid email or password.", 401));
	}

	createSendToken(user, 200, res);
});

// ── GET /api/auth/signout ─────────────────────────────────────────────────────
const signout = (req, res) => {
	res.cookie("access_token", "", {
		httpOnly: true,
		expires: new Date(0),
		path: "/",
	});

	res.status(200).json({ success: true, message: "Signed out successfully." });
};

module.exports = { signup, signin, signout };
