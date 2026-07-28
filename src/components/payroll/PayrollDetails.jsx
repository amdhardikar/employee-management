import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import PageLoader from "../common/PageLoader";
import { STATUS_COLORS } from "../../constants/EMSconstants";
import NotFound from "../common/NotFound";
import { payrollApi } from "../../api/payrollApi";
import { employeeApi } from "../../api/employeeApi";
import PayrollDetailsTable from "./PayrollDetailsTable";
import EmptyState from "../common/EmptyState";

const PayrollDetails = () => {
	const { id } = useParams();
	const [employee, setEmployee] = useState([]);
	const [payroll, setPayroll] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadEmployee = async () => {
			try {
				setLoading(true);
				const payrollData = await payrollApi.getByEmployeeId(id);
				const employeeData = await employeeApi.getById(id);

				console.log(payrollData, employeeData);
				setPayroll(payrollData);
				setEmployee(employeeData);
			} finally {
				setLoading(false);
			}
		};
		loadEmployee();
	}, [id]);

	if (loading) {
		return <PageLoader text="Loading employee details..." />;
	}

	if (!payroll) {
		return (
			<NotFound
				title="Employee Not Found"
				message={`No employee exists with ID "${id}".`}
			/>
		);
	}

	return (
		<div className="overflow-y-auto border-t border-slate-200 p-5">
			{/* Monthly Attendance Table */}
			{payroll.length > 0 ? (
				<>
					<div className="hidden lg:block">
						<PayrollDetailsTable payroll={payroll} />
					</div>
				</>
			) : (
				<EmptyState />
			)}
		</div>
	);
};

export default PayrollDetails;
