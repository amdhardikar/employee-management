import { createSlice } from "@reduxjs/toolkit";

const getStoredTheme = () => localStorage.getItem("theme") || "light";

const initialState = {
	sidebarOpen: false,
	loading: false,
	theme: getStoredTheme(),
};

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		openSidebar(state) {
			state.sidebarOpen = true;
		},

		closeSidebar(state) {
			state.sidebarOpen = false;
		},

		setTheme(state, action) {
			state.theme = action.payload;
			localStorage.setItem("theme", action.payload);
		},

		resetUI() {
			return initialState;
		},
	},
});

export const { openSidebar, closeSidebar, setTheme, resetUI } = uiSlice.actions;

export default uiSlice.reducer;
