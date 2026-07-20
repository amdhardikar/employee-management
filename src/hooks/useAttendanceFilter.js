import { useMemo } from "react";
import { filterAttendance } from "../utils/attendance.util";

export const useAttendanceFilters = ({
	employees,
	search,
	department,
}) => {
	return useMemo(
		() => filterAttendance(employees, search, department),
		[employees, search, department],
	);
};
