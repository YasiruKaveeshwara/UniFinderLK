import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	updateUserStart,
	updateUserSuccess,
	updateUserFailure,
	deleteUserStart,
	deleteUserSuccess,
	deleteUserFailure,
	signout,
} from "../redux/User/userSlice";
import { updateUserProfile, deleteUserAccount } from "../api/userApi";
import { SpinnerIcon, AlertCircleIcon, CheckCircleIcon, UserIcon } from "../components/ui/Icons";
import Reveal from "../components/ui/Reveal";
import OLSubjectsCard from "../components/profile/OLSubjectsCard";
import ALSubjectsCard from "../components/profile/ALSubjectsCard";

export default function ProfilePage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { currentUser, loading, error } = useSelector((state) => state.user);

	const [formData, setFormData] = useState({
		name: currentUser?.name || "",
		email: currentUser?.email || "",
		password: "",
	});
	const [success, setSuccess] = useState("");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
		setSuccess("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSuccess("");

		// Only send changed fields
		const updates = {};
		if (formData.name !== currentUser.name) updates.name = formData.name;
		if (formData.email !== currentUser.email) updates.email = formData.email;
		if (formData.password) updates.password = formData.password;

		if (Object.keys(updates).length === 0) {
			setSuccess("No changes to save.");
			return;
		}

		try {
			dispatch(updateUserStart());
			const data = await updateUserProfile(updates);
			dispatch(updateUserSuccess(data));
			setFormData((prev) => ({ ...prev, password: "" }));
			setSuccess("Profile updated successfully!");
		} catch (err) {
			dispatch(updateUserFailure(err.message));
		}
	};

	const handleDelete = async () => {
		try {
			dispatch(deleteUserStart());
			await deleteUserAccount();
			dispatch(deleteUserSuccess());
			dispatch(signout());
			navigate("/");
		} catch (err) {
			dispatch(deleteUserFailure(err.message));
		}
	};

	const handleLogout = async () => {
		const API_BASE = process.env.REACT_APP_BACKEND_URL;
		try {
			if (API_BASE) await fetch(`${API_BASE}/api/auth/signout`, { credentials: "include" });
		} catch (_) {
			/* ignore */
		}
		dispatch(signout());
		navigate("/signin");
	};

	if (!currentUser) {
		navigate("/signin");
		return null;
	}

	return (
		<div className='flex items-start justify-center min-h-screen px-4 pt-24 pb-12 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/60'>
			{/* Ambient orbs */}
			<div className='absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-300/10 rounded-full blur-[140px] pointer-events-none' />
			<div className='absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[120px] pointer-events-none' />

			<div className='relative z-10 w-full max-w-2xl mx-auto'>
				<Reveal delay={0.1}>
					<div className='p-8 bg-white border shadow-xl sm:p-10 border-slate-200/60 rounded-3xl'>
						{/* Profile header */}
						<div className='flex items-center gap-5 mb-8'>
							<img
								src={currentUser.avatar}
								alt={currentUser.name}
								className='w-16 h-16 border-2 border-indigo-100 rounded-full shadow-md'
								onError={(e) => {
									e.target.src = `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(currentUser.name || "U")}`;
								}}
							/>
							<div>
								<h1 className='text-2xl font-extrabold tracking-tight text-slate-900'>{currentUser.name}</h1>
								<p className='text-sm text-slate-500'>{currentUser.email}</p>
							</div>
						</div>

						{/* Success alert */}
						{success && (
							<div className='flex items-center gap-3 p-4 mb-6 border rounded-xl bg-emerald-50 border-emerald-200/60'>
								<CheckCircleIcon className='w-5 h-5 text-emerald-500 shrink-0' />
								<p className='text-sm font-medium text-emerald-700'>{success}</p>
							</div>
						)}

						{/* Error alert */}
						{error && (
							<div className='flex items-start gap-3 p-4 mb-6 border rounded-xl bg-red-50 border-red-200/60'>
								<AlertCircleIcon className='w-5 h-5 mt-0.5 text-red-500 shrink-0' />
								<p className='text-sm font-medium text-red-700'>{error}</p>
							</div>
						)}

						{/* Edit form */}
						<form onSubmit={handleSubmit} className='space-y-5'>
							<h2 className='text-lg font-bold text-slate-800'>Edit Profile</h2>

							{/* Name */}
							<div>
								<label htmlFor='name' className='block mb-1.5 text-sm font-semibold text-slate-700'>
									Full Name
								</label>
								<input
									type='text'
									id='name'
									value={formData.name}
									onChange={handleChange}
									className='w-full px-4 py-3 text-sm transition-colors border rounded-xl bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:outline-none'
								/>
							</div>

							{/* Email */}
							<div>
								<label htmlFor='email' className='block mb-1.5 text-sm font-semibold text-slate-700'>
									Email Address
								</label>
								<input
									type='email'
									id='email'
									value={formData.email}
									onChange={handleChange}
									className='w-full px-4 py-3 text-sm transition-colors border rounded-xl bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:outline-none'
								/>
							</div>

							{/* Password */}
							<div>
								<label htmlFor='password' className='block mb-1.5 text-sm font-semibold text-slate-700'>
									New Password <span className='font-normal text-slate-400'>(leave blank to keep current)</span>
								</label>
								<div className='relative'>
									<input
										type={showPassword ? "text" : "password"}
										id='password'
										value={formData.password}
										onChange={handleChange}
										placeholder='••••••••'
										className='w-full px-4 py-3 pr-12 text-sm transition-colors border rounded-xl bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:outline-none'
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute -translate-y-1/2 bg-transparent border-0 text-slate-400 hover:text-slate-600 right-3 top-1/2 focus:outline-none'
										aria-label={showPassword ? "Hide password" : "Show password"}>
										{showPassword ?
											<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88'
												/>
											</svg>
										:	<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													d='M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z'
												/>
												<path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z' />
											</svg>
										}
									</button>
								</div>
							</div>

							{/* Save button */}
							<button
								type='submit'
								disabled={loading}
								className={`
									w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold rounded-xl transition-all duration-300
									${loading ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "text-white bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"}
								`}>
								{loading ?
									<>
										<SpinnerIcon className='w-5 h-5 animate-spin' />
										Saving...
									</>
								:	"Save Changes"}
							</button>
						</form>

						{/* Divider */}
						<div className='flex items-center gap-4 my-8'>
							<div className='flex-1 h-px bg-slate-200' />
							<span className='text-xs font-medium text-slate-400'>ACCOUNT ACTIONS</span>
							<div className='flex-1 h-px bg-slate-200' />
						</div>

						{/* Account actions */}
						<div className='flex flex-col gap-3 sm:flex-row'>
							<button
								type='button'
								onClick={handleLogout}
								className='flex-1 px-5 py-3 text-sm font-semibold text-indigo-600 transition-colors border border-indigo-200 rounded-xl bg-indigo-50 hover:bg-indigo-100'>
								Sign Out
							</button>
							<button
								type='button'
								onClick={() => setShowDeleteConfirm(true)}
								className='flex-1 px-5 py-3 text-sm font-semibold text-red-600 transition-colors border border-red-200 rounded-xl bg-red-50 hover:bg-red-100'>
								Delete Account
							</button>
						</div>

						{/* Delete confirmation modal */}
						{showDeleteConfirm && (
							<div className='p-5 mt-4 border rounded-2xl bg-red-50 border-red-200/60'>
								<p className='mb-4 text-sm font-medium text-red-800'>
									Are you sure? This will permanently delete your account, academic data, and all saved information.
									This action cannot be undone.
								</p>
								<div className='flex gap-3'>
									<button
										type='button'
										onClick={handleDelete}
										disabled={loading}
										className='px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors'>
										{loading ? "Deleting..." : "Yes, Delete My Account"}
									</button>
									<button
										type='button'
										onClick={() => setShowDeleteConfirm(false)}
										className='px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors'>
										Cancel
									</button>
								</div>
							</div>
						)}
					</div>
				</Reveal>

				{/* O/L Subjects Section */}
				<Reveal delay={0.2}>
					<OLSubjectsCard />
				</Reveal>

				{/* A/L Details Section */}
				<Reveal delay={0.25}>
					<ALSubjectsCard />
				</Reveal>

				{/* Account info card */}
				<Reveal delay={0.35}>
					<div className='p-6 mt-6 border bg-white/80 backdrop-blur-sm border-slate-200/60 rounded-2xl'>
						<div className='flex items-center gap-3 mb-4'>
							<UserIcon className='w-5 h-5 text-indigo-500' />
							<h3 className='text-sm font-bold text-slate-800'>Account Info</h3>
						</div>
						<div className='grid grid-cols-1 gap-4 text-sm sm:grid-cols-2'>
							<div>
								<span className='font-medium text-slate-400'>Member Since</span>
								<p className='mt-1 font-semibold text-slate-700'>
									{currentUser.createdAt ?
										new Date(currentUser.createdAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})
									:	"—"}
								</p>
							</div>
							<div>
								<span className='font-medium text-slate-400'>Last Updated</span>
								<p className='mt-1 font-semibold text-slate-700'>
									{currentUser.updatedAt ?
										new Date(currentUser.updatedAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})
									:	"—"}
								</p>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</div>
	);
}
