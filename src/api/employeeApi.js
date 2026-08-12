/**
 * @fileoverview Defines the employeeApi HTTP boundary for all employees, server-paginated/filterable lists, managers, employee and department lookups, authentication lookup, and employee create/update/delete operations. Every method logs its operation, checks HTTP status, parses the expected response, and converts network failures into a user-facing connection error.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/api/employeeApi
 */
import logger from "../logging/logger";
import { fetchWithRetry } from "../utils/fetchWithRetry";
import { normalizeApiError, readResponseError } from "../utils/apiError";

const API_URL = "http://localhost:5000/employees";

const DEFAULT_HEADERS = {
	"Content-Type": "application/json",
};

export const employeeApi = {
	/**
	 * Fetches the complete resource collection without pagination.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getAll: async () => {
		try {
			logger.debug("Fetching all employees");

			const res = await fetchWithRetry(API_URL, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch employees. Status: ${res.status}`);
				throw new Error(await readResponseError(res, "Failed to load employees"));
			}

			const data = await res.json();
			logger.info(`Employees loaded successfully. Count: ${data.length}`);

			return data;
		} catch (error) {
         logger.error("Error fetching all employees", error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw normalizeApiError(error);
		}
	},

	/**
	 * Fetches a server-paginated employee page using optional search, department, status, sorting, and ordering criteria.
	 * @param {Object} [options={}] - Query, filtering, sorting, and pagination options for the request.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getEmployees: async ({
		page = 1,
		pageSize = 10,
		search = "",
		department = "all",
		status = "all",
		sort = "employeeId",
		order = "desc",
	} = {}) => {
		try {
			logger.debug(`Fetching employees (page=${page}, pageSize=${pageSize})`);

			const params = new URLSearchParams();

			// Pagination
			params.append("_page", page);
			params.append("_limit", pageSize);

			// Sorting
			params.append("_sort", sort);
			params.append("_order", order);

			// Search
			if (search.trim()) {
				params.append("search", search.trim());
			}

			// Department filter
			if (department !== "all") {
				params.append("employment.departmentName", department);
			}

			// Status filter
			if (status !== "all") {
				params.append("employment.status", status);
			}

			const res = await fetchWithRetry(`${API_URL}?${params.toString()}`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch employees by filters. Status: ${res.status}`);
				throw new Error(await readResponseError(res, "Failed to fetch employees by filters"));
			}

			const data = await res.json();
			const totalItems = Number(res.headers.get("X-Total-Count"));
			logger.info(`Employees fetched successfully. Records: ${data.length}, Total: ${totalItems}`);

			return {
				data,
				page,
				pages: Math.ceil(totalItems / pageSize),
				items: totalItems,
			};
		} catch (error) {
         logger.error("Error fetching employees", error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw normalizeApiError(error);
		}
	},

	/**
	 * Fetches eligible managers and reduces each employee record to an ID/name option for forms.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getManagers: async () => {
		try {
			logger.debug("Fetching managers");

			const res = await fetchWithRetry(`${API_URL}/?employment.manager.id=null`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch managers. Status: ${res.status}`);
				throw new Error(await readResponseError(res, "Failed to load employee managers"));
			}

			const employees = await res.json();
			logger.info(`Managers loaded successfully. Count: ${employees.length}`);

			return employees.map((emp) => ({
				id: emp.id,
				name: emp.personalInfo.fullName,
			}));
		} catch (error) {
			logger.error("Error fetching managers", error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw normalizeApiError(error);
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
			logger.debug(`Fetching employee: ${id}`);
			const res = await fetchWithRetry(`${API_URL}?employeeId=${id}`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch employee: ${id}. Status: ${res.status}`);
				throw new Error(await readResponseError(res, "Failed to load employee by id"));
			}

			const data = await res.json();
			logger.info(`Employee loaded successfully. Employee ID: ${id}`);

			return data[0];
		} catch (error) {
			logger.error(`Error fetching employee: ${id}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw normalizeApiError(error);
		}
	},

	/**
	 * Fetches employees assigned to the supplied department identifier.
	 * @param {string|number} id - Record identifier used by the lookup or mutation.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getByDepartment: async (id) => {
		try {
			logger.debug(`Fetching employees for department: ${id}`);

			const res = await fetchWithRetry(`${API_URL}?employment.departmentId=${id}`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch employees for department: ${id}. Status: ${res.status}`);
				throw new Error(await readResponseError(res, "Failed to load department wise employees"));
			}

			const data = await res.json();

			logger.info(`Department employees loaded successfully. Department: ${id}, Count: ${data.length}`);

			return data;
		} catch (error) {
         logger.error(`Error fetching employees for department: ${id}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw normalizeApiError(error);
		}
	},

	/**
	 * Requests the employee record matching both login credentials for client-side authentication.
	 * @param {string} email - The email used by the request.
	 * @param {string} code - The code used by the request.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	getByEmailAndEmployeeCode: async (email, code) => {
		try {
			logger.debug(`Authenticating employee. Employee Code: ${code}`);

			const res = await fetchWithRetry(`${API_URL}?email=${email}&employeeCode=${code}`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Authentication failed for employee code: ${code}. Status: ${res.status}`);
				throw new Error(await readResponseError(res, "Failed to authenticate user"));
			}

			logger.info(`Authentication request completed for employee code: ${code}`);

			return res;
		} catch (error) {
         logger.error(`Error authenticating employee code: ${code}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw normalizeApiError(error);
		}
	},

	/**
	 * Creates an employee from the normalized employee form payload.
	 * @param {Object} employee - Employee domain record used by the component or operation.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	createEmployee: async (employee) => {
		try {
			logger.debug("Creating employee");

			const res = await fetch(API_URL, {
				method: "POST",
				headers: DEFAULT_HEADERS,
				body: JSON.stringify(employee),
			});

			if (!res.ok) {
				logger.error(`Failed to create employee. Status: ${res.status}`);
				throw new Error(await readResponseError(res, "Failed to create employee"));
			}

			const data = await res.json();

			logger.info(`Employee created successfully. Employee ID: ${data.employeeId}`);

			return data;
		} catch (error) {
         logger.error("Error creating employee", error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw normalizeApiError(error);
		}
	},

	/**
	 * Partially updates the server employee record with the supplied normalized fields.
	 * @param {string|number} id - Record identifier used by the lookup or mutation.
	 * @param {Object} employee - Employee domain record used by the component or operation.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	updateEmployee: async (id, employee) => {
		try {
			logger.debug(`Updating employee: ${id}`);

			const res = await fetch(`${API_URL}/${id}`, {
				method: "PATCH",
				headers: DEFAULT_HEADERS,
				body: JSON.stringify(employee),
			});

			if (!res.ok) {
				logger.error(`Failed to update employee: ${id}. Status: ${res.status}`);
				throw new Error(await readResponseError(res, "Failed to update employee"));
			}

			const data = await res.json();

			logger.info(`Employee updated successfully. ID: ${id}`);

			return data;
		} catch (error) {
         logger.error(`Error updating employee: ${id}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw normalizeApiError(error);
		}
	},

	/**
	 * Deletes the server employee record and resolves true after a successful response.
	 * @param {string|number} id - Record identifier used by the lookup or mutation.
	 * @returns {Promise<*>} Parsed service data, a paginated result, or a mutation confirmation.
	 * @throws {Error} When the server rejects the request or cannot be reached.
	 */
	removeEmployee: async (id) => {
		try {
			logger.debug(`Deleting employee: ${id}`);

			const res = await fetch(`${API_URL}/${id}`, {
				method: "DELETE",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to delete employee: ${id}. Status: ${res.status}`);
				throw new Error(await readResponseError(res, "Failed to delete employee"));
			}

			logger.info(`Employee deleted successfully. ID: ${id}`);

			return true;
		} catch (error) {
         logger.error(`Error deleting employee: ${id}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw normalizeApiError(error);
		}
	},
};
