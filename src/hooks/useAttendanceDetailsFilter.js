import { useMemo } from "react";
import { filterAttendanceDetails } from "../utils/attendanceDetails.util";

export const useAttendanceDetailsFilter = ({ attendance, search, year, month }) => {
	return useMemo(() => {
		return filterAttendanceDetails(attendance, search, year, month);
	}, [attendance, search, year, month]);
};
