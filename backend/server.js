const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");
const AppError = require("./src/utils/AppError");

// Route imports
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const academicRoutes = require("./src/routes/academicRoutes");

// ── Load environment variables ────────────────────────────────────────────────
dotenv.config();

// ── Create Express app ────────────────────────────────────────────────────────
const app = express();

// ── Security: Helmet (HTTP security headers) ──────────────────────────────────
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:3000").split(",").map((o) => o.trim());

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (mobile apps, server-to-server, curl)
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new AppError(`Origin ${origin} not allowed by CORS`, 403));
			}
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

// ── Rate limiting ─────────────────────────────────────────────────────────────
const generalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	message: { success: false, message: "Too many requests. Please try again later." },
	standardHeaders: true,
	legacyHeaders: false,
});

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 20,
	message: { success: false, message: "Too many authentication attempts. Please try again later." },
	standardHeaders: true,
	legacyHeaders: false,
});

app.use("/api/", generalLimiter);
app.use("/api/auth/", authLimiter);

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Logging (development only) ────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
	res.status(200).json({ status: "ok", service: "unifinderlk-backend" });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/academic", academicRoutes);

// ── 404 handler for undefined routes ──────────────────────────────────────────
app.all("*", (req, res, next) => {
	next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server.`, 404));
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
	await connectDB();
	app.listen(PORT, () => {
		console.log(`✓ Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
	});
};

startServer();

module.exports = app;
