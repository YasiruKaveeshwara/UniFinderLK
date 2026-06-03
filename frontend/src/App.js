import React, { useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/Signin";
import ALWizardFlow from "./pages/ALWizardFlow";
import OLExplorerFlow from "./pages/OLExplorerFlow";
import OLResultsPage from "./pages/OLResultsPage";
import ProfilePage from "./pages/ProfilePage";
import OnboardingPage from "./pages/OnboardingPage";
import FeedbackPage from "./pages/FeedbackPage";
import AboutPage from "./pages/AboutPage";
import PrivateRoute from "./components/PrivateRoute";

function AppContent() {
	const location = useLocation();
	const isHomePage = location.pathname === "/";
	const isOnboarding = location.pathname === "/onboarding";

	// Scroll to top on page navigation
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

	useEffect(() => {
		if (isHomePage) {
			document.body.classList.add("homepage");
			document.body.classList.remove("non-homepage");
		} else {
			document.body.classList.remove("homepage");
			document.body.classList.add("non-homepage");
		}
	}, [isHomePage]);

	return (
		<div className='flex flex-col min-h-screen bg-white'>
			{!isOnboarding && <Header />}
			<main className='flex-grow bg-transparent'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/degree-recommendations' element={<Navigate to='/' replace />} />
					<Route path='/degree-recommendations/al-students' element={<ALWizardFlow />} />
					<Route path='/degree-recommendations/all-students' element={<OLExplorerFlow />} />
					<Route path='/degree-recommendations/ol-results' element={<OLResultsPage />} />
					<Route
						path='/profile'
						element={
							<PrivateRoute>
								<ProfilePage />
							</PrivateRoute>
						}
					/>
					<Route path='/signin' element={<SignIn />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/feedback' element={<FeedbackPage />} />
					<Route path='/about' element={<AboutPage />} />
					<Route
						path='/onboarding'
						element={
							<PrivateRoute>
								<OnboardingPage />
							</PrivateRoute>
						}
					/>
					<Route path='/signInNew' element={<Navigate to='/signin' replace />} />
					<Route path='/signUp' element={<Navigate to='/signup' replace />} />
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</main>
			{!isOnboarding && <Footer />}
		</div>
	);
}

function App() {
	return (
		<ToastProvider>
			<Router>
				<AppContent />
			</Router>
		</ToastProvider>
	);
}

export default App;
