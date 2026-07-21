import { Eye } from "lucide-react";
import PropTypes from "prop-types";
import { STATUS_COLORS } from "../constants/EMSconstants";
import {
	Table,
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
} from "./common/DataTable";

const EmployeeTable = ({ employees, onView }) => {
	return (
		<Table>
			<TableHead>
				<TableRow>
					<TableHeader className="text-left">Employee</TableHeader>
					<TableHeader className="text-left">Designation</TableHeader>
					<TableHeader className="text-left">Email</TableHeader>
					<TableHeader className="text-left">Phone</TableHeader>
					<TableHeader className="text-left">Status</TableHeader>
					<TableHeader className="text-center">Actions</TableHeader>
				</TableRow>
			</TableHead>

			<TableBody>
				{employees?.map((employee) => (
					<TableRow
						key={employee.id}
						className="hover:bg-slate-50 transition-colors"
					>
						{/* Employee Info */}
						<TableCell>
							<div className="flex items-center gap-3">
								<img
									src={employee.personalInfo?.profileImage}
									alt={employee.personalInfo?.fullName}
									className="h-10 w-10 rounded-full object-cover"
								/>

								<div>
									<p className="font-medium text-slate-900">
										{employee.personalInfo?.fullName}
									</p>
									<p className="text-xs text-slate-500">
										{employee.employeeCode} | {employee.employeeId}
									</p>
								</div>
							</div>
						</TableCell>

						<TableCell>
							<p className="font-medium text-slate-900">
								{employee.employment?.designation}
							</p>
							<p className="text-xs text-slate-500">
								{employee.employment?.departmentName}
							</p>
						</TableCell>

						<TableCell className="max-w-55] truncate">
							{employee.personalInfo?.email}
						</TableCell>

						<TableCell className="whitespace-nowrap">
							{employee.personalInfo?.phone}
						</TableCell>

						<TableCell>
							<span
								className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
									STATUS_COLORS[employee.employment?.status] ||
									"bg-slate-100 text-slate-700"
								}`}
							>
								{employee.employment?.status}
							</span>
						</TableCell>

						<TableCell>
							<div className="flex justify-center gap-2">
								<button
									onClick={() => onView(employee)}
									className="rounded-md border border-slate-200 p-2 hover:bg-slate-100"
								>
									<Eye className="h-4 w-4" />
								</button>
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

EmployeeTable.propTypes = {
	employees: PropTypes.array.isRequired,
	onView: PropTypes.func.isRequired,
};

export default EmployeeTable;
