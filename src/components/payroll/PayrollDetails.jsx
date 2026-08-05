import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLoader from "../common/PageLoader";
import NotFound from "../common/NotFound";
import { payrollApi } from "../../api/payrollApi";
// import { employeeApi } from "../../api/employeeApi";
import PayrollDetailsTable from "./PayrollDetailsTable";
import PayrollDetailCard from "./PayrollDetailCard";

const PayrollDetails = () => {
	const { id } = useParams();
	// const [employee, setEmployee] = useState([]);
	const [payroll, setPayroll] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadEmployee = async () => {
			try {
				setLoading(true);
				const payrollData = await payrollApi.getByEmployeeId(id);
				// const employeeData = await employeeApi.getById(id);

				setPayroll(payrollData);
				// setEmployee(employeeData);
			} catch (error) {
				setPayroll([]);
				console.log("Error:", error);
			} finally {
				setLoading(false);
			}
		};
		loadEmployee();
	}, [id]);

	if (loading) {
		return <PageLoader text="Loading payroll details..." />;
	}

	if (payroll.length === 0) {
		return <NotFound title="Payroll Not Found" message={`No payroll records exist for employee "${id}".`} />;
	}

	return (
		<div className="overflow-y-auto border-t border-slate-200 p-5">
			<div className="hidden lg:block">
				<PayrollDetailsTable payroll={payroll} />
			</div>

			<div className="grid gap-4 lg:hidden">
				{payroll.map((item) => (
					<PayrollDetailCard key={item.id} item={item} />
				))}
			</div>
		</div>
	);
};

export default PayrollDetails;
