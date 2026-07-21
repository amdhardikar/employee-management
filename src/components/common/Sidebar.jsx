import { NavLink, useNavigate } from "react-router-dom";
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

	const handleLogout = () => {
		logout();
		onClose();
		navigate("/login", { replace: true });
	};
	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50 lg:hidden"
					onClick={onClose}
				/>
			)}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 lg:static bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 `}
			>
				<div className="flex items-center justify-around md:justify-center border-b border-slate-700 p-4 lg:p-6">
					<h1 className="font-bold text-base md:text-lg lg:text-xl">
						EMS Dashboard
					</h1>

					<button
						onClick={onClose}
						className="rounded-lg p-2 hover:bg-slate-700 lg:hidden"
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
							return (
								<li key={path}>
									<NavLink
										to={path}
										onClick={() => {
											if (window.innerWidth < 768) {
												onClose();
											}
										}}
										className={({ isActive }) =>
											`flex items-center justify-start lg:justify-start gap-3 px-4 py-3 rounded-lg transition ${
												isActive
													? "bg-gray-700 text-white"
													: "hover:bg-gray-800"
											}`
										}
									>
										<Icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
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
				<div className="p-4 border-t border-slate-700">
					<button
						onClick={handleLogout}
						className="flex items-center justify-start w-full gap-3 px-4 py-3 font-medium transition rounded-lg lg:justify-start hover:bg-rose-500/10 hover:text-rose-400"
					>
						<LogOut className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
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
