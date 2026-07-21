import { useMemo } from "react";
import { getDashboardSummary } from "../utils/dashboard.util";

export const useDashboardSummary = (employees, departments) => {
	return useMemo(
		() => getDashboardSummary(employees, departments),
		[employees, departments],
	);
};
