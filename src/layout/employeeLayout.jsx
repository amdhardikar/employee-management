import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";

const EmployeeLayout = () => {
	return (
		<div className="flex h-full flex-col">
			<Outlet />
		</div>
	);
};

export default EmployeeLayout;
