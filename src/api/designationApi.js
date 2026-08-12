/**
 * @fileoverview Defines the designationApi HTTP boundary for designation reference records used by employee forms. Every method logs its operation, checks HTTP status, parses the expected response, and converts network failures into a user-facing connection error.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/api/designationApi
 */
import logger from "../logging/logger";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const API_URL = "http://localhost:5000/designations";

export const designationApi = {
	getAll: async () => {
		try {
			const res = await fetchWithRetry(API_URL, undefined);
			if (!res.ok) throw new Error("Failed to load designations");
			return await res.json();
		} catch (error) {
			logger.error("Error fetching designations", error);
			if (error instanceof TypeError) {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},
	/**
	 * Fetches employees assigned to the supplied department identifier.
	 * @param {*} departmentId - The department id used by the request.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getByDepartment: async (departmentId) => {
		try {
			logger.debug(`Fetching designations for department: ${departmentId}`);
			const res = await fetchWithRetry(`${API_URL}?departmentId=${departmentId}`);

			if (!res.ok) {
				logger.error(`Failed to fetch designations for department: ${departmentId}. Status: ${res.status}`);
				throw new Error("Failed to load designations");
			}

			const data = await res.json();
			logger.info(`Designations loaded successfully for department: ${departmentId}. Count: ${data.length}`);

			return data;
		} catch (error) {
         logger.error(`Error fetching designations for department: ${departmentId}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},
};
