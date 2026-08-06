import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { invalidateDepartments } from "../../store/departmentSlice";
import { departmentApi } from "../../api/departmentApi";

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
	const [touched, setTouched] = useState({});
	const [errors, setErrors] = useState({});

	const isFormValid = form.name.trim() && form.skills.length > 0 && form.designations.length > 0;

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
			return;
		}

		try {
			setSaving(true);
			setErrors({});

			await departmentApi.createDepartment(form);
			dispatch(invalidateDepartments());
			navigate("/departments");
		} catch (error) {
			setErrors({
				server: error.message || "Unable to create department",
			});
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="border-t border-slate-200">
			<form onSubmit={submitHandler} className="space-y-8">
				<section className="rounded-sm border border-slate-200">
					<h2 className="border-b border-slate-100 px-6 py-3 text-lg font-semibold text-slate-800">
						Create Department
					</h2>

					<div className="grid gap-6 p-6">
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

				<div className="sticky bottom-0 flex justify-end gap-4 border-t border-slate-200 bg-white p-5">
					<button
						type="button"
						disabled={saving}
						onClick={() => navigate(-1)}
						className="rounded-sm border border-slate-300 px-4 py-2 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Cancel
					</button>

					<button
						type="submit"
						disabled={!isFormValid || saving}
						className="rounded-sm bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{saving ? "Creating..." : "Create"}
					</button>
				</div>
			</form>
		</div>
	);
};

const TagInput = ({ label, value, setValue, setError, items, onAdd, onRemove, placeholder, error, onBlur }) => {
	return (
		<div>
			<label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>

			<div className="flex gap-2">
				<input
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
					className={`flex-1 rounded-sm border px-4 py-2 outline-none ${
						error
							? "border-red-500 focus:ring-4 focus:ring-red-100"
							: "border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
					}`}
					placeholder={placeholder}
				/>

				<button type="button" onClick={onAdd} className="rounded-sm bg-slate-800 px-4 text-white">
					Add
				</button>
			</div>

			<div className="mt-3 flex flex-wrap gap-2">
				{items.map((item) => (
					<div key={item} className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
						{item}

						<button type="button" onClick={() => onRemove(item)} className="text-red-500">
							×
						</button>
					</div>
				))}
			</div>

			{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
};

export default DepartmentCreate;
