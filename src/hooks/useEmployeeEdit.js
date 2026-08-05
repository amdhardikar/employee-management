import { useEffect, useState } from "react";

import { employeeApi } from "../api/employeeApi";
import { departmentApi } from "../api/departmentApi";
import { designationApi } from "../api/designationApi";

import { validateEmployee } from "../utils/employeeValidation";

const useEmployeeEdit = (id) => {
	const [employee, setEmployee] = useState(null);
	const [departments, setDepartments] = useState([]);
	const [designations, setDesignations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);

				const [employeeData, departmentData] = await Promise.all([
					employeeApi.getById(id),
					departmentApi.getAll(),
				]);

				setEmployee(employeeData);
				setDepartments(departmentData);
			} catch (error) {
				console.error("Employee edit loading failed:", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [id]);

	useEffect(() => {
		if (employee) {
			const validationErrors = validateEmployee(employee) || {};
			setErrors(validationErrors);
		}
	}, [employee]);

	useEffect(() => {
		if (!employee?.employment?.departmentId) {
			setDesignations([]);
			return;
		}

		const loadDesignations = async () => {
			try {
				const data = await designationApi.getByDepartment(employee.employment.departmentId);
				setDesignations(data);
			} catch (error) {
				console.error("Failed to fetch designations:", error);
			}
		};

		loadDesignations();
	}, [employee?.employment?.departmentId]);

	const updateRootField = (field, value) => {
		setEmployee((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const updateNestedField = (section, field, value) => {
		setEmployee((prev) => ({
			...prev,
			[section]: {
				...(prev?.[section] || {}),
				[field]: value,
			},
		}));
	};

	const updateDeepField = (section, subSection, field, value) => {
		setEmployee((prev) => ({
			...prev,
			[section]: {
				...(prev?.[section] || {}),
				[subSection]: {
					...(prev?.[section]?.[subSection] || {}),
					[field]: value,
				},
			},
		}));
	};

	const handleDesignationChange = (e) => {
		const designationId = e.target.value;

		setEmployee((prev) => ({
			...prev,
			employment: {
				...prev.employment,
				designationId,
			},
		}));
	};

	const handleDepartmentChange = (e) => {
		const departmentId = e.target.value;

		setEmployee((prev) => ({
			...prev,
			employment: {
				...prev.employment,
				departmentId,
				designationId: "",
			},
		}));
	};

	const validate = () => {
		const validationErrors = validateEmployee(employee) || {};
		setErrors(validationErrors);
		return validationErrors;
	};

	const touchField = (field) => {
		setTouched((prev) => ({
			...prev,
			[field]: true,
		}));
	};

	const isFormValid = Boolean(employee) && Object.keys(errors).length === 0;

	return {
		employee,
		setEmployee,
		departments,
		designations,
		loading,
		touched,
		touchField,
		errors,
		isFormValid,
		updateRootField,
		updateNestedField,
		updateDeepField,
		handleDepartmentChange,
		handleDesignationChange,
		validate,
	};
};

export default useEmployeeEdit;
