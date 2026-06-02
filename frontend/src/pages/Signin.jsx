import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/User/userSlice";
import {
	SpinnerIcon,
	AlertCircleIcon,
	GraduationIcon,
	ArrowRightIcon,
	CheckIcon,
	LockIcon,
	UserIcon,
} from "../components/ui/Icons";
import Reveal from "../components/ui/Reveal";

const EyeIcon = ({ open }) =>
	open ?
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
		</svg>;

const FEATURES = [
	"AI-powered degree matching based on your marks",
	"Compare eligible & aspirational universities",
	"Personalised A/L stream & degree guidance",
	"Save your O/L & A/L data for faster searches",
];

export default function SignIn() {
	const [formdata, setFormdata] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const { loading, error } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const API_BASE = process.env.REACT_APP_BACKEND_URL;

	const handleChange = (e) => setFormdata({ ...formdata, [e.target.id]: e.target.value });

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
		<div className='min-h-screen pb-20 bg-slate-50'>
			{/* ── Hero Header ── */}
			<div className='relative pt-24 overflow-hidden border-b pb-36 border-blue-900/30 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900'>
				{/* Ambient blobs */}
				<div className='absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen' />
				<div className='absolute bottom-0 left-10 w-[400px] h-[400px] bg-indigo-400/15 rounded-full blur-[100px] pointer-events-none mix-blend-screen' />

				<div className='relative z-10 max-w-5xl px-6 mx-auto'>
					{/* Badge */}
					<div className='inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase rounded-full bg-white/10 text-blue-100 border border-blue-400/30'>
						<LockIcon className='w-4 h-4' />
						<span>Sign In to Your Account</span>
					</div>

					<div className='grid items-center grid-cols-1 gap-10 md:grid-cols-2'>
						{/* Left — headline + trust signals */}
						<div>
							<h1 className='mb-3 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl'>
								Welcome Back to{" "}
								<span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300'>
									UniFinderLK
								</span>
							</h1>
							<p className='mb-8 text-lg leading-relaxed text-blue-100/80'>
								Sign in to access your academic profile, saved subjects, and personalised degree recommendations.
							</p>

							<ul className='space-y-3'>
								{FEATURES.map((f) => (
									<li key={f} className='flex items-start gap-3'>
										<span className='flex-shrink-0 flex items-center justify-center w-5 h-5 mt-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40'>
											<CheckIcon className='w-3 h-3 text-cyan-300' />
										</span>
										<span className='text-sm text-blue-100/75'>{f}</span>
									</li>
								))}
							</ul>
						</div>

						{/* Right — stats chips */}
						<div className='flex-col items-end hidden gap-3 md:flex'>
							{[
								{ value: "200+", label: "Degree programmes" },
								{ value: "AI", label: "Powered matching" },
								{ value: "Free", label: "Always" },
							].map(({ value, label }) => (
								<div
									key={label}
									className='flex items-center gap-3 px-5 py-3 border rounded-2xl bg-white/10 border-white/15 backdrop-blur-sm'>
									<span className='text-2xl font-extrabold text-white'>{value}</span>
									<span className='text-sm text-blue-200/70'>{label}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* ── Floating Card ── */}
			<div className='relative z-20 max-w-5xl px-6 mx-auto -mt-20'>
				<Reveal delay={0.1}>
					<div className='grid grid-cols-1 gap-0 overflow-hidden bg-white border shadow-2xl md:grid-cols-5 border-slate-200/60 rounded-3xl'>
						{/* Left panel — branding strip */}
						<div className='relative flex-col justify-between hidden p-8 overflow-hidden md:flex md:col-span-2 bg-gradient-to-b from-indigo-600 to-blue-700'>
							<div className='absolute bottom-0 right-0 w-48 h-48 rounded-full pointer-events-none bg-white/5 blur-2xl' />
							<div className='absolute top-0 left-0 w-32 h-32 rounded-full pointer-events-none bg-white/5 blur-2xl' />

							<div className='relative z-10'>
								<div className='flex items-center gap-2 mb-6'>
									<GraduationIcon className='w-6 h-6 text-white' />
									<span className='text-lg font-extrabold text-white'>UniFinderLK</span>
								</div>
								<h2 className='mb-3 text-2xl font-extrabold leading-snug text-white'>
									Your Higher Education journey starts here
								</h2>
							</div>
							<div className='relative z-10'>
								<p className='text-sm leading-relaxed text-blue-100/70'>Sign in to pick up where you left off</p>
								<p className='text-sm leading-relaxed text-blue-100/70'>
									Your saved subjects and recommendations are waiting.
								</p>
							</div>

							<Link
								to='/signup'
								className='relative z-10 block px-4 py-2 no-underline transition-colors border px rounded-2xl bg-white/10 border-white/15 hover:bg-white/15 hover:no-underline'>
								<p className='mb-1 text-xs font-semibold tracking-wider uppercase text-blue-100/60'>New here?</p>
								<div className='inline-flex items-center gap-2 text-sm font-bold text-white no-underline transition-colors hover:text-cyan-300'>
									Create a free account <ArrowRightIcon className='w-4 h-4' />
								</div>
							</Link>
						</div>

						{/* Right panel — form */}
						<div className='p-8 md:col-span-3 sm:p-10'>
							{/* Mobile header */}
							<div className='flex items-center gap-2 mb-6 md:hidden'>
								<GraduationIcon className='w-5 h-5 text-indigo-600' />
								<span className='font-extrabold text-slate-800'>UniFinderLK</span>
							</div>

							<h2 className='mb-1 mb-4 text-2xl font-extrabold text-slate-900'>Sign In</h2>

							{/* Error */}
							{error && (
								<div className='flex items-start gap-3 p-4 mb-6 border rounded-xl bg-red-50 border-red-200/60'>
									<AlertCircleIcon className='w-5 h-5 mt-0.5 text-red-500 shrink-0' />
									<p className='text-sm font-medium text-red-700'>{error}</p>
								</div>
							)}

							<form onSubmit={handleSubmit} className='space-y-5'>
								{/* Email */}
								<div>
									<label htmlFor='email' className='block mb-1.5 text-sm font-semibold text-slate-700'>
										Email Address
									</label>
									<div className='relative'>
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'>
											<UserIcon className='w-4 h-4' />
										</span>
										<input
											type='email'
											id='email'
											placeholder='you@example.com'
											onChange={handleChange}
											required
											className='w-full py-3 pl-10 pr-4 text-sm transition-colors border rounded-xl bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:outline-none'
										/>
									</div>
								</div>

								{/* Password */}
								<div>
									<label htmlFor='password' className='block mb-1.5 text-sm font-semibold text-slate-700'>
										Password
									</label>
									<div className='relative'>
										<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none'>
											<LockIcon className='w-4 h-4' />
										</span>
										<input
											type={showPassword ? "text" : "password"}
											id='password'
											placeholder='Enter your password'
											onChange={handleChange}
											required
											className='w-full py-3 pl-10 pr-12 text-sm transition-colors border rounded-xl bg-slate-50 border-slate-200 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:outline-none'
										/>
										<button
											type='button'
											onClick={() => setShowPassword(!showPassword)}
											className='absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-0 text-slate-400 hover:text-slate-600 focus:outline-none'>
											<EyeIcon open={showPassword} />
										</button>
									</div>
								</div>

								{/* Submit */}
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
											<SpinnerIcon className='w-5 h-5 animate-spin' /> Signing in...
										</>
									:	<>
											Sign In <ArrowRightIcon className='w-4 h-4' />
										</>
									}
								</button>
							</form>

							<div className='flex items-center gap-3 mt-8'>
								<GraduationIcon className='w-4 h-4 text-slate-300' />
								<span className='text-xs text-slate-400'>UniFinderLK — AI-powered degree recommendations</span>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</div>
	);
}
