const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/User");

/**
 * Middleware: Verify JWT from the access_token cookie.
 * Attaches the authenticated user to req.user on success.
 */
const protect = async (req, res, next) => {
	try {
		const token = req.cookies?.access_token;

		if (!token) {
			return next(new AppError("You are not logged in. Please sign in to continue.", 401));
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Check if user still exists (handles deleted accounts)
		const user = await User.findById(decoded.id);
		if (!user) {
			return next(new AppError("The user belonging to this token no longer exists.", 401));
		}

		// Grant access
		req.user = user;
		next();
	} catch (err) {
		if (err.name === "JsonWebTokenError") {
			return next(new AppError("Invalid token. Please sign in again.", 401));
		}
		if (err.name === "TokenExpiredError") {
			return next(new AppError("Your session has expired. Please sign in again.", 401));
		}
		return next(err);
	}
};

module.exports = { protect };
