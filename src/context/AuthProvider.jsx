import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { employeeApi } from "../api/employeeApi";

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedUser = localStorage.getItem("ems_session");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	const login = async (email, employeeCode) => {
		try {
			const response = await employeeApi.getByEmailAndEmployeeCode(
				email,
				employeeCode,
			);
			const data = await response.json();

			if (data.length > 0) {
				const loggedInUser = data[0];
				const sessionData = {
					token: `mock-jwt-token-${loggedInUser.id}`,
					employeeId: loggedInUser.employeeId,
					employeeCode: loggedInUser.employeeCode,
					fullName: loggedInUser.personalInfo.fullName,
					role: loggedInUser.employment.designation,
					email: loggedInUser.personalInfo.email,
					profileImage: loggedInUser.personalInfo.profileImage,
				};

				localStorage.setItem(
					"ems_session",
					JSON.stringify(sessionData),
				);
				setUser(sessionData);
				return { success: true };
			} else {
				return {
					success: false,
					message: "Invalid Email or Employee Code combination.",
				};
			}
		} catch (error) {
			console.log("Error :", error);
			return { success: false, message: "Server connection error." };
		}
	};

	const logout = () => {
		localStorage.removeItem("ems_session");
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{!loading && children}
		</AuthContext.Provider>
	);
};
