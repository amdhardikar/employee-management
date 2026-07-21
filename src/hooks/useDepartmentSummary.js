import { useMemo } from "react";
import { getDepartmentSummary } from "../utils/departmentDetails.util";

export const useDepartmentSummary = (employees) => {
	return useMemo(() => getDepartmentSummary(employees), [employees]);
};
