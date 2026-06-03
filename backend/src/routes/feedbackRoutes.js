const express = require("express");
const {
	createFeedback,
	getAllFeedback,
	getMyFeedback,
	updateFeedback,
	deleteFeedback,
} = require("../controllers/feedbackController");
const { protect } = require("../middleware/auth");
const { softProtect } = require("../middleware/softAuth");

const router = express.Router();

// Public routes (guests + logged-in users)
router.get("/", softProtect, getAllFeedback);
router.post("/", softProtect, createFeedback);

// Protected routes (logged-in users only)
router.get("/mine", protect, getMyFeedback);
router.patch("/:id", protect, updateFeedback);
router.delete("/:id", protect, deleteFeedback);

module.exports = router;
