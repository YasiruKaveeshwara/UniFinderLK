import React, { useEffect } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/Signin";
import ALWizardFlow from "./pages/ALWizardFlow";
import OLExplorerFlow from "./pages/OLExplorerFlow";
import OLResultsPage from "./pages/OLResultsPage";

function AppContent() {
	const location = useLocation();
	const isHomePage = location.pathname === "/";

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
		<div className='flex flex-col min-h-screen bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-100/80'>
			<Header />
			<main className='flex-grow bg-transparent'>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/degree-recommendations' element={<Navigate to='/' replace />} />
					<Route path='/degree-recommendations/al-students' element={<ALWizardFlow />} />
					<Route path='/degree-recommendations/all-students' element={<OLExplorerFlow />} />
					<Route path='/degree-recommendations/ol-results' element={<OLResultsPage />} />
					<Route path='/signin' element={<SignIn />} />
					<Route path='/signup' element={<SignUp />} />
					<Route path='/signInNew' element={<Navigate to='/signin' replace />} />
					<Route path='/signUp' element={<Navigate to='/signup' replace />} />
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</main>
			<Footer />
		</div>
	);
}

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

export default App;
