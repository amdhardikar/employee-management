import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";

const MainLayout = () => {
	return (
		<div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
			<Sidebar />
			<main className="flex-1 overflow-auto">
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
