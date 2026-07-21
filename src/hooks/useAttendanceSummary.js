import { useMemo } from "react";
import { getAttendanceSummary } from "../utils/attendanceDetails.util";

export const useAttendanceSummary = (attendance) => {
	return useMemo(() => getAttendanceSummary(attendance), [attendance]);
};
