import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { employeeApi } from "../api/employeeApi";

const storedUser = localStorage.getItem("ems_session");

const initialState = {
	user: storedUser ? JSON.parse(storedUser) : null,
	loading: false,
	error: null,
};

export const login = createAsyncThunk(
	"auth/login",
	async ({ email, employeeCode }, { rejectWithValue }) => {
		try {
			const response = await employeeApi.getByEmailAndEmployeeCode(
				email,
				employeeCode,
			);

			const data = await response.json();

			if (!data.length) {
				return rejectWithValue(
					"Invalid Email or Employee Code combination.",
				);
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

			return sessionData;
		} catch (error) {
			return rejectWithValue("Server connection error.", error);
		}
	},
);

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		logout(state) {
			localStorage.removeItem("ems_session");
			state.user = null;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.loading = false;
				state.user = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
