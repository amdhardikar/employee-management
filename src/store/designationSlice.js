import { createSlice } from "@reduxjs/toolkit";

const initialState = { designations: [], loaded: false };

const designationSlice = createSlice({
	name: "designations",
	initialState,
	reducers: {
		setDesignations(state, action) {
			state.designations = action.payload;
			state.loaded = true;
		},
		clearDesignations(state) {
			state.designations = [];
			state.loaded = false;
		},
		invalidateDesignations(state) {
			state.loaded = false;
		},
	},
});

export const { setDesignations, clearDesignations, invalidateDesignations } = designationSlice.actions;
export default designationSlice.reducer;
