const API_URL = "http://localhost:5000/dashboard";

export const dashboardApi = {
	getDashboard: async () => {
		const res = await fetch(`${API_URL}`);
		return res.json();
	},
};
