import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/common/Header";

const EmployeeLayout = () => {
	const [actions, setActions] = useState([]);
	return (
		<div className="flex h-full flex-col">
			<div className="sticky top-0 z-20 bg-slate-50">
				<Header actions={actions} />
			</div>
			<Outlet context={{ setActions }} />
		</div>
	);
};

export default EmployeeLayout;
