const express = require("express");
const {
	getAcademicProfile,
	updateOLSubjects,
	updateALSubjects,
	deleteAcademicProfile,
} = require("../controllers/academicController");
const { olSubjectsRules, alSubjectsRules } = require("../validators/academicValidator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All academic routes require authentication
router.use(protect);

router.get("/profile", getAcademicProfile);
router.put("/ol-subjects", olSubjectsRules, validate, updateOLSubjects);
router.put("/al-subjects", alSubjectsRules, validate, updateALSubjects);
router.delete("/profile", deleteAcademicProfile);

module.exports = router;
