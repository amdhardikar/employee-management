/**
 * @fileoverview Renders one department record in the responsive card presentation. It highlights the most important summary fields and status and delegates navigation or actions through its callback properties.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/department/DepartmentCard
 */
import PropTypes from "prop-types";
import { currency, display } from "../../utils/formatter";
import { Eye, Pencil, Star, Trash2 } from "lucide-react";
import {
	Card,
	CardAction,
	CardContent,
	CardFooter,
	CardGrid,
	CardHeader,
	CardItem,
	CardSubtitle,
	CardTitle,
} from "../common/InfoCard";
/**
 * Renders the department card interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object|string} props.department - Selected department value or department record.
 * @param {Object[]} props.employees - Employee records to display or summarize.
 * @param {Function} props.onView - Called with the selected record when the user requests details.
 * @param {Function} props.onEdit - Called with the selected record when the user requests editing.
 * @param {Function} props.onDelete - Called with the selected record when the user requests deletion.
 * @returns {JSX.Element} Rendered React user interface.
 */
const DepartmentCard = ({ department, employees, onView, onEdit, onDelete }) => {
	const departmentEmployees = employees.filter((emp) => emp.employment?.departmentId === department.departmentId);
	const activeEmployees = departmentEmployees.filter((emp) => emp.employment?.status === "Active").length;
	const avgRating =
		departmentEmployees.length > 0
			? (
					departmentEmployees.reduce((sum, emp) => sum + (emp.performance?.currentRating || 0), 0) /
					departmentEmployees.length
				).toFixed(1)
			: 0;
	const avgCTC =
		departmentEmployees.length > 0
			? Math.round(
					departmentEmployees.reduce((sum, emp) => sum + (emp.salary?.employeeCTC || 0), 0) /
						departmentEmployees.length,
				)
			: 0;
	const locations = [...new Set(departmentEmployees.map((emp) => emp.employment?.workLocation))];
	return (
		<Card>
			<CardHeader>
				<div>
					<CardTitle>{department.name}</CardTitle>
					<CardSubtitle>{department.departmentId}</CardSubtitle>
				</div>

			</CardHeader>

			<CardContent>
				<CardGrid>
					<CardItem label="Employees" value={departmentEmployees.length} />

					<CardItem label="Active" value={activeEmployees} valueClassName="text-green-600" />

					<CardItem
						label="Rating"
						value={
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
								<span>{avgRating}</span>
							</div>
						}
					/>

					<CardItem label="Avg CTC" value={currency(avgCTC)} />
				</CardGrid>
			</CardContent>

			<CardFooter className="flex flex-wrap gap-2">
				{locations.slice(0, 2).map((location) => (
					<span key={location} className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
						{display(location)}
					</span>
				))}
				{locations.length > 2 && (
					<span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
						+{locations.length - 2}
					</span>
				)}
			</CardFooter>
			<CardFooter className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
				<CardAction ariaLabel="View department" onClick={() => onView(department)} className="flex w-full justify-center border-blue-200 text-blue-700 hover:bg-blue-50"><Eye className="h-4 w-4" /></CardAction>
				<CardAction ariaLabel="Edit department" onClick={() => onEdit(department)} className="flex w-full justify-center border-green-200 text-green-700 hover:bg-green-50"><Pencil className="h-4 w-4" /></CardAction>
				<CardAction ariaLabel="Delete department" onClick={() => onDelete(department)} className="flex w-full justify-center border-red-200 text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4" /></CardAction>
			</CardFooter>
		</Card>
	);
};
DepartmentCard.propTypes = {
	department: PropTypes.shape({
		departmentId: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
	employees: PropTypes.array.isRequired,
	onView: PropTypes.func.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};
export default DepartmentCard;
