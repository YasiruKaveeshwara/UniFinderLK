import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../redux/User/userSlice";

export default function SignIn() {
	const [formdata, setFormdata] = useState({});
	const { loading, error } = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const API_BASE = process.env.REACT_APP_BACKEND_URL;

	if (!API_BASE) {
		throw new Error("Missing REACT_APP_BACKEND_URL in frontend .env");
	}

	const handleChange = (e) => {
		setFormdata({ ...formdata, [e.target.id]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			dispatch(signInStart());
			const res = await fetch(`${API_BASE}/api/auth/signin`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
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
		} catch (error) {
			dispatch(signInFailure(error.toString()));
		}
	};

	return (
		<div className='container mt-5 d-flex justify-content-center align-items-center min-vh-100'>
			<div className='p-4 shadow-lg card' style={{ maxWidth: "500px", width: "100%" }}>
				<h2 className='mb-4 text-center'>Sign In</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-3'>
						<label htmlFor='email' className='form-label'>
							Email or username
						</label>
						<input
							type='text'
							className='form-control'
							id='email'
							placeholder='Enter your email or username'
							onChange={handleChange}
							required
						/>
					</div>

					<div className='mb-3'>
						<label htmlFor='password' className='form-label'>
							Password
						</label>
						<input
							type='password'
							className='form-control'
							id='password'
							placeholder='Enter your password'
							onChange={handleChange}
							required
						/>
					</div>

					<button type='submit' className='btn btn-primary w-100' disabled={loading}>
						{loading ? "Signing In..." : "Sign In"}
					</button>
				</form>

				<div className='mt-3 text-center'>
					<p>
						Don't have an account?{" "}
						<Link to='/signup' className='text-decoration-none text-primary'>
							Sign Up
						</Link>
					</p>
					{error && (
						<div className='mt-3 alert alert-danger' role='alert'>
							{error || "Something went wrong!"}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
