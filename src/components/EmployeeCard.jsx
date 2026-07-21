import PropTypes from "prop-types";
import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardContent,
	CardItem,
	CardAction,
} from "./common/InfoCard";
import { Eye } from "lucide-react";
import { STATUS_COLORS } from "../constants/EMSconstants";

const EmployeeCard = ({ employee, onView }) => {
	return (
		<>
			<Card>
				<CardHeader className="items-center gap-3">
					<div className="flex min-w-0 flex-1 items-center gap-3">
						<img
							src={employee.personalInfo?.profileImage}
							alt={employee.personalInfo?.fullName}
							className="h-12 w-12 rounded-full object-cover"
						/>

						<div className="min-w-0 flex-1">
							<CardTitle className="truncate text-sm">
								{employee.personalInfo?.fullName}
							</CardTitle>

							<CardSubtitle>{employee.employeeCode}</CardSubtitle>
						</div>
					</div>

					<CardAction onClick={() => onView(employee)}>
						<Eye className="h-4 w-4" />
					</CardAction>
				</CardHeader>

				<CardContent className="space-y-2 text-xs">
					<CardItem>
						<span className="font-medium text-slate-900">
							Designation:
						</span>{" "}
						{employee.employment?.designation}
					</CardItem>

					<CardItem>
						<span className="font-medium text-slate-900">Location:</span>{" "}
						{employee.employment?.workLocation}
					</CardItem>

					<CardItem className="truncate">
						<span className="font-medium text-slate-900">Email:</span>{" "}
						{employee.personalInfo?.email}
					</CardItem>

					<CardItem>
						<span className="font-medium text-slate-900">Phone:</span>{" "}
						{employee.personalInfo?.phone}
					</CardItem>
				</CardContent>

				<div className="mt-4 flex items-center justify-between">
					<span
						className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
							STATUS_COLORS[employee.employment?.status] ||
							"bg-slate-100 text-slate-700"
						}`}
					>
						{employee.employment?.status}
					</span>
				</div>
			</Card>
		</>
	);
};

EmployeeCard.propTypes = {
	employee: PropTypes.object.isRequired,
	onView: PropTypes.func.isRequired,
};

export default EmployeeCard;
