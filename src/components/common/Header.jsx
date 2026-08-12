/**
 * @fileoverview Renders the application header with the mobile sidebar trigger and authenticated-user controls. It reads shared UI/authentication state and exposes logout from the global shell.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/common/Header
 */
import { Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { openSidebar } from "../../store/uiSlice";
import Breadcrumb from "./Breadcrumb";

/**
 * Renders the header interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const Header = () => {
	const dispatch = useDispatch();

	return (
		<div className="bg-white px-5 py-3 shadow-sm">
			<div className="flex flex-row items-center gap-4 xl:justify-between">
				<button
					onClick={() => dispatch(openSidebar())}
					aria-label="Open Menu"
					className="cursor-pointer rounded-lg hover:bg-slate-100 xl:hidden"
				>
					<Menu size={16} />
				</button>

				<Breadcrumb />
			</div>
		</div>
	);
};

export default Header;
