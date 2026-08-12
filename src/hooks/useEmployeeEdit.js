/**
 * @fileoverview Owns the employee-edit form model for the route employee ID. It loads the employee and lookup data, provides immutable root/nested/deep update helpers, synchronizes department/designation selections, tracks touched validation fields, and exposes loading/error/form-validity state.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/hooks/useEmployeeEdit
 */
import { useEffect, useState } from "react";

import { employeeApi } from "../api/employeeApi";
import { validateEmployee } from "../utils/employeeValidation";
import { formatIndianPhone } from "../utils/formatter";
import useDepartments from "./useDepartments";
import useDesignations from "./useDesignations";

/**
 * Manages employee edit state and exposes values and callbacks to React consumers.
 * @param {string|number} id - Record identifier used by the lookup or mutation.
 * @returns {Object|*} Hook state, derived values, and/or callback functions.
 */
const useEmployeeEdit = (id) => {
	const [employee, setEmployee] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(null);
	const [errors, setErrors] = useState({});
	const [touched, setTouched] = useState({});
	const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments(false);
	const {
		designations,
		loading: designationsLoading,
		error: designationsError,
	} = useDesignations(employee?.employment?.departmentId);

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				setLoadError(null);

				const employeeData = await employeeApi.getById(id);
				setEmployee(
					employeeData
						? {
							...employeeData,
							personalInfo: {
								...employeeData.personalInfo,
								phone: formatIndianPhone(employeeData.personalInfo?.phone),
								alternatePhone: formatIndianPhone(employeeData.personalInfo?.alternatePhone),
							},
							emergencyContact: {
								...employeeData.emergencyContact,
								phone: formatIndianPhone(employeeData.emergencyContact?.phone),
							},
						}
						: null,
				);
			} catch (error) {
				setLoadError(error);
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

	// Derive validity from the current model so the Save button changes in the
	// same render as a field edit, without waiting for the error-state effect.
	const isFormValid = Boolean(employee) && Object.keys(validateEmployee(employee) || {}).length === 0;

	return {
		employee,
		setEmployee,
		departments,
		designations,
		loading: loading || departmentsLoading || designationsLoading,
		error: loadError || departmentsError || designationsError,
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
