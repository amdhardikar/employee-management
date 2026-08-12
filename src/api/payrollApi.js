/**
 * @fileoverview Defines the payrollApi HTTP boundary for payroll lists and individual employee payroll records. Every method logs its operation, checks HTTP status, parses the expected response, and converts network failures into a user-facing connection error.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/api/payrollApi
 */
import logger from "../logging/logger";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const API_URL = "http://localhost:5000/payrolls";

export const payrollApi = {
	/**
	 * Fetches get by employee id data from the EMS service.
	 * @param {*} employeeId - The employee id used by the request.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getByEmployeeId: async (employeeId) => {
		try {
			logger.debug(`Fetching payroll records for employee: ${employeeId}`);

			const res = await fetchWithRetry(`${API_URL}?employeeId=${employeeId}`);

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
