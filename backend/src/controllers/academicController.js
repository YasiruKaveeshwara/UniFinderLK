const AcademicProfile = require("../models/AcademicProfile");
const catchAsync = require("../utils/catchAsync");

/**
 * Helper: Find or create an academic profile for the authenticated user.
 */
const findOrCreateProfile = async (userId) => {
	let profile = await AcademicProfile.findOne({ user: userId });
	if (!profile) {
		profile = await AcademicProfile.create({ user: userId });
	}
	return profile;
};

// ── GET /api/academic/profile ─────────────────────────────────────────────────
const getAcademicProfile = catchAsync(async (req, res) => {
	const profile = await findOrCreateProfile(req.user._id);

	res.status(200).json({
		success: true,
		data: profile,
	});
});

// ── PUT /api/academic/ol-subjects ─────────────────────────────────────────────
const updateOLSubjects = catchAsync(async (req, res) => {
	const profile = await findOrCreateProfile(req.user._id);

	const { core, bucket_1, bucket_2, bucket_3 } = req.body;

	if (core) {
		// Merge incoming core grades with existing ones
		profile.olSubjects.core = {
			...profile.olSubjects.core.toObject(),
			...core,
		};
	}
	if (bucket_1 !== undefined) profile.olSubjects.bucket_1 = bucket_1;
	if (bucket_2 !== undefined) profile.olSubjects.bucket_2 = bucket_2;
	if (bucket_3 !== undefined) profile.olSubjects.bucket_3 = bucket_3;

	await profile.save();

	res.status(200).json({
		success: true,
		data: profile,
	});
});

// ── PUT /api/academic/al-subjects ─────────────────────────────────────────────
const updateALSubjects = catchAsync(async (req, res) => {
	const profile = await findOrCreateProfile(req.user._id);

	const { stream, subjects, district, zscore, interests } = req.body;

	if (stream !== undefined) profile.alSubjects.stream = stream;
	if (subjects !== undefined) profile.alSubjects.subjects = subjects;
	if (district !== undefined) profile.alSubjects.district = district;
	if (zscore !== undefined) profile.alSubjects.zscore = zscore;
	if (interests !== undefined) profile.alSubjects.interests = interests;

	await profile.save();

	res.status(200).json({
		success: true,
		data: profile,
	});
});

// ── DELETE /api/academic/profile ──────────────────────────────────────────────
const deleteAcademicProfile = catchAsync(async (req, res) => {
	await AcademicProfile.findOneAndDelete({ user: req.user._id });

	res.status(200).json({
		success: true,
		message: "Academic profile deleted successfully.",
	});
});

module.exports = { getAcademicProfile, updateOLSubjects, updateALSubjects, deleteAcademicProfile };
