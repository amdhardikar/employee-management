import { employeeApi } from "../api/employeeApi";

export const loadAttendance = async () => {
	return await employeeApi.getAll();
};

export const getAttendanceDepartments = (employees) => {
	return [
		...new Set(
			employees.map((employee) => employee.employment?.departmentName),
		),
	].filter(Boolean);
};

export const filterAttendance = (employees, search, department) => {
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

		return matchesSearch && matchesDepartment;
	});
};
