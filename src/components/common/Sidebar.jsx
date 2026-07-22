import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	Users,
	Briefcase,
	Calendar,
	LogOut,
	ReceiptIndianRupee,
	X,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import PropTypes from "prop-types";

const Sidebar = ({ isOpen, onClose }) => {
	const navItems = [
		{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ path: "/employees", label: "Employees", icon: Users },
		{ path: "/departments", label: "Departments", icon: Briefcase },
		{ path: "/attendance", label: "Attendance", icon: Calendar },
		{ path: "/payroll", label: "Payroll", icon: ReceiptIndianRupee },
	];

	const { logout } = useContext(AuthContext);
   const navigate = useNavigate();
   const location = useLocation();

	const handleLogout = () => {
		logout();
		onClose();
		navigate("/login", { replace: true });
	};
	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 xl:hidden"
					onClick={onClose}
				/>
			)}
			<aside
				className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-gray-900 text-white transition-transform duration-300 xl:static ${isOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}
			>
				<div className="flex items-center justify-around border-b border-slate-700 p-4 lg:p-6 xl:justify-center">
					<h1 className="text-lg font-bold xl:text-xl">
						EMS Dashboard
					</h1>

					<button
						onClick={onClose}
						className="rounded-lg p-2 hover:bg-slate-700 xl:hidden"
						aria-label="Close Menu"
					>
						<X size={20} />
					</button>
				</div>

				{/* Navigation */}
				<nav className="flex-1 p-4">
					<ul className="space-y-2">
						{navItems.map(({ path, label, icon }) => {
							const Icon = icon;
							const active = location.pathname.startsWith(path);
							return (
								<li key={path}>
									<NavLink
										to={path}
										onClick={onClose}
										className={() =>
											`flex items-center justify-start gap-3 rounded-lg px-4 py-3 transition lg:justify-start ${
												active
													? "bg-gray-700 text-white"
													: "hover:bg-gray-800"
											}`
										}
									>
										<Icon className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
										<span className="text-xs md:text-sm">
											{label}
										</span>
									</NavLink>
								</li>
							);
						})}
					</ul>
				</nav>

				{/* Logout Button */}
				<div className="border-t border-slate-700 p-4">
					<button
						onClick={handleLogout}
						className="flex w-full items-center justify-start gap-3 rounded-lg px-4 py-3 font-medium transition hover:bg-rose-500/10 hover:text-rose-400 lg:justify-start"
					>
						<LogOut className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
						<span className="text-xs md:text-sm">Logout</span>
					</button>
				</div>
			</aside>
		</>
	);
};

Sidebar.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default Sidebar;
