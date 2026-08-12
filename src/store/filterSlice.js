/**
 * @fileoverview Stores independent list controls for employee, attendance, payroll, and department screens. It provides consistent defaults for desktop pagination, mobile load-more pagination, search, sorting, and department/status filters, with per-module and global reset actions.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/store/filterSlice
 */
import { createSlice } from "@reduxjs/toolkit";
import logger from "../logging/logger";

/**
 * Create default filters.
 * @param {Object} overrides - Filter values that replace module defaults.
 * @returns {*} Computed result.
 */
const createDefaultFilters = (overrides = {}) => ({
	tablePage: 1,
	cardPage: 1,
	pageSize: 10,
	search: "",
	sort: "employeeId",
	order: "desc",
	department: "all",
	...overrides,
});

const initialState = {
	employee: createDefaultFilters({
		status: "all",
	}),

	attendance: createDefaultFilters(),

	payroll: createDefaultFilters(),

	department: createDefaultFilters({
		sort: "departmentId",
		order: "asc",
	}),
};

const filterSlice = createSlice({
	name: "filters",

	initialState,

	reducers: {
		setFilters(state, action) {
			const { module, ...filters } = action.payload;

			logger.debug(`Updating ${module} filters`, filters);

			state[module] = {
				...state[module],
				...filters,
			};
		},

		resetFilters(state, action) {
			const module = action.payload;

			logger.info(`Resetting ${module} filters`);

			state[module] = {
				...initialState[module],
			};
		},

		resetAllFilters() {
			logger.info("Resetting all filters");

			return initialState;
		},
	},
});

export const { setFilters, resetFilters, resetAllFilters } = filterSlice.actions;

export default filterSlice.reducer;
