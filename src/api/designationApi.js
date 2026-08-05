import logger from "../logging/logger";

const API_URL = "http://localhost:5000/designations";

export const designationApi = {
	getByDepartment: async (departmentId) => {
		try {
			logger.debug(`Fetching designations for department: ${departmentId}`);
			const res = await fetch(`${API_URL}?departmentId=${departmentId}`);

			if (!res.ok) {
				logger.error(`Failed to fetch designations for department: ${departmentId}. Status: ${res.status}`);
				throw new Error("Failed to load designations");
			}

			const data = await res.json();
			logger.info(`Designations loaded successfully for department: ${departmentId}. Count: ${data.length}`);

			return data;
		} catch (error) {
			logger.error(`Error fetching designations for department: ${departmentId}`, error);
			throw error;
		}
	},
};
