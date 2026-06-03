const mongoose = require("mongoose");

// ── Grade enum (Sri Lankan O/L grading scale) ─────────────────────────────────
const GRADE_ENUM = ["A", "B", "C", "S", "W", ""];

// ── Sub-schema for a single O/L core subject ──────────────────────────────────
const coreSubjectSchema = new mongoose.Schema(
	{
		religion: { type: String, enum: GRADE_ENUM, default: "" },
		first_language: { type: String, enum: GRADE_ENUM, default: "" },
		mathematics: { type: String, enum: GRADE_ENUM, default: "" },
		science: { type: String, enum: GRADE_ENUM, default: "" },
		english: { type: String, enum: GRADE_ENUM, default: "" },
		history: { type: String, enum: GRADE_ENUM, default: "" },
		bucket_1_grade: { type: String, enum: GRADE_ENUM, default: "" },
		bucket_2_grade: { type: String, enum: GRADE_ENUM, default: "" },
		bucket_3_grade: { type: String, enum: GRADE_ENUM, default: "" },
	},
	{ _id: false },
);

// ── Sub-schema for O/L subjects ───────────────────────────────────────────────
const olSubjectsSchema = new mongoose.Schema(
	{
		core: { type: coreSubjectSchema, default: () => ({}) },
		bucket_1: { type: String, default: "" },
		bucket_2: { type: String, default: "" },
		bucket_3: { type: String, default: "" },
	},
	{ _id: false },
);

// ── Sub-schema for A/L subjects ───────────────────────────────────────────────
const alSubjectsSchema = new mongoose.Schema(
	{
		stream: {
			type: String,
			trim: true,
			default: "",
		},
		subjects: {
			type: [String],
			default: [],
			validate: {
				validator: (arr) => arr.length <= 3,
				message: "A/L subjects cannot exceed 3",
			},
		},
		district: {
			type: String,
			trim: true,
			default: "",
		},
		zscore: {
			type: Number,
			min: [-3, "Z-score cannot be less than -3"],
			max: [3, "Z-score cannot exceed 3"],
			default: null,
		},
		interests: {
			type: String,
			trim: true,
			maxlength: [2000, "Interests text cannot exceed 2000 characters"],
			default: "",
		},
	},
	{ _id: false },
);

// ── Main academic profile schema ──────────────────────────────────────────────
const academicProfileSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true, // One academic profile per user
			index: true,
		},
		olSubjects: {
			type: olSubjectsSchema,
			default: () => ({}),
		},
		alSubjects: {
			type: alSubjectsSchema,
			default: () => ({}),
		},
	},
	{
		timestamps: true,
	},
);

const AcademicProfile = mongoose.model("AcademicProfile", academicProfileSchema);

module.exports = AcademicProfile;
