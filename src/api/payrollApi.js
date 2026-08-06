import logger from "../logging/logger";

const API_URL = "http://localhost:5000/payrolls";

export const payrollApi = {
	getByEmployeeId: async (employeeId) => {
		try {
			logger.debug(`Fetching payroll records for employee: ${employeeId}`);

			const res = await fetch(`${API_URL}?employeeId=${employeeId}`);

			if (!res.ok) {
				logger.error(`Failed to fetch payroll records for employee: ${employeeId}. Status: ${res.status}`);
				throw new Error("Failed to load employee payroll");
			}

			const data = await res.json();
			logger.info(`Payroll records loaded successfully for employee: ${employeeId}. Count: ${data.length}`);

			return data;
		} catch (error) {
         logger.error(`Error fetching payroll records for employee: ${employeeId}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},
};
