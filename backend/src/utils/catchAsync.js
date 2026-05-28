/**
 * Wraps an async controller function so that any rejected promise
 * is automatically forwarded to the Express error handler.
 * Eliminates try-catch boilerplate in every controller.
 *
 * Usage:
 *   router.get("/", catchAsync(async (req, res) => { ... }));
 */
const catchAsync = (fn) => (req, res, next) => {
	fn(req, res, next).catch(next);
};

module.exports = catchAsync;
