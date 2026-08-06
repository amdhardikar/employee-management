import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	departments: [],
	loaded: false,
};

const departmentSlice = createSlice({
	name: "departments",

	initialState,

	reducers: {
		setDepartments(state, action) {
			state.departments = action.payload;
			state.loaded = true;
		},

		clearDepartments(state) {
			state.departments = [];
			state.loaded = false;
		},

		invalidateDepartments(state) {
			state.loaded = false;
		},
		addDepartment(state, action) {
			state.departments.push(action.payload);
		},
	},
});

export const { setDepartments, clearDepartments, invalidateDepartments, addDepartment } = departmentSlice.actions;

export default departmentSlice.reducer;
