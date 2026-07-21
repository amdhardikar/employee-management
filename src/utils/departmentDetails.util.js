import { departmentApi } from "../api/departmentApi";
import { employeeApi } from "../api/employeeApi";

export const loadDepartmentDetails = async (id) => {
	return await departmentApi.getById(id);
};

export const loadDepartmentEmployees = async (departmentId) => {
	return await employeeApi.getByDepartment(departmentId);
};

export const getDepartmentSummary = (employees) => ({
	totalEmployees: employees.length,

	activeEmployees: employees.filter(
		(emp) => emp.employment.status === "Active",
	).length,

	absentEmployees: employees.filter(
		(emp) => emp.employment.status === "On Leave",
	).length,

	resignedEmployees: employees.filter(
		(emp) => emp.employment.status === "Resigned",
	).length,

	contractEmployees: employees.filter(
		(emp) => emp.employment.employeeType === "Contract",
	).length,

	permanentEmployees: employees.filter(
		(emp) =>
			emp.employment.employeeType === "Intern" ||
			emp.employment.employeeType === "Full time",
	).length,
});
