/**
 * @fileoverview Renders one department employee record in the responsive card presentation. It highlights the most important summary fields and status and delegates navigation or actions through its callback properties.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/department/DepartmentEmployeeCard
 */
import PropTypes from "prop-types";
import { STATUS_COLORS } from "../../constants/EMSconstants";
import { display } from "../../utils/formatter";
import { NavLink } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardItem } from "../common/InfoCard";

/**
 * Renders the department employee card interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {Object} props.employee - Employee domain record used by the component or operation.
 * @returns {JSX.Element} Rendered React user interface.
 */
const DepartmentEmployeeCard = ({ employee }) => {
	return (
		<Card className="rounded-sm">
			<CardHeader>
				<div>
					<NavLink className="cursor-pointer font-semibold text-blue-700 hover:underline" to={`/employees/${employee.employeeId}`}>
						{display(employee.fullName ?? employee.personalInfo?.fullName)}
					</NavLink>

					<CardSubtitle>{display(employee.employeeId)} | {display(employee.employeeCode)}</CardSubtitle>
				</div>

				<span
					className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
						STATUS_COLORS[employee.employment?.status] || "bg-slate-100 text-slate-700"
					}`}
				>
					{display(employee.employment?.status)}
				</span>
			</CardHeader>

			<CardContent className="grid grid-cols-1 gap-x-8 gap-y-2 text-sm md:grid-cols-2">
				<CardItem variant="horizontal" label="Designation" value={display(employee.employment?.designation)} />

				<CardItem variant="horizontal" label="Type" value={display(employee.employment?.employeeType)} />

				<CardItem variant="horizontal" label="Location" value={display(employee.employment?.workLocation)} />

				<CardItem variant="horizontal" label="Manager" value={display(employee.employment?.manager?.name)} />
			</CardContent>
		</Card>
	);
};

DepartmentEmployeeCard.propTypes = {
	employee: PropTypes.shape({
		employeeId: PropTypes.string,
		employeeCode: PropTypes.string,

		fullName: PropTypes.string,
		personalInfo: PropTypes.shape({
			fullName: PropTypes.string,
		}),

		employment: PropTypes.shape({
			status: PropTypes.string,
			designation: PropTypes.string,
			employeeType: PropTypes.string,
			workLocation: PropTypes.string,

			manager: PropTypes.shape({
				name: PropTypes.string,
			}),
		}),
	}).isRequired,
};

export default DepartmentEmployeeCard;
