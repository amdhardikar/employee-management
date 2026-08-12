/**
 * @fileoverview Implements the department create workflow. It coordinates route or form state, department API operations, employee assignments, validation, navigation, and the appropriate loading, error, or not-found presentation.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/components/department/DepartmentCreate
 */
import { useId, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addDepartment } from "../../store/departmentSlice";
import { invalidateDesignations } from "../../store/designationSlice";
import { departmentApi } from "../../api/departmentApi";
import Popup from "../common/Popup";

/**
 * Renders the department create interface and coordinates its presentation behavior.
 * @returns {JSX.Element} Rendered React user interface.
 */
const DepartmentCreate = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [form, setForm] = useState({
		name: "",
		skills: [],
		designations: [],
	});

	const [skillInput, setSkillInput] = useState("");
	const [designationInput, setDesignationInput] = useState("");

	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState(null);
	const [touched, setTouched] = useState({});
	const [errors, setErrors] = useState({});

	const markTouched = (field) => {
		setTouched((prev) => ({
			...prev,
			[field]: true,
		}));
	};

	const addSkill = () => {
		markTouched("skills");
		const value = skillInput.trim();

		if (!value) return;

		if (!form.skills.includes(value)) {
			setForm({
				...form,
				skills: [...form.skills, value],
			});
		}

		setSkillInput("");
		setErrors({
			...errors,
			skills: "",
		});
	};

	const removeSkill = (skill) => {
		const updatedSkills = form.skills.filter((item) => item !== skill);

		setForm({
			...form,
			skills: updatedSkills,
		});

		if (!updatedSkills.length) {
			setErrors({
				...errors,
				skills: "At least one skill is required",
			});
		}
	};

	const addDesignation = () => {
		markTouched("designations");
		const value = designationInput.trim();

		if (!value) return;

		if (!form.designations.includes(value)) {
			setForm({
				...form,
				designations: [...form.designations, value],
			});
		}

		setDesignationInput("");
		setErrors({
			...errors,
			designations: "",
		});
	};

	const removeDesignation = (designation) => {
		const updatedDesignations = form.designations.filter((item) => item !== designation);

		setForm({
			...form,
			designations: updatedDesignations,
		});

		if (!updatedDesignations.length) {
			setErrors({
				...errors,
				designations: "At least one designation is required",
			});
		}
	};

	const validate = () => {
		const validationErrors = {};

		if (!form.name.trim()) {
			validationErrors.name = "Department name is required";
		}

		if (!form.skills.length) {
			validationErrors.skills = "At least one skill is required";
		}

		if (!form.designations.length) {
			validationErrors.designations = "At least one designation is required";
		}

		return validationErrors;
	};

	const submitHandler = async (e) => {
		e.preventDefault();

		const validationErrors = validate();

		if (Object.keys(validationErrors).length) {
			setErrors(validationErrors);
			setSaveError("Please correct the highlighted form errors before creating the department.");
			return;
		}

		try {
			setSaveError(null);
			setSaving(true);
			setErrors({});

			const response = await departmentApi.createDepartment(form);

			dispatch(addDepartment(response.department));
			dispatch(invalidateDesignations());

			navigate("/departments");
		} catch (error) {
			setSaveError(error);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="min-w-0 border-t border-slate-200">
			<Popup
				saving={saving}
				error={saveError}
				savingMessage="Creating department..."
				errorTitle="Unable to create department"
				onClose={() => setSaveError(null)}
			/>
			<form onSubmit={submitHandler} className="space-y-5 sm:space-y-8">
				<section className="rounded-sm border border-slate-200">
					<h2 className="border-b border-slate-100 px-4 py-3 text-base font-semibold text-slate-800 sm:px-6 sm:text-lg">
						Create Department
					</h2>

					<div className="grid gap-5 p-4 sm:gap-6 sm:p-6">
						<div>
							<label className="mb-2 block text-sm font-medium text-slate-700">Department Name</label>

							<input
								value={form.name}
								onChange={(e) => {
									const value = e.target.value;

									setForm({
										...form,
										name: value,
									});

									if (touched.name && !value.trim()) {
										setErrors({
											...errors,
											name: "Department name is required",
										});
									} else {
										setErrors({
											...errors,
											name: "",
										});
									}
								}}
								onBlur={() => {
									markTouched("name");

									if (!form.name.trim()) {
										setErrors({
											...errors,
											name: "Department name is required",
										});
									}
								}}
								className={`w-full rounded-sm border px-4 py-2.5 outline-none ${
									errors.name
										? "border-red-500 focus:ring-4 focus:ring-red-100"
										: "border-slate-300 focus:border-blue-500"
								}`}
								placeholder="Enter department name"
							/>

							{errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
						</div>

						<TagInput
							label="Skills"
							value={skillInput}
							setValue={setSkillInput}
							setError={setErrors}
							items={form.skills}
							onAdd={addSkill}
							onRemove={removeSkill}
							placeholder="Enter skill like python, react, java"
							error={errors.skills}
							touched={touched.skills}
							onBlur={() => {
								markTouched("skills");

								if (!skillInput.trim() && form.skills.length === 0) {
									setErrors({
										...errors,
										skills: "At least one skill is required",
									});
								}
							}}
						/>

						<TagInput
							label="Designations"
							value={designationInput}
							setValue={setDesignationInput}
							setError={setErrors}
							items={form.designations}
							onAdd={addDesignation}
							onRemove={removeDesignation}
							placeholder="Enter designation like HR, lead, Python developer"
							error={errors.designations}
							touched={touched.designations}
							onBlur={() => {
								markTouched("designations");

								if (!designationInput.trim() && form.designations.length === 0) {
									setErrors({
										...errors,
										designations: "At least one designation is required",
									});
								}
							}}
						/>
					</div>
				</section>

				<div className="sticky bottom-0 z-10 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white p-4 shadow-[0_-4px_12px_rgba(15,23,42,0.06)] sm:flex-row sm:justify-end sm:gap-4 sm:p-5">
					<button
						type="button"
						disabled={saving}
						onClick={() => navigate(-1)}
						className="w-full rounded-sm border border-slate-300 px-4 py-2.5 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
					>
						Cancel
					</button>

					<button
						type="submit"
						disabled={saving}
						className="w-full rounded-sm bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:py-2"
					>
						{saving ? "Creating..." : "Create"}
					</button>
				</div>
			</form>
		</div>
	);
};

/**
 * Renders the tag input interface and coordinates its presentation behavior.
 * @param {Object} props - Component or hook input properties.
 * @param {string} props.label - Human-readable field or metric label.
 * @param {*} props.value - Value to render, format, debounce, or edit.
 * @param {Function} props.setValue - The set value value required by this operation.
 * @param {Function} props.setError - The set error value required by this operation.
 * @param {*} props.items - The items value required by this operation.
 * @param {Function} props.onAdd - The on add value required by this operation.
 * @param {Function} props.onRemove - The on remove value required by this operation.
 * @param {*} props.placeholder - The placeholder value required by this operation.
 * @param {*} props.error - The error value required by this operation.
 * @param {Function} props.onBlur - The on blur value required by this operation.
 * @returns {JSX.Element} Rendered React user interface.
 */
const TagInput = ({ label, value, setValue, setError, items, onAdd, onRemove, placeholder, error, onBlur }) => {
	const fieldId = useId();
	const errorId = `${fieldId}-error`;
	return (
		<div>
			<label htmlFor={fieldId} className="mb-2 block text-sm font-medium text-slate-700">{label}</label>

			<div className="flex flex-col gap-2 sm:flex-row">
				<input
					id={fieldId}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? errorId : undefined}
					value={value}
					onChange={(e) => {
						const value = e.target.value;
						setValue(value);

						if (!value.trim() && items.length === 0) {
							onBlur();
						} else if (error) {
							setError({});
						}
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							onAdd();
						}
					}}
					onBlur={onBlur}
					className={`min-w-0 flex-1 rounded-sm border px-4 py-2.5 outline-none ${
						error
							? "border-red-500 focus:ring-4 focus:ring-red-100"
							: "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
					}`}
					placeholder={placeholder}
				/>

				<button
					type="button"
					onClick={onAdd}
					className="min-h-11 w-full rounded-sm bg-slate-800 px-4 text-white transition-colors hover:bg-slate-700 sm:w-auto"
				>
					Add
				</button>
			</div>

			<div className="mt-3 flex flex-wrap gap-2">
				{items.map((item) => (
					<div key={item} className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
						{item}

						<button type="button" onClick={() => onRemove(item)} className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700">
							×
						</button>
					</div>
				))}
			</div>

			{error && <p id={errorId} className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
};

TagInput.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	setValue: PropTypes.func.isRequired,
	setError: PropTypes.func.isRequired,
	items: PropTypes.arrayOf(PropTypes.string).isRequired,
	onAdd: PropTypes.func.isRequired,
	onRemove: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	error: PropTypes.string,
	onBlur: PropTypes.func.isRequired,
};

export default DepartmentCreate;
