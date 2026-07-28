import { Eye } from "lucide-react";
import PropTypes from "prop-types";
import { STATUS_COLORS } from "../../constants/EMSconstants";
import {
	Table,
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from "../common/DataTable";
import { NavLink } from "react-router-dom";

const DepartmentDetailsTable = ({ employees }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">
						Employee Code
					</TableHeader>
					<TableHeader className="text-left">Name</TableHeader>
					<TableHeader className="text-left">Designation</TableHeader>
					<TableHeader className="text-left">Type</TableHeader>
					<TableHeader className="text-left">Location</TableHeader>
					<TableHeader className="text-left">Manager</TableHeader>
					<TableHeader className="text-center">Status</TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{employees.map((employee) => (
					<TableRow key={employee.id}>
						<TableCell>
							<NavLink to={`/employees/${employee.employeeId}`}>
								{employee.employeeId}
							</NavLink>
						</TableCell>

						<TableCell>{employee.fullName}</TableCell>

						<TableCell>{employee.employment.designation}</TableCell>

						<TableCell>
							{employee.employment.employeeType}
						</TableCell>

						<TableCell>
							{employee.employment.workLocation}
						</TableCell>

						<TableCell>
							{employee.employment.manager?.name}
						</TableCell>

						<TableCell>
							<span
								className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
									STATUS_COLORS[
										employee.employment?.status
									] || "bg-slate-100 text-slate-700"
								}`}
							>
								{employee.employment?.status}
							</span>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

DepartmentDetailsTable.propTypes = {
	employees: PropTypes.array.isRequired,
	onView: PropTypes.func.isRequired,
};

export default DepartmentDetailsTable;
