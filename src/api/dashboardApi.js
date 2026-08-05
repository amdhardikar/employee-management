const API_URL = "http://localhost:5000/dashboard";

export const dashboardApi = {
	getDashboard: async () => {
      const res = await fetch(`${API_URL}`);
      
      if (!res.ok) {
			throw new Error("Failed to load dashboard");
		}

		return res.json();
	},
};
