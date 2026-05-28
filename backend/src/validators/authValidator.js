const { body } = require("express-validator");

const signupRules = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.isLength({ max: 100 })
		.withMessage("Name cannot exceed 100 characters"),
	body("email").trim().isEmail().withMessage("Please provide a valid email address").normalizeEmail(),
	body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const signinRules = [
	body("email").trim().notEmpty().withMessage("Email is required"),
	body("password").notEmpty().withMessage("Password is required"),
];

const updateProfileRules = [
	body("name").optional().trim().isLength({ max: 100 }).withMessage("Name cannot exceed 100 characters"),
	body("email").optional().trim().isEmail().withMessage("Please provide a valid email address").normalizeEmail(),
	body("password").optional().isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

module.exports = { signupRules, signinRules, updateProfileRules };
