import { Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { openSidebar } from "../../store/uiSlice";
import Breadcrumb from "./Breadcrumb";

const Header = () => {
	const dispatch = useDispatch();

	return (
		<div className="bg-white px-5 py-3 shadow-sm">
			<div className="flex flex-row items-center gap-4 xl:justify-between">
				<button
					onClick={() => dispatch(openSidebar())}
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
