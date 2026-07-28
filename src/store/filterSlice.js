import { createSlice } from "@reduxjs/toolkit";

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

	payroll: createDefaultFilters({
		order: "asc",
	}),

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

			state[module] = {
				...state[module],
				...filters,
			};
		},

		resetFilters(state, action) {
			const module = action.payload;

			state[module] = {
				...initialState[module],
			};
		},

		resetAllFilters() {
			return initialState;
		},
	},
});

export const { setFilters, resetFilters, resetAllFilters } =
	filterSlice.actions;

export default filterSlice.reducer;
