import logger from "../logging/logger";

const API_URL = "http://localhost:5000/dashboard";

export const dashboardApi = {
	getDashboard: async () => {
		try {
			logger.debug("Fetching dashboard data");

			const res = await fetch(API_URL);

			if (!res.ok) {
				logger.error(`Failed to fetch dashboard data. Status: ${res.status}`);

				throw new Error("Failed to load dashboard");
			}

			const data = await res.json();

			logger.info("Dashboard data loaded successfully");

			return data;
		} catch (error) {
			logger.error("Error fetching dashboard data", error);

			throw error;
		}
	},
};
