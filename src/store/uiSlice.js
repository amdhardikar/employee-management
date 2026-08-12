/**
 * @fileoverview Stores global presentation state shared across the application. It controls whether the responsive sidebar is open and exposes explicit open and close actions.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/store/uiSlice
 */
import { createSlice } from "@reduxjs/toolkit";
import logger from "../logging/logger";

const initialState = {
	sidebarOpen: false,
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

	},
});

export const { openSidebar, closeSidebar } = uiSlice.actions;

export default uiSlice.reducer;
