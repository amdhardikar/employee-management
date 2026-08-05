import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardApi } from "../api/dashboardApi";
import logger from "../logging/logger";

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

export const fetchDashboard = createAsyncThunk("dashboard/fetchDashboard", async (_, { rejectWithValue }) => {
	try {
		logger.debug("Fetching dashboard data");

		const data = await dashboardApi.getDashboard();

		logger.info("Dashboard data fetched successfully");

		return data;
	} catch (error) {
		logger.error("Failed to fetch dashboard data", error);

		return rejectWithValue(error.message || "Failed to load dashboard");
	}
});

const dashboardSlice = createSlice({
	name: "dashboard",

	initialState,

	reducers: {
		clearDashboard(state) {
			logger.info("Dashboard state cleared");

			state.data = initialState.data;
			state.error = null;
			state.lastFetched = null;
		},

		refreshDashboard(state) {
			logger.debug("Dashboard refresh requested");

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
