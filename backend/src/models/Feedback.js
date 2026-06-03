const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			default: null,
		},
		name: {
			type: String,
			trim: true,
			maxlength: [80, "Name cannot exceed 80 characters"],
			default: "",
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			default: "",
		},
		rating: {
			type: Number,
			required: [true, "Rating is required"],
			min: [1, "Rating must be at least 1"],
			max: [5, "Rating cannot exceed 5"],
		},
		section: {
			type: String,
			enum: {
				values: ["general", "ol_system", "al_system"],
				message: "Section must be general, ol_system, or al_system",
			},
			required: [true, "Section is required"],
			default: "general",
		},
		message: {
			type: String,
			required: [true, "Feedback message is required"],
			trim: true,
			minlength: [10, "Feedback must be at least 10 characters"],
			maxlength: [1000, "Feedback cannot exceed 1000 characters"],
		},
		isAnonymous: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	},
);

feedbackSchema.index({ createdAt: -1 });
feedbackSchema.index({ userId: 1 });

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
