/**
 * @fileoverview Caches department records shared across screens. Reducers replace, append, clear, or invalidate the collection and maintain the loaded flag used to avoid unnecessary requests.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/store/departmentSlice
 */
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
