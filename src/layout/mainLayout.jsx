import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

const MainLayout = () => {
	return (
		<div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
			<Sidebar />

			<div className="flex min-w-0 flex-1 flex-col">
				<Header />

				<main className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
