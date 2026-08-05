import logger from "../logging/logger";

const API_URL = "http://localhost:5000/departments";

export const departmentApi = {
	getAll: async () => {
		try {
			logger.debug("Fetching all departments");
			const res = await fetch(API_URL, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				logger.error(`Failed to fetch departments. Status: ${res.status}`);
				throw new Error("Failed to load departments");
			}

			const data = await res.json();
			logger.info(`Departments loaded successfully. Count: ${data.length}`);
			return data;
		} catch (error) {
			logger.error("Error fetching departments", error);
			throw error;
		}
	},

	getById: async (id) => {
		try {
			logger.debug(`Fetching department with ID: ${id}`);
			const res = await fetch(`${API_URL}?departmentId=${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				logger.error(`Failed to fetch department with ID: ${id}. Status: ${res.status}`);
				throw new Error("Failed to load department by id");
			}

			const data = await res.json();
			logger.info(`Department loaded successfully. ID: ${id}`);

			return data;
		} catch (error) {
			logger.error(`Error fetching department with ID: ${id}`, error);
			throw error;
		}
	},

	updateDepartment: async (departmentId, body) => {
		try {
			logger.debug(`Updating department: ${departmentId}`, body);
			const res = await fetch(`${API_URL}/${departmentId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const errorData = await res.json();
				logger.error(`Failed to update department: ${departmentId}. Status: ${res.status}`, errorData);
				throw new Error(errorData.error || "Failed to update department");
			}

			const data = await res.json();
			logger.info(`Department updated successfully. ID: ${departmentId}`);

			return data;
		} catch (error) {
			logger.error(`Error updating department: ${departmentId}`, error);
			throw error;
		}
	},
};
