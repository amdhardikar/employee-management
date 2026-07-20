import EmployeeCard from "./EmployeeCard";

const EmployeeList = ({ employees, onViewEmployee, onEditEmployee }) => {
	return (
		<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
			{employees.map((employee) => (
				<EmployeeCard
					key={employee.id}
					employee={employee}
					onView={onViewEmployee}
					onEdit={onEditEmployee}
				/>
			))}
		</div>
	);
};

export default EmployeeList;

/* need to remove */