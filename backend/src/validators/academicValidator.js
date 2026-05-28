const { body } = require("express-validator");

const VALID_GRADES = ["A", "B", "C", "S", "W", ""];

const olSubjectsRules = [
	body("core").optional().isObject().withMessage("Core subjects must be an object"),
	body("core.religion").optional().isIn(VALID_GRADES).withMessage("Invalid grade for religion"),
	body("core.first_language").optional().isIn(VALID_GRADES).withMessage("Invalid grade for first language"),
	body("core.mathematics").optional().isIn(VALID_GRADES).withMessage("Invalid grade for mathematics"),
	body("core.science").optional().isIn(VALID_GRADES).withMessage("Invalid grade for science"),
	body("core.english").optional().isIn(VALID_GRADES).withMessage("Invalid grade for English"),
	body("core.history").optional().isIn(VALID_GRADES).withMessage("Invalid grade for history"),
	body("core.bucket_1_grade").optional().isIn(VALID_GRADES).withMessage("Invalid grade for basket 1"),
	body("core.bucket_2_grade").optional().isIn(VALID_GRADES).withMessage("Invalid grade for basket 2"),
	body("core.bucket_3_grade").optional().isIn(VALID_GRADES).withMessage("Invalid grade for basket 3"),
	body("bucket_1").optional().isString().withMessage("Basket 1 subject must be a string"),
	body("bucket_2").optional().isString().withMessage("Basket 2 subject must be a string"),
	body("bucket_3").optional().isString().withMessage("Basket 3 subject must be a string"),
];

const alSubjectsRules = [
	body("stream").optional().trim().isString().withMessage("Stream must be a string"),
	body("subjects").optional().isArray({ max: 3 }).withMessage("A/L subjects must be an array of at most 3"),
	body("subjects.*").optional().isString().withMessage("Each subject must be a string"),
	body("district").optional().trim().isString().withMessage("District must be a string"),
	body("zscore")
		.optional({ nullable: true })
		.isFloat({ min: -3, max: 3 })
		.withMessage("Z-score must be between -3 and 3"),
	body("interests").optional().trim().isLength({ max: 2000 }).withMessage("Interests cannot exceed 2000 characters"),
];

module.exports = { olSubjectsRules, alSubjectsRules };
