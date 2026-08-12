/**
 * @fileoverview Provides the main layout route shell. It renders the shared structure for this business area and an Outlet where React Router places the selected child screen.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/layout/mainLayout
 */
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Header from "../components/common/Header";

/**
 * Renders the main layout interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const MainLayout = () => {
	const location = useLocation();
	const mainRef = useRef(null);

	useEffect(() => {
		if (!mainRef.current) return;
		const scrollContainers = [
			mainRef.current,
			...mainRef.current.querySelectorAll(".overflow-auto, .overflow-y-auto, .overflow-x-auto"),
		];

		scrollContainers.forEach((container) => {
			container.scrollTop = 0;
			container.scrollLeft = 0;
		});
	}, [location.pathname]);

	return (
		<div className="flex h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/30">
			<Sidebar />

			<div className="flex min-w-0 flex-1 flex-col">
				<Header />

				<main ref={mainRef} className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default MainLayout;
