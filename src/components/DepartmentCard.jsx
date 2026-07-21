import PropTypes from "prop-types";
import { Eye, Star } from "lucide-react";
import { Card, CardAction, CardContent, CardFooter, CardGrid, CardHeader, CardItem, CardSubtitle, CardTitle } from "./common/InfoCard";
const DepartmentCard = ({ department, employees, onView }) => {
	const departmentEmployees = employees.filter(
		(emp) => emp.employment?.departmentId === department.departmentId,
	);
	const activeEmployees = departmentEmployees.filter(
		(emp) => emp.employment?.status === "Active",
	).length;
	const avgRating =
		departmentEmployees.length > 0
			? (
					departmentEmployees.reduce(
						(sum, emp) => sum + (emp.performance?.currentRating || 0),
						0,
					) / departmentEmployees.length
				).toFixed(1)
			: 0;
	const avgCTC =
		departmentEmployees.length > 0
			? Math.round(
					departmentEmployees.reduce(
						(sum, emp) => sum + (emp.salary?.employeeCTC || 0),
						0,
					) / departmentEmployees.length,
				)
			: 0;
	const locations = [
		...new Set(
			departmentEmployees.map((emp) => emp.employment?.workLocation),
		),
	];
	return (
		<Card>
			<CardHeader>
				<div>
					<CardTitle>{department.name}</CardTitle>
					<CardSubtitle>{department.departmentId}</CardSubtitle>
				</div>

				<CardAction onClick={() => onView(department)}>
					<Eye className="h-4 w-4" />
				</CardAction>
			</CardHeader>

			<CardContent>
				<CardGrid>
					<CardItem label="Employees" value={departmentEmployees.length} />

					<CardItem
						label="Active"
						value={activeEmployees}
						valueClassName="text-green-600"
					/>

					<CardItem
						label="Rating"
						value={
							<div className="flex items-center gap-1">
								<Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
								<span>{avgRating}</span>
							</div>
						}
					/>

					<CardItem
						label="Avg CTC"
						value={`₹${avgCTC.toLocaleString("en-IN")}`}
					/>
				</CardGrid>
			</CardContent>

			<CardFooter className="flex flex-wrap gap-2">
				{locations.slice(0, 2).map((location) => (
					<span
						key={location}
						className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
					>
						{location}
					</span>
				))}
				{locations.length > 2 && (
					<span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
						+{locations.length - 2}
					</span>
				)}
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
};
export default DepartmentCard;
