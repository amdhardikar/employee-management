import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";

const PayslipLayout = () => {
	return (
		<div className="flex h-full flex-col">
			<Outlet />
		</div>
	);
};

export default PayslipLayout;
