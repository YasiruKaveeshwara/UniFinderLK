import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
// type: "success" | "error" | "warning" | "info"

const ToastContext = createContext(null);

let nextId = 1;

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([]);

	const addToast = useCallback(({ type = "info", title, message, duration = 4500 }) => {
		const id = nextId++;
		setToasts((prev) => [...prev, { id, type, title, message, duration, exiting: false }]);
		return id;
	}, []);

	const removeToast = useCallback((id) => {
		// Mark as exiting first (triggers exit animation)
		setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 350);
	}, []);

	// Convenience methods
	const toast = {
		success: (title, message, duration) => addToast({ type: "success", title, message, duration }),
		error: (title, message, duration) => addToast({ type: "error", title, message, duration: duration ?? 6000 }),
		warning: (title, message, duration) => addToast({ type: "warning", title, message, duration }),
		info: (title, message, duration) => addToast({ type: "info", title, message, duration }),
	};

	return (
		<ToastContext.Provider value={toast}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
	return ctx;
}

// ── Config ────────────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
	success: {
		bar: "bg-emerald-500",
		icon: (
			<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
				/>
			</svg>
		),
		iconBg: "bg-emerald-100 text-emerald-600",
		titleColor: "text-emerald-900",
		msgColor: "text-emerald-700",
		border: "border-emerald-200",
	},
	error: {
		bar: "bg-red-500",
		icon: (
			<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z'
				/>
			</svg>
		),
		iconBg: "bg-red-100 text-red-600",
		titleColor: "text-red-900",
		msgColor: "text-red-700",
		border: "border-red-200",
	},
	warning: {
		bar: "bg-amber-400",
		icon: (
			<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.378c.866-1.5 3.032-1.5 3.898 0l8.353 13.376ZM12 15.75h.007v.008H12v-.008Z'
				/>
			</svg>
		),
		iconBg: "bg-amber-100 text-amber-600",
		titleColor: "text-amber-900",
		msgColor: "text-amber-700",
		border: "border-amber-200",
	},
	info: {
		bar: "bg-blue-500",
		icon: (
			<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z'
				/>
			</svg>
		),
		iconBg: "bg-blue-100 text-blue-600",
		titleColor: "text-blue-900",
		msgColor: "text-blue-700",
		border: "border-blue-200",
	},
};

// ── Single Toast ──────────────────────────────────────────────────────────────
function Toast({ toast, onRemove }) {
	const cfg = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
	const timerRef = useRef(null);
	const [progress, setProgress] = useState(100);
	const startTime = useRef(Date.now());

	useEffect(() => {
		const duration = toast.duration;

		const tick = () => {
			const elapsed = Date.now() - startTime.current;
			const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
			setProgress(remaining);
			if (remaining <= 0) {
				onRemove(toast.id);
			} else {
				timerRef.current = requestAnimationFrame(tick);
			}
		};

		timerRef.current = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(timerRef.current);
	}, [toast.id, toast.duration, onRemove]);

	return (
		<div
			className={`
				relative flex items-start gap-3 w-full max-w-sm bg-white rounded-2xl shadow-xl
				border ${cfg.border} overflow-hidden
				transition-all duration-350 ease-out
				${toast.exiting ? "opacity-0 translate-x-6 scale-95" : "opacity-100 translate-x-0 scale-100"}
			`}
			style={{ transition: "opacity 350ms, transform 350ms" }}>
			{/* Side accent bar */}
			<div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${cfg.bar}`} />

			{/* Icon */}
			<div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl ml-4 mt-3.5 ${cfg.iconBg}`}>
				{cfg.icon}
			</div>

			{/* Text */}
			<div className='flex-1 py-3.5 pr-2 min-w-0'>
				{toast.title && <p className={`text-sm font-bold leading-tight ${cfg.titleColor}`}>{toast.title}</p>}
				{toast.message && (
					<p className={`text-xs leading-relaxed mt-0.5 ${cfg.msgColor} ${toast.title ? "" : "font-semibold"}`}>
						{toast.message}
					</p>
				)}
			</div>

			{/* Close button */}
			<button
				onClick={() => onRemove(toast.id)}
				className='flex-shrink-0 mt-2.5 mr-2.5 p-1 border-none outline-none focus:outline-none rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors'>
				<svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'>
					<path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
				</svg>
			</button>

			{/* Progress bar */}
			<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100'>
				<div
					className={`h-full ${cfg.bar} transition-none rounded-full`}
					style={{ width: `${progress}%`, transition: "width 100ms linear" }}
				/>
			</div>
		</div>
	);
}

// ── Container ─────────────────────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
	if (toasts.length === 0) return null;
	return (
		<div
			className='fixed top-20 right-4 z-[9999] flex flex-col gap-2.5 items-end pointer-events-none'
			aria-live='polite'
			aria-label='Notifications'>
			{toasts.map((t) => (
				<div key={t.id} className='w-full max-w-sm pointer-events-auto'>
					<Toast toast={t} onRemove={onRemove} />
				</div>
			))}
		</div>
	);
}
