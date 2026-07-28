import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "../api/dashboardApi";

const initialState = {
	data: {
		stats: {},
		recentEmployees: [],
		departmentStats: [],
		employeeStatus: {},
		maxDeptCount: 0,
	},

	loading: false,

	error: null,

	lastFetched: null,
};

export const fetchDashboard = createAsyncThunk(
	"dashboard/fetchDashboard",
	async (_, { rejectWithValue }) => {
		try {
			return await dashboardApi.getDashboard();
		} catch (error) {
			return rejectWithValue(error.message || "Failed to load dashboard");
		}
	},
);

const dashboardSlice = createSlice({
	name: "dashboard",

	initialState,

	reducers: {
		clearDashboard(state) {
			state.data = initialState.data;
			state.error = null;
			state.lastFetched = null;
		},

		refreshDashboard(state) {
			state.lastFetched = null;
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(fetchDashboard.pending, (state) => {
				state.loading = true;
				state.error = null;
			})

			.addCase(fetchDashboard.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
				state.lastFetched = Date.now();
			})

			.addCase(fetchDashboard.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { clearDashboard, refreshDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer;
