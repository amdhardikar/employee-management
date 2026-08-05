import { useCallback, useState } from "react";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";

const DEFAULT_REDIRECT = "/dashboard";

const Login = () => {
	const [form, setForm] = useState({
		email: "",
		employeeCode: "",
	});

	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	const user = useSelector((state) => state.auth.user);
	const loading = useSelector((state) => state.auth.loading);
	const error = useSelector((state) => state.auth.error);

	const redirectPath = location.state?.from?.pathname ?? DEFAULT_REDIRECT;

	const handleChange = useCallback((e) => {
		const { name, value } = e.target;

		setForm((prev) => ({
			...prev,
			[name]: value,
		}));
	}, []);

	const handleSubmit = useCallback(
		async (e) => {
			e.preventDefault();

			if (loading) return;

			const normalizedEmpCode = form.employeeCode.trim().toUpperCase();
			const result = await dispatch(
				login({
					email: form.email,
					employeeCode: normalizedEmpCode,
				}),
			);

			if (login.fulfilled.match(result)) {
				navigate(redirectPath, { replace: true });
			}
		},
		[dispatch, form, navigate, redirectPath, loading],
	);

	if (user) {
		return <Navigate to={DEFAULT_REDIRECT} replace />;
	}

	return (
		<div className="flex min-h-dvh items-center justify-center bg-slate-100 px-4 py-6">
			<div className="w-full max-w-md p-8">
				<h2 className="text-center text-lg font-bold text-slate-800 sm:text-2xl">EMS Portal Login</h2>

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

				<form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
					<div>
						<label htmlFor="email" className="block text-xs font-medium text-slate-700 sm:text-sm">
							Email Address
						</label>
						<div className="relative mt-1">
							<Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />

							<input
								id="email"
								name="email"
								type="email"
								required
								autoComplete="email"
								placeholder="firstname.lastname@company.com"
								value={form.email}
								onChange={handleChange}
								className="w-full rounded-sm border border-slate-300 bg-slate-50 py-2.5 pr-3 pl-10 text-sm transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm"
							/>
						</div>
					</div>

					<div>
						<label htmlFor="employeeCode" className="block text-xs font-medium text-slate-700 sm:text-sm">
							Employee Code
						</label>

						<div className="relative mt-1">
							<Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400" />

							<input
								id="employeeCode"
								name="employeeCode"
								type="text"
								required
								autoComplete="off"
								placeholder="EMS-2026-001"
								value={form.employeeCode}
								onChange={handleChange}
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
