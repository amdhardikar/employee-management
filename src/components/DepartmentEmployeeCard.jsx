import PropTypes from "prop-types";
import { STATUS_COLORS } from "../constants/EMSconstants";

import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardContent,
	CardItem,
} from "./common/InfoCard";

const DepartmentEmployeeCard = ({ employee }) => {
	return (
		<Card className="rounded-sm">
			<CardHeader>
				<div>
					<CardTitle className="text-base">
						{employee.personalInfo?.fullName}
					</CardTitle>

					<CardSubtitle>{employee.employeeId}</CardSubtitle>
				</div>

				<span
					className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
						STATUS_COLORS[employee.employment?.status] ||
						"bg-slate-100 text-slate-700"
					}`}
				>
					{employee.employment?.status}
				</span>
			</CardHeader>

			<CardContent className="space-y-2 text-sm">
				<CardItem
					variant="horizontal"
					label="Designation"
					value={employee.employment?.designation}
				/>

				<CardItem
					variant="horizontal"
					label="Type"
					value={employee.employment?.employeeType}
				/>

				<CardItem
					variant="horizontal"
					label="Location"
					value={employee.employment?.workLocation}
				/>

				<CardItem
					variant="horizontal"
					label="Manager"
					value={employee.employment?.manager?.name || "-"}
				/>
			</CardContent>
		</Card>
	);
};

DepartmentEmployeeCard.propTypes = {
	employee: PropTypes.shape({
		employeeId: PropTypes.string,

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
