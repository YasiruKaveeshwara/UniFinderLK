const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Soft auth middleware.
 * Attaches req.user if a valid JWT cookie is present,
 * but does NOT block the request if unauthenticated.
 * Used for public routes that benefit from knowing the user identity.
 */
const softProtect = async (req, res, next) => {
	try {
		const token = req.cookies?.access_token;
		if (!token) return next();

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.id);
		if (user) req.user = user;
	} catch (_) {
		// Token invalid or expired — proceed as guest
	}
	next();
};

module.exports = { softProtect };
