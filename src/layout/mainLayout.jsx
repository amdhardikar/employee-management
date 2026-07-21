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

			<div className="flex flex-col flex-1 min-w-0">
				{/* <header className="sticky top-0 z-30 flex items-center h-14 md:h-16 px-4 bg-white shadow-sm lg:hidden">
					<button
						onClick={() => setSidebarOpen(true)}
						className="p-2 rounded-lg hover:bg-slate-100"
						aria-label="Open menu"
					>
						<Menu size={22} />
					</button>
				</header> */}
				<Header openSidebar={() => setSidebarOpen(true)} />
				<main className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
