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

export const filteredPayroll = (employees, search, department, payStatus) => {
	return employees.filter((employee) => {
		const matchesSearch =
			employee.personalInfo?.fullName
				?.toLowerCase()
				.includes(search.toLowerCase()) ||
			employee.employeeId?.toLowerCase().includes(search.toLowerCase());

		const matchesDepartment =
			department === "all" ||
			employee.employment?.departmentName === department;

		const matchesStatus =
			payStatus === "all" || employee.recentPayslip?.status === payStatus;

		return matchesSearch && matchesDepartment && matchesStatus;
	});
};

