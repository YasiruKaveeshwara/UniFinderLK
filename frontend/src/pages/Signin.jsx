import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/User/userSlice";
import { SpinnerIcon, AlertCircleIcon, GraduationIcon } from "../components/ui/Icons";
import Reveal from "../components/ui/Reveal";
import Input from "../components/form/Input";

export default function SignIn() {
	const [formdata, setFormdata] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const { loading, error } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const API_BASE = process.env.REACT_APP_BACKEND_URL;

	const handleChange = (e) => {
		setFormdata({ ...formdata, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(signInStart());
			const res = await fetch(`${API_BASE}/api/auth/signin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(formdata),
			});
			const data = await res.json().catch(() => ({}));

			if (!res.ok || data.success === false) {
				dispatch(signInFailure(data.message || "Sign in failed"));
				return;
			}

			dispatch(signInSuccess(data));
			navigate("/");
		} catch (err) {
			dispatch(signInFailure(err.toString()));
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen px-4 pt-20 pb-12 bg-gradient-to-br from-indigo-50/60 via-white to-blue-50/60'>
			{/* Ambient orbs */}
			<div className='absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-300/10 rounded-full blur-[140px] pointer-events-none' />
			<div className='absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-[120px] pointer-events-none' />

			<div className='relative z-10 w-full max-w-md mx-auto'>
				<Reveal delay={0.1}>
					{/* Card */}
					<div className='p-8 bg-white border shadow-xl sm:p-10 border-slate-200/60 rounded-3xl'>
						{/* Error alert */}
						{error && (
							<div className='flex items-start gap-3 p-4 mb-6 border rounded-xl bg-red-50 border-red-200/60'>
								<AlertCircleIcon className='w-5 h-5 mt-0.5 text-red-500 shrink-0' />
								<p className='text-sm font-medium text-red-700'>{error}</p>
							</div>
						)}

						{/* Form */}
						<form onSubmit={handleSubmit} className='space-y-5'>
							{/* Email field */}
							<Input
								id='email'
								label='Email'
								placeholder='you@example.com'
								onChange={handleChange}
								isRequired
								inputStyle='h-12 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white'
								labelStyle='text-sm font-semibold text-slate-700'
							/>

							{/* Password field */}
							<div>
								<div className='flex items-center justify-between mb-1.5'>
									<label htmlFor='password' className='text-sm font-semibold text-slate-700'>
										Password
									</label>
								</div>
								<div className='relative'>
									<input
										type={showPassword ? "text" : "password"}
										id='password'
										placeholder='Enter your password'
										onChange={handleChange}
										required
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

							{/* Submit button */}
							<button
								type='submit'
								disabled={loading}
								className={`
									w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold rounded-xl transition-all duration-300
									${
										loading ?
											"bg-slate-100 text-slate-400 cursor-not-allowed"
										:	"text-white bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg shadow-indigo-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98]"
									}
								`}>
								{loading ?
									<>
										<SpinnerIcon className='w-5 h-5 animate-spin' />
										Signing in...
									</>
								:	"Sign In"}
							</button>
						</form>

						{/* Divider */}
						<div className='flex items-center gap-4 my-6'>
							<div className='flex-1 h-px bg-slate-200' />
							<span className='text-xs font-medium text-slate-400'>OR</span>
							<div className='flex-1 h-px bg-slate-200' />
						</div>

						{/* Sign up link */}
						<p className='text-sm text-center text-slate-500'>
							Don't have an account?{" "}
							<Link
								to='/signup'
								className='font-semibold text-indigo-600 no-underline transition-colors hover:text-indigo-700'>
								Create Account
							</Link>
						</p>
					</div>
				</Reveal>

				{/* Footer badge */}
				<Reveal delay={0.3}>
					<div className='flex items-center justify-center gap-2 mt-6'>
						<GraduationIcon className='w-4 h-4 text-indigo-400' />
						<span className='text-xs font-medium text-slate-400'>UniFinderLK — AI-powered degree recommendations</span>
					</div>
				</Reveal>
			</div>
		</div>
	);
}
