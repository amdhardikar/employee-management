import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";

const PayslipLayout = () => {
	return (
		<div className="flex h-full flex-col">
			{/* <div className="sticky top-0 z-20 bg-slate-50 ">
				<Header />
			</div> */}
			<Outlet />
		</div>
	);
};

export default PayslipLayout;
