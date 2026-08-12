/**
 * @fileoverview Creates the Redux store and registers authentication, dashboard, department, filter, and UI reducers. This is the single store instance passed to React at application startup.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/store/store
 */
import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./uiSlice";
import authReducer from "./authSlice";
import dashboardReducer from "./dashboardSlice";
import filters from "./filterSlice";
import departmentReducer from "./departmentSlice";
import designationReducer from "./designationSlice";

export const store = configureStore({
	reducer: {
		ui: uiReducer,
		auth: authReducer,
		dashboard: dashboardReducer,
		filters: filters,
		department: departmentReducer,
		designation: designationReducer,
	},
});
