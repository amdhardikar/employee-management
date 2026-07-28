import { useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";

const Login = () => {
	const [email, setEmail] = useState("");
	const [empCode, setEmpCode] = useState("");

	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	const { user, loading, error } = useSelector((state) => state.auth);

	console.log(location.state);
	console.log(location.state?.from?.pathname);

	const redirectPath = location.state?.from?.pathname || "/dashboard";

	const handleSubmit = async (e) => {
		e.preventDefault();

		// const normalizedEmail = email.trim().toLowerCase();
		const normalizedEmpCode = empCode.trim().toUpperCase();

		const result = await dispatch(
			login({
				email: email,
				employeeCode: normalizedEmpCode,
			}),
		);

		if (login.fulfilled.match(result)) {
			navigate(redirectPath, { replace: true });
		}
	};

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-6">
			<div className="w-full max-w-md p-8">
				<h2 className="text-center text-lg font-bold text-slate-800 sm:text-2xl">
					EMS Portal Login
				</h2>

				<p className="mt-2 text-center text-xs text-slate-500 sm:text-sm">
					Sign in with your corporate credentials
				</p>

				{error && (
					<div
						role="alert"
						className="mt-4 flex items-center gap-2 rounded-sm border border-red-200 bg-red-50 p-3 text-sm text-red-700"
					>
						<AlertCircle className="h-4 w-4 shrink-0" />
						<span>{error}</span>
					</div>
				)}

				<form onSubmit={handleSubmit} className="mt-6 space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-xs font-medium text-slate-700 sm:text-sm"
						>
							Email Address
						</label>
						<div className="relative mt-1">
							<Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />

							<input
								id="email"
								type="email"
								required
								autoComplete="email"
								placeholder="firstname.lastname@company.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full rounded-sm border border-slate-300 bg-slate-50 py-2.5 pr-3 pl-10 text-sm transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="empCode"
							className="block text-xs font-medium text-slate-700 sm:text-sm"
						>
							Employee Code
						</label>

						<div className="relative mt-1">
							<Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />

							<input
								id="empCode"
								type="text"
								required
								autoComplete="off"
								placeholder="EMS-2026-001"
								value={empCode}
								onChange={(e) => setEmpCode(e.target.value)}
								className="w-full rounded-sm border border-slate-300 bg-slate-50 py-2.5 pr-3 pl-10 text-sm transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							/>
						</div>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full rounded-sm bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
					>
						{loading ? "Authenticating..." : "Sign In"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
