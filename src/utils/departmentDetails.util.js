import { departmentApi } from "../api/departmentApi";
import { employeeApi } from "../api/employeeApi";

export const loadDepartmentDetails = async (id) => {
	return await departmentApi.getById(id);
};

export const loadDepartmentEmployees = async (departmentId) => {
	return await employeeApi.getByDepartment(departmentId);
};
