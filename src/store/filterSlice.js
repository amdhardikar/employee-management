import { createSlice } from "@reduxjs/toolkit";
import logger from "../logging/logger";

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
		sort: "departmentName",
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
