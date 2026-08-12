/**
 * @fileoverview Owns the employee-create form model. It initializes the complete employee shape, loads department/designation choices, updates nested fields immutably, synchronizes dependent selections, tracks touched fields, and exposes validation state and callbacks to EmployeeCreate.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/hooks/useEmployeeCreate
 */
import { useMemo, useState } from "react";

import { validateEmployee } from "../utils/employeeValidation";
import { EMPLOYEE_DEFAULT_VALUES } from "../constants/EMSconstants";
import useDepartments from "./useDepartments";
import useDesignations from "./useDesignations";

/**
 * Manages employee create state and exposes values and callbacks to React consumers.
 * @returns {Object|*} Hook state, derived values, and/or callback functions.
 */
const useEmployeeCreate = () => {
	const [employee, setEmployee] = useState(EMPLOYEE_DEFAULT_VALUES);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments(false);
	const {
		designations,
		loading: designationsLoading,
		error: designationsError,
	} = useDesignations(employee?.employment?.departmentId);

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
		loading: departmentsLoading || designationsLoading,
		error: departmentsError || designationsError,
		updateRootField,
		updateNestedField,
		updateDeepField,
		handleDepartmentChange,
		handleDesignationChange,
		validate,
	};
};

export default useEmployeeCreate;
