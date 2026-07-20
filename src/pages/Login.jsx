import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { Lock, Mail, AlertCircle } from "lucide-react";

const Login = () => {
	const [email, setEmail] = useState("");
	const [empCode, setEmpCode] = useState("");
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	const { login } = useContext(AuthContext);
	const navigate = useNavigate();
	const location = useLocation();

	const redirectPath = location.state?.from?.pathname || "/dashboard";

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setSubmitting(true);

		const result = await login(email, empCode);
		setSubmitting(false);

		if (result.success) {
			navigate(redirectPath, { replace: true });
		} else {
			setError(result.message);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen px-4 bg-slate-100">
			<div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
				<h2 className="text-2xl font-bold text-center text-slate-800">
					EMS Portal Login
				</h2>
				<p className="mt-2 text-sm text-center text-slate-500">
					Sign in with your corporate credentials
				</p>

				{error && (
					<div className="flex items-center gap-2 p-3 mt-4 text-sm text-red-700 bg-red-50 rounded-lg">
						<AlertCircle className="w-4 h-4 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<div>
						<label className="block text-sm font-medium text-slate-700">
							Email Address
						</label>
						<div className="relative mt-1">
							<Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
							<input
								type="email"
								required
								className="w-full py-2 pl-10 pr-3 border rounded-lg bg-slate-50 border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								placeholder="firstname.lastname@company.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700">
							Employee Code
						</label>
						<div className="relative mt-1">
							<Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2 text-slate-400" />
							<input
								type="text"
								required
								className="w-full py-2 pl-10 pr-3 border rounded-lg bg-slate-50 border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
								placeholder="EMS-2026-001"
								value={empCode}
								onChange={(e) => setEmpCode(e.target.value)}
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={submitting}
						className="w-full py-2.5 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition focus:ring-4 focus:ring-indigo-200 disabled:opacity-50"
					>
						{submitting ? "Authenticating..." : "Sign In"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
