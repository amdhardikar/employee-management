import { employeeApi } from "../api/employeeApi";

export const loadEmployees = async () => {
	return await employeeApi.getAll("_sort=-employeeId");
};

export const getEmployeeDepartments = (employees) => {
	return [
		...new Set(
			employees.map((employee) => employee.employment?.departmentName),
		),
	].filter(Boolean);
};

export const filterEmployees = (employees, search, department, status) => {
	return employees.filter((employee) => {
		const matchesSearch =
			employee.personalInfo?.fullName
				?.toLowerCase()
				.includes(search.toLowerCase()) ||
			employee.employeeId?.toLowerCase().includes(search.toLowerCase()) ||
			employee.personalInfo?.email
				?.toLowerCase()
				.includes(search.toLowerCase());

		const matchesDepartment =
			department === "all" ||
			employee.employment?.departmentName === department;

		const matchesStatus =
			status === "all" || employee.employment?.status === status;

		return matchesSearch && matchesDepartment && matchesStatus;
	});
};

export const getEmployeeStatuses = (employees) => {
	return [
		...new Set(employees.map((employee) => employee.employment?.status)),
	].filter(Boolean);
};
