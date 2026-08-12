/**
 * @fileoverview Renders primary EMS navigation for desktop and mobile layouts. It highlights the active section, responds to global sidebar state, closes after mobile navigation, and provides access to dashboard and business modules.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/Sidebar
 */
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
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";
import { closeSidebar } from "../../store/uiSlice";

/**
 * Renders the sidebar interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const Sidebar = () => {
	const navItems = [
		{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ path: "/employees", label: "Employees", icon: Users },
		{ path: "/departments", label: "Departments", icon: Briefcase },
		{ path: "/attendance", label: "Attendance", icon: Calendar },
		{ path: "/payroll", label: "Payroll", icon: ReceiptIndianRupee },
	];

	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();

	const isOpen = useSelector((state) => state.ui.sidebarOpen);

	const handleLogout = () => {
		dispatch(closeSidebar());
		navigate("/login", { replace: true });
		dispatch(logout());
	};
	return (
		<>
			{isOpen && (
				<div
					data-testid="sidebar-overlay"
					className="fixed inset-0 z-40 cursor-pointer bg-black/50 xl:hidden"
					onClick={() => dispatch(closeSidebar())}
				/>
			)}
			<aside
				className={`fixed inset-y-0 left-0 z-50 flex w-64 transform flex-col bg-slate-900 text-white transition-transform duration-300 xl:static ${isOpen ? "translate-x-0" : "-translate-x-full"} xl:translate-x-0`}
			>
				<div className="flex items-center justify-around border-b border-slate-700 p-4 lg:p-6 xl:justify-center">
					<h1 className="text-lg font-bold xl:text-xl">
						EMS Dashboard
					</h1>

					<button
						onClick={() => dispatch(closeSidebar())}
						className="cursor-pointer rounded-lg p-2 hover:bg-slate-600 xl:hidden"
						aria-label="Close Menu"
					>
						<X size={16} />
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
										onClick={() => dispatch(closeSidebar())}
										className={() =>
											`flex cursor-pointer items-center justify-start gap-3 rounded-sm px-4 py-3 transition lg:justify-start ${
												active
													? "bg-slate-600 text-white"
													: "hover:bg-slate-800"
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

				<div className="border-t border-slate-700 p-4">
					<button
						onClick={handleLogout}
						aria-label="Logout"
						className="flex w-full cursor-pointer items-center justify-start gap-3 rounded-sm px-4 py-3 font-medium transition hover:bg-rose-500/10 hover:text-rose-400 lg:justify-start"
					>
						<LogOut className="h-4 w-4 shrink-0 md:h-5 md:w-5" />
						<span className="text-xs md:text-sm">Logout</span>
					</button>
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
