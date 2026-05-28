const AppError = require("../utils/AppError");

/**
 * Handle specific Mongoose/MongoDB errors and convert them into
 * user-friendly AppError instances.
 */
const handleCastErrorDB = (err) => new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err) => {
	const field = Object.keys(err.keyValue || {})[0] || "field";
	return new AppError(`Duplicate value for "${field}". Please use another value.`, 409);
};

const handleValidationErrorDB = (err) => {
	const messages = Object.values(err.errors).map((e) => e.message);
	return new AppError(`Validation failed: ${messages.join(". ")}`, 400);
};

const handleJWTError = () => new AppError("Invalid token. Please sign in again.", 401);

const handleJWTExpiredError = () => new AppError("Your session has expired. Please sign in again.", 401);

/**
 * Send detailed error info in development.
 */
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		success: false,
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
};

/**
 * Send sanitized error in production — never leak stack traces.
 */
const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		// Trusted operational error — safe to show message
		res.status(err.statusCode).json({
			success: false,
			status: err.status,
			message: err.message,
		});
	} else {
		// Unknown/programming error — don't leak details
		console.error("💥 ERROR:", err);
		res.status(500).json({
			success: false,
			status: "error",
			message: "Something went wrong. Please try again later.",
		});
	}
};

/**
 * Global Express error handler.
 * Must have 4 parameters so Express recognizes it as an error handler.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	if (process.env.NODE_ENV === "production") {
		let error = { ...err, message: err.message, name: err.name };

		if (err.name === "CastError") error = handleCastErrorDB(error);
		if (err.code === 11000) error = handleDuplicateFieldsDB(error);
		if (err.name === "ValidationError") error = handleValidationErrorDB(error);
		if (err.name === "JsonWebTokenError") error = handleJWTError();
		if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

		sendErrorProd(error, res);
	} else {
		sendErrorDev(err, res);
	}
};

module.exports = errorHandler;
