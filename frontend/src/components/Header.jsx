import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../redux/User/userSlice";

const LogoMark = ({ className = "w-8 h-8" }) => (
	<img src='/favicon.png' alt='Uni-Finder Logo' className={`${className} object-contain`} />
);

const MenuIcon = () => (
	<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
		<path strokeLinecap='round' d='M4 7h16M4 12h16M4 17h16' />
	</svg>
);

const CloseIcon = () => (
	<svg className='w-5 h-5' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
		<path strokeLinecap='round' d='M6 18L18 6M6 6l12 12' />
	</svg>
);

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user?.currentUser);
	const isLoggedIn = Boolean(currentUser);
	const API_BASE = process.env.REACT_APP_BACKEND_URL;

	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location.pathname]);

	const handleLogout = async () => {
		try {
			if (API_BASE) await fetch(`${API_BASE}/api/auth/signout`, { credentials: "include" });
		} catch (error) {
			void error;
		}
		dispatch(signout());
		navigate("/signin");
	};

	const navLinks = [
		{ label: "Home", href: "/" },
		{ label: "Degrees", href: "/#pathways-section" },
	];

	const isTransparent = false;
	const isActive = (path) => location.pathname === path;

	return (
		<header
			id='site-header'
			className={`fixed top-0 z-50 w-full transition-all duration-300 ${
				isTransparent ?
					"bg-slate-950/35 backdrop-blur-md shadow-sm"
				:	"bg-sky-100/95 backdrop-blur-xl shadow-sm border-b border-sky-200/80"
			}`}>
			<div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<Link to='/' className='flex items-center gap-2.5 no-underline group'>
						<LogoMark className='transition-transform duration-300 w-9 h-9 group-hover:scale-105' />
						<span className={`text-lg font-bold tracking-tight ${isTransparent ? "text-white" : "text-slate-900"}`}>
							Uni-Finder
						</span>
					</Link>

					<nav className='items-center hidden gap-1 md:flex'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className={`relative px-3 py-2 text-sm font-semibold no-underline transition-colors group ${
									isActive(link.href) ?
										isTransparent ? "text-white"
										:	"text-indigo-600"
									: isTransparent ? "text-white/75 hover:text-white"
									: "text-slate-600 hover:text-indigo-600"
								}`}>
								{link.label}
								<span
									className={`absolute left-3 right-3 bottom-1 h-0.5 rounded-full transition-transform origin-left ${
										isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
									} ${isTransparent ? "bg-white" : "bg-indigo-600"}`}
								/>
							</Link>
						))}
					</nav>

					<div className='items-center hidden gap-3 md:flex'>
						{isLoggedIn ?
							<>
								<div
									className={`px-3 py-2 text-sm font-semibold rounded-lg ${isTransparent ? "text-white/90 bg-white/10" : "text-slate-700 bg-slate-100"}`}>
									{currentUser.username || currentUser.email || "Member"}
								</div>
								<button
									type='button'
									onClick={handleLogout}
									className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
										isTransparent ?
											"text-white border border-white/25 hover:bg-white/10"
										:	"text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
									}`}>
									Logout
								</button>
							</>
						:	<>
								<Link
									to='/signin'
									className={`px-4 py-2 text-sm font-semibold no-underline rounded-lg transition-colors ${
										isTransparent ?
											"text-white border border-white/25 hover:bg-white/10"
										:	"text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
									}`}>
									Sign In
								</Link>
								<Link
									to='/signup'
									className={`px-5 py-2 text-sm font-semibold no-underline rounded-lg transition-colors ${
										isTransparent ?
											"bg-white text-indigo-600 hover:bg-white/90"
										:	"bg-indigo-600 text-white hover:bg-indigo-700"
									}`}>
									Get Started
								</Link>
							</>
						}
					</div>

					<div className='flex items-center gap-2 md:hidden'>
						{isLoggedIn ?
							<button
								type='button'
								onClick={handleLogout}
								className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${isTransparent ? "text-white border border-white/25" : "text-indigo-600 border border-indigo-200 bg-indigo-50"}`}>
								Logout
							</button>
						:	<Link
								to='/signin'
								className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${isTransparent ? "text-white border border-white/25" : "text-indigo-600 border border-indigo-200"}`}>
								Sign In
							</Link>
						}
						<button
							type='button'
							onClick={() => setMobileMenuOpen((open) => !open)}
							className={`p-2 rounded-lg ${isTransparent ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"}`}
							aria-label='Toggle menu'>
							{mobileMenuOpen ?
								<CloseIcon />
							:	<MenuIcon />}
						</button>
					</div>
				</div>
			</div>

			{mobileMenuOpen && (
				<div className='border-t md:hidden border-sky-100/70 bg-sky-50/95 backdrop-blur-xl'>
					<div className='px-4 py-3 space-y-1'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className={`block px-3 py-2.5 rounded-lg text-sm font-semibold no-underline ${
									isActive(link.href) ? "bg-indigo-50 text-indigo-700" : (
										"text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
									)
								}`}>
								{link.label}
							</Link>
						))}
						{!isLoggedIn && (
							<Link
								to='/signup'
								className='block px-3 py-2.5 rounded-lg text-sm font-semibold no-underline bg-indigo-600 text-white'>
								Get Started
							</Link>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
