const express = require("express");
const { getProfile, updateProfile, deleteProfile } = require("../controllers/userController");
const { updateProfileRules } = require("../validators/authValidator");
const validate = require("../middleware/validate");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfileRules, validate, updateProfile);
router.delete("/profile", deleteProfile);

module.exports = router;
