/**
 * Custom operational error class.
 * Distinguishes expected errors (bad input, not found) from
 * unexpected programming bugs so the global handler can respond appropriately.
 */
class AppError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.isOperational = true;

		Error.captureStackTrace(this, this.constructor);
	}
}

module.exports = AppError;
