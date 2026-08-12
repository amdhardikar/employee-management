/**
 * @fileoverview Defines the departmentApi HTTP boundary for department lists and individual departments, plus department create/update/delete operations. Every method logs its operation, checks HTTP status, parses the expected response, and converts network failures into a user-facing connection error.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/api/departmentApi
 */
import logger from "../logging/logger";
import { fetchWithRetry } from "../utils/fetchWithRetry";

const API_URL = "http://localhost:5000/departments";

export const departmentApi = {
	/**
	 * Fetches a searchable, server-paginated department page.
	 * @param {Object} [options={}] - Search, sorting, and pagination options.
	 * @returns {Promise<{data: Array, page: number, pages: number, items: number}>} Paginated departments.
	 */
	getDepartments: async ({
		page = 1,
		pageSize = 10,
		search = "",
		sort = "departmentId",
		order = "asc",
	} = {}) => {
		try {
			const params = new URLSearchParams({
				_page: page,
				_limit: pageSize,
				_sort: sort,
				_order: order,
			});

			if (search.trim()) {
				params.append("search", search.trim());
			}

			const res = await fetchWithRetry(`${API_URL}?${params.toString()}`, {
				method: "GET",
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				throw new Error("Failed to fetch departments by filters");
			}

			const data = await res.json();
			const totalItems = Number(res.headers.get("X-Total-Count"));

			return {
				data,
				page,
				pages: Math.ceil(totalItems / pageSize),
				items: totalItems,
			};
		} catch (error) {
			logger.error("Error fetching departments by filters", error);
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

	/**
	 * Fetches the complete resource collection without pagination.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getAll: async () => {
		try {
			logger.debug("Fetching all departments");
			const res = await fetchWithRetry(API_URL, {
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
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

	/**
	 * Fetches the single resource matching the supplied business or server identifier.
	 * @param {string|number} id - Record identifier used by the lookup or mutation.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getById: async (id) => {
		try {
			logger.debug(`Fetching department with ID: ${id}`);
			const res = await fetchWithRetry(`${API_URL}?departmentId=${id}`, {
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

			return data[0];
		} catch (error) {
			logger.error(`Error fetching department with ID: ${id}`, error);
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

	/**
	 * Updates the server department record with the supplied fields.
	 * @param {*} departmentId - The department id used by the request.
	 * @param {*} body - The body used by the request.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
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
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},
	/**
	 * Creates a department from the validated department form payload.
	 * @param {*} body - The body used by the request.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	createDepartment: async (body) => {
		try {
			logger.debug("Creating department", body);

			const res = await fetch(API_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			});

			if (!res.ok) {
				const errorData = await res.json();

				logger.error("Failed to create department", errorData);
				throw new Error(errorData.error || "Failed to create department");
			}

			const data = await res.json();
			logger.info("Department created successfully");

			return data;
		} catch (error) {
			logger.error("Error creating department", error);
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

	/**
	 * Deletes the server department record and resolves after a successful response.
	 * @param {string|number} id - Record identifier used by the lookup or mutation.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	removeDepartment: async (id) => {
		try {
			logger.debug(`Deleting department: ${id}`);

			const res = await fetch(`${API_URL}/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!res.ok) {
				logger.error(`Failed to delete department: ${id}. Status: ${res.status}`);
				throw new Error("Failed to delete department");
			}

			logger.info(`Department deleted successfully. ID: ${id}`);

			return true;
		} catch (error) {
			logger.error(`Error deleting department: ${id}`, error);
			if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},
};
