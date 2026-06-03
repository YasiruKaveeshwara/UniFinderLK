import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute — wraps protected pages.
 * Redirects to /signin if the user is not authenticated.
 */
export default function PrivateRoute({ children }) {
	const currentUser = useSelector((state) => state.user?.currentUser);

	if (!currentUser) {
		return <Navigate to='/signin' replace />;
	}

	return children;
}
