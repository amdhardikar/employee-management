const API_URL = "http://localhost:5000/employees";

export const employeeApi = {
	getAll: async () => {
		const res = await fetch(`${API_URL}`);
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

		const res = await fetch(`${API_URL}?${params.toString()}`);

		if (!res.ok) {
			throw new Error("Failed to fetch employees");
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
		const res = await fetch(`${API_URL}/?employment.manager.id=null`);
		const employees = await res.json();
		const managers = employees.map((emp) => ({
			id: emp.id,
			name: emp.personalInfo.fullName,
		}));

		return managers;
	},
	getById: async (id) => {
		const res = await fetch(`${API_URL}?employeeId=${id}`);
		return res.json();
	},
	getByDepartment: async (id) => {
		const res = await fetch(`${API_URL}?employment.departmentId=${id}`);
		return res.json();
	},
	getByEmailAndEmployeeCode: async (email, code) => {
		const res = await fetch(
			`${API_URL}?email=${email}&employeeCode=${code}`,
		);
		return res;
	},
};
