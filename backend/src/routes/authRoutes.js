const express = require("express");
const { signup, signin, signout } = require("../controllers/authController");
const { signupRules, signinRules } = require("../validators/authValidator");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/signup", signupRules, validate, signup);
router.post("/signin", signinRules, validate, signin);
router.get("/signout", signout);

module.exports = router;
