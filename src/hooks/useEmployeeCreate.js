import { useEffect, useMemo, useState } from "react";

import { departmentApi } from "../api/departmentApi";
import { designationApi } from "../api/designationApi";

import { validateEmployee } from "../utils/employeeValidation";
import { EMPLOYEE_DEFAULT_VALUES } from "../constants/EMSconstants";

const useEmployeeCreate = () => {
	const [employee, setEmployee] = useState(EMPLOYEE_DEFAULT_VALUES);
	const [departments, setDepartments] = useState([]);
	const [designations, setDesignations] = useState([]);
	const [loading, setLoading] = useState(true);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);

				const departmentData = await departmentApi.getAll();

				setDepartments(departmentData);
			} catch (error) {
				console.error("Employee edit loading failed:", error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, []);

	useEffect(() => {
		if (!employee?.employment?.departmentId) {
			setDesignations([]);
			return;
		}

		const loadDesignations = async () => {
			const data = await designationApi.getByDepartment(employee.employment.departmentId);

			setDesignations(data);
		};

		loadDesignations();
	}, [employee?.employment?.departmentId]);

	const runValidation = (updatedEmployee) => {
		const validationErrors = validateEmployee(updatedEmployee);

		setErrors(validationErrors);

		return validationErrors;
	};

	const updateRootField = (field, value) => {
		setEmployee((prev) => {
			const updated = {
				...prev,
				[field]: value,
			};

			runValidation(updated);

			return updated;
		});
	};

	const updateNestedField = (section, field, value) => {
		setEmployee((prev) => {
			const updated = {
				...prev,
				[section]: {
					...(prev?.[section] || {}),
					[field]: value,
				},
			};

			runValidation(updated);

			return updated;
		});
	};

	const updateDeepField = (section, subSection, field, value) => {
		setEmployee((prev) => {
			const updated = {
				...prev,
				[section]: {
					...(prev?.[section] || {}),
					[subSection]: {
						...(prev?.[section]?.[subSection] || {}),
						[field]: value,
					},
				},
			};

			runValidation(updated);

			return updated;
		});
	};

	const handleDesignationChange = (e) => {
		const designationId = e.target.value;

		setEmployee((prev) => {
			const updated = {
				...prev,
				employment: {
					...prev.employment,
					designationId,
				},
			};

			runValidation(updated);

			return updated;
		});
	};

	const handleDepartmentChange = (e) => {
		const departmentId = e.target.value;

		setEmployee((prev) => {
			const updated = {
				...prev,
				employment: {
					...prev.employment,
					departmentId,
					designationId: "",
				},
			};

			runValidation(updated);

			return updated;
		});
	};

	const validate = () => runValidation(employee);

   const touchField = (field) => {
		setTouched((prev) => ({
			...prev,
			[field]: true,
		}));
   };

   const isFormValid = useMemo(() => {
		return Object.keys(validateEmployee(employee)).length === 0;
   }, [employee]);

	return {
		employee,
		setEmployee,
		errors,
		touched,
		touchField,
		isFormValid,
		departments,
		designations,
		loading,
		updateRootField,
		updateNestedField,
		updateDeepField,
		handleDepartmentChange,
		handleDesignationChange,
		validate,
	};
};

export default useEmployeeCreate;
