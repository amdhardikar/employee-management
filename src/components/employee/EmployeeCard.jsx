/**
 * @fileoverview Renders one employee record in the responsive card presentation. It highlights the most important summary fields and status and delegates navigation or actions through its callback properties.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/employee/EmployeeCard
 */
import PropTypes from "prop-types";
import { memo } from "react";
import { display, phone } from "../../utils/formatter";
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardItem, CardAction, CardFooter } from "../common/InfoCard";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { STATUS_COLORS } from "../../constants/EMSconstants";
import ProfileImage from "../common/ProfileImage";

/**
 * Renders the employee card interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object} props.employee - Employee domain record used by the component or operation.
 * @param {Function} props.onView - Called with the selected record when the user requests details.
 * @param {Function} props.onEdit - Called with the selected record when the user requests editing.
 * @param {Function} props.onDelete - Called with the selected record when the user requests deletion.
 * @returns {JSX.Element} Rendered React user interface.
 */
const EmployeeCard = ({ employee, onView, onEdit, onDelete }) => {
	return (
		<>
			<Card className="min-w-0 w-full">
				<CardHeader>
					<div className="flex min-w-0 flex-1 items-center gap-3">
						<ProfileImage
							src={employee.personalInfo?.profileImage}
							name={employee.fullName}
							className="h-12 w-12 rounded-full object-cover"
						/>

						<div className="min-w-0 flex-1">
							<CardTitle className="truncate text-sm">{employee.fullName}</CardTitle>

							<CardSubtitle>{employee.employeeCode}</CardSubtitle>
						</div>
					</div>

				</CardHeader>

				<CardContent className="space-y-2 text-xs">
					<CardItem>
						<span className="font-medium text-slate-900">Designation:</span>{" "}
						{display(employee.employment?.designation, "Not Assigned")}
					</CardItem>

					<CardItem>
						<span className="font-medium text-slate-900">Location:</span>{" "}
						{display(employee.employment?.workLocation)}
					</CardItem>

					<CardItem className="truncate">
						<span className="font-medium text-slate-900">Email:</span> {display(employee.email)}
					</CardItem>

					<CardItem>
						<span className="font-medium text-slate-900">Phone:</span> {phone(employee.personalInfo?.phone)}
					</CardItem>
				</CardContent>

				<div className="mt-4 flex items-center justify-between">
					<span
						className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
							STATUS_COLORS[employee.employment?.status] || "bg-slate-100 text-slate-700"
						}`}
					>
						{display(employee.employment?.status)}
					</span>
				</div>

				<CardFooter className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
					<CardAction ariaLabel="View employee" onClick={() => onView(employee)} className="flex w-full justify-center border-blue-200 text-blue-700 hover:bg-blue-50"><Eye className="h-4 w-4" /></CardAction>
					<CardAction ariaLabel="Edit employee" onClick={() => onEdit(employee)} className="flex w-full justify-center border-green-200 text-green-700 hover:bg-green-50"><Pencil className="h-4 w-4" /></CardAction>
					<CardAction ariaLabel="Delete employee" onClick={() => onDelete(employee)} className="flex w-full justify-center border-red-200 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></CardAction>
				</CardFooter>
			</Card>
		</>
	);
};

EmployeeCard.propTypes = {
	employee: PropTypes.object.isRequired,
	onView: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default memo(EmployeeCard);
