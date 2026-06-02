import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../redux/User/userSlice";

import { LogoMark, MenuIcon, CloseIcon } from "./ui/Icons";

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user?.currentUser);
	const isLoggedIn = Boolean(currentUser);
	const API_BASE = process.env.REACT_APP_BACKEND_URL;

	// Close mobile menu on route change
	useEffect(() => {
		setMobileMenuOpen(false);
	}, [location.pathname]);

	// Scroll detection
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

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
		{ label: "A/L Streams", href: "/degree-recommendations/al-students" },
		{ label: "O/L Explorer", href: "/degree-recommendations/all-students" },
	];

	const isActive = (path) => location.pathname === path;

	// Pages that have a dark hero — header should be transparent at the top
	const DARK_HERO_PAGES = ["/", "/degree-recommendations/all-students", "/degree-recommendations/al-students"];
	const hasDarkHero = DARK_HERO_PAGES.includes(location.pathname);
	const atTop = hasDarkHero && !scrolled;

	return (
		<header
			id='site-header'
			className={`
				fixed top-0 z-50 w-full transition-all duration-300
				${
					atTop ?
						"bg-transparent border-b border-white/10 shadow-none"
					:	"bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm"
				}
			`}>
			<div className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					{/* Logo */}
					<Link to='/' className='flex items-center gap-2.5 no-underline group'>
						<LogoMark className='transition-transform duration-300 w-9 h-9 group-hover:scale-105' />
						<span
							className={`text-lg font-bold tracking-tight transition-colors duration-300 ${atTop ? "text-white" : "text-slate-900"}`}>
							UniFinderLK
						</span>
					</Link>

					{/* Desktop Nav */}
					<nav className='items-center hidden gap-1 md:flex'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className={`
									relative px-3 py-2 text-sm font-semibold no-underline transition-colors group
									${
										atTop ?
											isActive(link.href) ? "text-white"
											:	"text-white/80 hover:text-white"
										: isActive(link.href) ? "text-indigo-600"
										: "text-slate-600 hover:text-indigo-600"
									}
								`}>
								{link.label}
								<span
									className={`
										absolute left-3 right-3 bottom-1 h-0.5 rounded-full transition-transform origin-left
										${isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
										${atTop ? "bg-white" : "bg-indigo-600"}
									`}
								/>
							</Link>
						))}
					</nav>

					{/* Desktop Actions */}
					<div className='items-center hidden gap-3 md:flex'>
						{isLoggedIn ?
							<>
								<Link
									to='/profile'
									className={`
										px-3 py-2 text-sm font-semibold no-underline transition-colors rounded-lg
										${
											atTop ?
												"text-white/90 bg-white/10 border border-white/20 hover:bg-white/20"
											:	"text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600"
										}
									`}>
									{currentUser.name || currentUser.email || "My Profile"}
								</Link>
								<button
									type='button'
									onClick={handleLogout}
									className={`
										px-4 py-2 text-sm font-semibold transition-colors border rounded-lg
										${
											atTop ?
												"text-white border-white/25 bg-white/10 hover:bg-white/20"
											:	"text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
										}
									`}>
									Logout
								</button>
							</>
						:	<>
								<Link
									to='/signin'
									className={`
										px-4 py-2 text-sm font-semibold no-underline transition-colors rounded-lg
										${atTop ? "text-white/90 hover:text-white hover:bg-white/10" : "text-slate-700 hover:text-indigo-600 hover:bg-slate-50"}
									`}>
									Sign In
								</Link>
								<Link
									to='/signup'
									className={`
										px-5 py-2 text-sm font-semibold text-white no-underline transition-all duration-200 rounded-lg shadow-sm
										${
											atTop ?
												"bg-white/15 border border-white/30 hover:bg-white/25 backdrop-blur-sm"
											:	"bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
										}
									`}>
									Get Started
								</Link>
							</>
						}
					</div>

					{/* Mobile controls */}
					<div className='flex items-center gap-2 md:hidden'>
						{isLoggedIn ?
							<button
								type='button'
								onClick={handleLogout}
								className={`
									px-3 py-1.5 text-xs font-semibold rounded-lg border
									${atTop ? "text-white border-white/25 bg-white/10" : "text-indigo-600 border-indigo-200 bg-indigo-50"}
								`}>
								Logout
							</button>
						:	<Link
								to='/signin'
								className={`
									px-3 py-1.5 text-xs font-semibold rounded-lg border no-underline
									${atTop ? "text-white border-white/25 bg-white/10" : "text-indigo-600 border-indigo-200"}
								`}>
								Sign In
							</Link>
						}
						<button
							type='button'
							onClick={() => setMobileMenuOpen((open) => !open)}
							className={`p-2 rounded-lg transition-colors ${atTop ? "text-white hover:bg-white/15" : "text-slate-700 hover:bg-slate-100"}`}
							aria-label='Toggle menu'>
							{mobileMenuOpen ?
								<CloseIcon />
							:	<MenuIcon />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Dropdown */}
			{mobileMenuOpen && (
				<div
					className={`
						border-t md:hidden backdrop-blur-md
						${atTop ? "bg-white/10 border-white/15" : "bg-white/90 border-slate-200/60"}
					`}>
					<div className='px-4 py-3 space-y-1'>
						{navLinks.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className={`
									block px-3 py-2.5 rounded-lg text-sm font-semibold no-underline transition-colors
									${
										atTop ?
											isActive(link.href) ? "bg-white/20 text-white"
											:	"text-white/80 hover:bg-white/10 hover:text-white"
										: isActive(link.href) ? "bg-indigo-50 text-indigo-700"
										: "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
									}
								`}>
								{link.label}
							</Link>
						))}
						{isLoggedIn && (
							<Link
								to='/profile'
								className={`
									block px-3 py-2.5 rounded-lg text-sm font-semibold no-underline transition-colors
									${
										atTop ?
											isActive("/profile") ? "bg-white/20 text-white"
											:	"text-white/80 hover:bg-white/10 hover:text-white"
										: isActive("/profile") ? "bg-indigo-50 text-indigo-700"
										: "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
									}
								`}>
								My Profile
							</Link>
						)}
						{!isLoggedIn && (
							<Link
								to='/signup'
								className={`
									block px-3 py-2.5 rounded-lg text-sm font-semibold no-underline text-center
									${atTop ? "bg-white/15 text-white border border-white/25" : "bg-indigo-600 text-white"}
								`}>
								Get Started
							</Link>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
