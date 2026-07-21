import { useMemo } from "react";
import { filteredPayroll } from "../utils/payroll.util";

export const useFilteredPayroll = ({
	employees,
	search,
	department,
	payStatus,
}) => {
	return useMemo(
		() => filteredPayroll(employees, search, department, payStatus),
		[employees, search, department, payStatus],
	);
};
