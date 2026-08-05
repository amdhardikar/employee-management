import { createSlice } from "@reduxjs/toolkit";
import logger from "../logging/logger";

// const getStoredTheme = () => localStorage.getItem("theme") || "light";

const initialState = {
	sidebarOpen: false,
	loading: false,
	// theme: getStoredTheme(),
};

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		openSidebar(state) {
			logger.debug("Sidebar opened");

			state.sidebarOpen = true;
		},

		closeSidebar(state) {
			logger.debug("Sidebar closed");

			state.sidebarOpen = false;
		},

		// setTheme(state, action) {
		// 	logger.info(`Theme changed to ${action.payload}`);

		// 	state.theme = action.payload;
		// 	localStorage.setItem("theme", action.payload);
		// },

		// resetUI() {
		// 	logger.info("UI state reset");
		// 	return initialState;
		// },
	},
});

export const { openSidebar, closeSidebar } = uiSlice.actions;

export default uiSlice.reducer;
