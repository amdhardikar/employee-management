import logger from "../logging/logger";

const API_URL = "http://localhost:5000/monthlyAttendance";

export const attendanceApi = {
	getByEmployeeId: async (employeeId) => {
		try {
			logger.debug(`Fetching monthly attendance for employee: ${employeeId}`);
			const res = await fetch(`${API_URL}?employeeId=${employeeId}&_sort=createdAt&_order=desc`);

			if (!res.ok) {
				logger.error(`Failed to fetch monthly attendance for employee: ${employeeId}. Status: ${res.status}`);
				throw new Error("Failed to load employee attendance");
			}

			const data = await res.json();
			logger.info(`Monthly attendance loaded for employee: ${employeeId}. Records: ${data.length}`);

			return data;
		} catch (error) {
			logger.error(`Error fetching monthly attendance for employee: ${employeeId}`, error);
			throw error;
		}
	},
};
