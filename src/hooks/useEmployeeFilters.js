import { useMemo } from "react";
import { filterEmployees } from "../utils/employee.util";

export const useEmployeeFilters = ({ employees, search, department, status,}) => {
	return useMemo(
		() => filterEmployees(employees, search, department, status),
		[employees, search, department, status],
	);
};
