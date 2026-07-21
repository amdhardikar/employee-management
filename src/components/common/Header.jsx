import { Menu } from "lucide-react";
import Breadcrumb from "./Breadcrumb";
import PropTypes from "prop-types";

const Header = ({ openSidebar }) => {
	return (
		<div className=" bg-white px-5 py-5 shadow-sm">
			<div className="flex flex-row items-center gap-4 lg:flex-row lg:items-center lg:justify-between">
				{/* <div className="space-y-3"> */}
					<button
						onClick={openSidebar}
						className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
					>
						<Menu size={22} />
					</button>

					<Breadcrumb />
				</div>
			</div>
		// </div>
	);
};

Header.prototype = {
	openSidebar: PropTypes.func.isRequired,
};

export default Header;
