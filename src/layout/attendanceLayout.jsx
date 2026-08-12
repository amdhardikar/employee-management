/**
 * @fileoverview Provides the attendance layout route shell. It renders the shared structure for this business area and an Outlet where React Router places the selected child screen.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/layout/attendanceLayout
 */
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";

/**
 * Renders the attendance layout interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const AttendanceLayout = () => {
	return (
		<div className="flex h-full flex-col">
			<Outlet />
		</div>
	);
};

export default AttendanceLayout;
