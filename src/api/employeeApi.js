const API_URL = "http://localhost:5000/employees";

const DEFAULT_HEADERS = {
	"Content-Type": "application/json",
};

export const employeeApi = {
	getAll: async () => {
		const res = await fetch(API_URL, {
			method: "GET",
			headers: DEFAULT_HEADERS,
		});

		if (!res.ok) {
			throw new Error("Failed to load all employees");
		}

		return res.json();
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
			throw new Error("Failed to fetch employees by filters");
		}

		const data = await res.json();
		const totalItems = Number(res.headers.get("X-Total-Count"));

		return {
			data,
			page,
			pages: Math.ceil(totalItems / pageSize),
			items: totalItems,
		};
	},

	getManagers: async () => {
		const res = await fetch(`${API_URL}/?employment.manager.id=null`, {
			method: "GET",
			headers: DEFAULT_HEADERS,
		});

		if (!res.ok) {
			throw new Error("Failed to load employee managers");
		}

		const employees = await res.json();

		return employees.map((emp) => ({
			id: emp.id,
			name: emp.personalInfo.fullName,
		}));
	},

	getById: async (id) => {
		const res = await fetch(`${API_URL}?employeeId=${id}`, {
			method: "GET",
			headers: DEFAULT_HEADERS,
		});

		if (!res.ok) {
			throw new Error("Failed to load employee by id");
		}
		const data = await res.json();

		return data[0];
	},

	getByDepartment: async (id) => {
		const res = await fetch(`${API_URL}?employment.departmentId=${id}`, {
			method: "GET",
			headers: DEFAULT_HEADERS,
		});

		if (!res.ok) {
			throw new Error("Failed to load department wise employees");
		}

		return res.json();
	},

	getByEmailAndEmployeeCode: async (email, code) => {
		const res = await fetch(`${API_URL}?email=${email}&employeeCode=${code}`, {
			method: "GET",
			headers: DEFAULT_HEADERS,
		});

		if (!res.ok) {
			throw new Error("Failed to authenticate user");
		}

		return res;
	},

	createEmployee: async (employee) => {
		const res = await fetch(API_URL, {
			method: "POST",
			headers: DEFAULT_HEADERS,
			body: JSON.stringify(employee),
		});

		if (!res.ok) {
			throw new Error("Failed to create employee");
		}

		return res.json();
	},

	updateEmployee: async (id, employee) => {
		const res = await fetch(`${API_URL}/${id}`, {
			method: "PATCH",
			headers: DEFAULT_HEADERS,
			body: JSON.stringify(employee),
		});

		if (!res.ok) {
			throw new Error("Failed to update employee");
		}

		return res.json();
	},

	removeEmployee: async (id) => {
		const res = await fetch(`${API_URL}/${id}`, {
			method: "DELETE",
			headers: DEFAULT_HEADERS,
		});

		if (!res.ok) {
			throw new Error("Failed to delete employee");
		}

		return true;
	},
};
