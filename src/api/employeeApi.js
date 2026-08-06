import logger from "../logging/logger";

const API_URL = "http://localhost:5000/employees";

const DEFAULT_HEADERS = {
	"Content-Type": "application/json",
};

export const employeeApi = {
	getAll: async () => {
		try {
			logger.debug("Fetching all employees");

			const res = await fetch(API_URL, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch employees. Status: ${res.status}`);
				throw new Error("Failed to load employees");
			}

			const data = await res.json();
			logger.info(`Employees loaded successfully. Count: ${data.length}`);

			return data;
		} catch (error) {
         logger.error("Error fetching all employees", error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

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

			const res = await fetch(`${API_URL}?${params.toString()}`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch employees by filters. Status: ${res.status}`);
				throw new Error("Failed to fetch employees by filters");
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
			throw error;
		}
	},

	getManagers: async () => {
		try {
			logger.debug("Fetching managers");

			const res = await fetch(`${API_URL}/?employment.manager.id=null`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch managers. Status: ${res.status}`);
				throw new Error("Failed to load employee managers");
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
			throw error;
		}
	},

	getById: async (id) => {
		try {
			logger.debug(`Fetching employee: ${id}`);
			const res = await fetch(`${API_URL}?employeeId=${id}`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch employee: ${id}. Status: ${res.status}`);
				throw new Error("Failed to load employee by id");
			}

			const data = await res.json();
			logger.info(`Employee loaded successfully. Employee ID: ${id}`);

			return data[0];
		} catch (error) {
			logger.error(`Error fetching employee: ${id}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

	getByDepartment: async (id) => {
		try {
			logger.debug(`Fetching employees for department: ${id}`);

			const res = await fetch(`${API_URL}?employment.departmentId=${id}`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to fetch employees for department: ${id}. Status: ${res.status}`);
				throw new Error("Failed to load department wise employees");
			}

			const data = await res.json();

			logger.info(`Department employees loaded successfully. Department: ${id}, Count: ${data.length}`);

			return data;
		} catch (error) {
         logger.error(`Error fetching employees for department: ${id}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

	getByEmailAndEmployeeCode: async (email, code) => {
		try {
			logger.debug(`Authenticating employee. Employee Code: ${code}`);

			const res = await fetch(`${API_URL}?email=${email}&employeeCode=${code}`, {
				method: "GET",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Authentication failed for employee code: ${code}. Status: ${res.status}`);
				throw new Error("Failed to authenticate user");
			}

			logger.info(`Authentication request completed for employee code: ${code}`);

			return res;
		} catch (error) {
         logger.error(`Error authenticating employee code: ${code}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

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
				throw new Error("Failed to create employee");
			}

			const data = await res.json();

			logger.info(`Employee created successfully. Employee ID: ${data.employeeId}`);

			return data;
		} catch (error) {
         logger.error("Error creating employee", error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

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
				throw new Error("Failed to update employee");
			}

			const data = await res.json();

			logger.info(`Employee updated successfully. ID: ${id}`);

			return data;
		} catch (error) {
         logger.error(`Error updating employee: ${id}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},

	removeEmployee: async (id) => {
		try {
			logger.debug(`Deleting employee: ${id}`);

			const res = await fetch(`${API_URL}/${id}`, {
				method: "DELETE",
				headers: DEFAULT_HEADERS,
			});

			if (!res.ok) {
				logger.error(`Failed to delete employee: ${id}. Status: ${res.status}`);
				throw new Error("Failed to delete employee");
			}

			logger.info(`Employee deleted successfully. ID: ${id}`);

			return true;
		} catch (error) {
         logger.error(`Error deleting employee: ${id}`, error);
         if (error instanceof TypeError && error.message === "Failed to fetch") {
				throw new Error("Unable to connect to server. Please try again later.");
			}
			throw error;
		}
	},
};
