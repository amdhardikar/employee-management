import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";
import Header from "../components/common/Header";

const MainLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

			<div className="flex flex-col flex-1 min-w-0 ">
				<Header openSidebar={() => setSidebarOpen(true)} />
				<main className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
