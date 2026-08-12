/**
 * @fileoverview Defines the dashboardApi HTTP boundary for aggregate dashboard metrics displayed on the landing dashboard. Every method logs its operation, checks HTTP status, parses the expected response, and converts network failures into a user-facing connection error.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/api/dashboardApi
 */
import logger from "../logging/logger";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const API_URL = "http://localhost:5000/dashboard";

export const dashboardApi = {
	/**
	 * Fetches get dashboard data from the EMS service.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getDashboard: async () => {
		try {
			logger.debug("Fetching dashboard data");

			const res = await fetchWithRetry(API_URL);

			if (!res.ok) {
				logger.error(`Failed to fetch dashboard data. Status: ${res.status}`);
				throw new Error("Failed to load dashboard");
			}

			const data = await res.json();
			logger.info("Dashboard data loaded successfully");

			return data;
		} catch (error) {
			logger.error("Error fetching dashboard data", error);
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},
};
