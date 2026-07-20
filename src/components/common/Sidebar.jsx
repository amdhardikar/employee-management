import { NavLink, useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	Users,
	Briefcase,
	Calendar,
	Settings,
	LogOut,
	ReceiptIndianRupee,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
	const navItems = [
		{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
		{ path: "/employees", label: "Employees", icon: Users },
		{ path: "/departments", label: "Departments", icon: Briefcase },
		{ path: "/attendance", label: "Attendance", icon: Calendar },
		{ path: "/payroll", label: "Payroll", icon: ReceiptIndianRupee },
	];

	const { user, logout } = useContext(AuthContext);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login", { replace: true });
	};
	return (
		<aside className="w-64 bg-gray-900 text-white flex flex-col">
			{/* Logo */}
			<div className="p-6 border-b border-slate-700">
				<h1 className="text-2xl font-bold">EMS Dashboard</h1>
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
									className={({ isActive }) =>
										`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
											isActive
												? "bg-gray-700 text-white"
												: "hover:bg-gray-500"
										}`
									}
								>
									<Icon size={20} />
									{label}
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
					className="w-full flex items-center gap-2
                      hover:text-rose-400 hover:bg-rose-500/8 duration-150
                       px-4 py-3 rounded-lg font-medium transition"
				>
					<LogOut size={18} />
					Logout
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
