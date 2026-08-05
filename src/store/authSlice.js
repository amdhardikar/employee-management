import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeApi } from "../api/employeeApi";
import logger from "../logging/logger";

const storedUser = localStorage.getItem("ems_session");

const initialState = {
	user: storedUser ? JSON.parse(storedUser) : null,
	loading: false,
	error: null,
};

export const login = createAsyncThunk("auth/login", async ({ email, employeeCode }, { rejectWithValue }) => {
	try {
		logger.debug(`Authenticating employee. Employee Code: ${employeeCode}`);

		const response = await employeeApi.getByEmailAndEmployeeCode(email, employeeCode);

		const data = await response.json();

		if (!data.length) {
			logger.warn(`Authentication failed. Invalid credentials for Employee Code: ${employeeCode}`);

			return rejectWithValue("Invalid Email or Employee Code combination.");
		}

		const loggedInUser = data[0];

		const sessionData = {
			token: `mock-jwt-token-${loggedInUser.id}`,
			employeeId: loggedInUser.employeeId,
			employeeCode: loggedInUser.employeeCode,
			fullName: loggedInUser.fullName,
			role: loggedInUser.employment.designation,
			email: loggedInUser.email,
			profileImage: loggedInUser.personalInfo.profileImage,
		};

		localStorage.setItem("ems_session", JSON.stringify(sessionData));

		logger.info(`Authentication successful. Employee: ${loggedInUser.employeeId}`);

		return sessionData;
	} catch (error) {
		logger.error(`Authentication failed due to server error. Employee Code: ${employeeCode}`, error);

		return rejectWithValue("Server connection error.");
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			if (state.user) {
				logger.info(`User logged out. Employee: ${state.user.employeeId}`);
			}

			localStorage.removeItem("ems_session");
			state.user = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				logger.debug("Login request initiated");

				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				logger.info("Login state updated");

				state.loading = false;
				state.user = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				logger.warn(`Login rejected: ${action.payload}`);

				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
