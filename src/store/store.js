import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./uiSlice";
import authReducer from "./authSlice";
import dashboardReducer from "./dashboardSlice";
import filters from "./filterSlice";

export const store = configureStore({
	reducer: {
		ui: uiReducer,
		auth: authReducer,
		dashboard: dashboardReducer,
		filters: filters,
	},
});
