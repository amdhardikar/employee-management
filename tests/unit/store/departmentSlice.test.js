import { describe, expect, it } from "vitest";
import reducer, { addDepartment, clearDepartments, invalidateDepartments, setDepartments } from "../../../src/store/departmentSlice"; // Update path as needed

describe("departmentSlice", () => {
	const initialState = {
		departments: [],
		loaded: false,
	};

	describe("reducer", () => {
		it("should return the initial state", () => {
			expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
		});

		it("should handle setDepartments", () => {
			const departments = [
				{ id: 1, name: "HR" },
				{ id: 2, name: "Engineering" },
			];

			expect(reducer(initialState, setDepartments(departments))).toEqual({
				departments,
				loaded: true,
			});
		});

		it("should handle clearDepartments", () => {
			const previousState = {
				departments: [{ id: 1, name: "HR" }],
				loaded: true,
			};

			expect(reducer(previousState, clearDepartments())).toEqual({
				departments: [],
				loaded: false,
			});
		});

		it("should handle invalidateDepartments", () => {
			const previousState = {
				departments: [{ id: 1, name: "HR" }],
				loaded: true,
			};

			expect(reducer(previousState, invalidateDepartments())).toEqual({
				departments: [{ id: 1, name: "HR" }],
				loaded: false,
			});
		});

		it("should handle addDepartment", () => {
			const previousState = {
				departments: [{ id: 1, name: "HR" }],
				loaded: true,
			};

			const newDepartment = {
				id: 2,
				name: "Engineering",
			};

			expect(reducer(previousState, addDepartment(newDepartment))).toEqual({
				departments: [
					{ id: 1, name: "HR" },
					{ id: 2, name: "Engineering" },
				],
				loaded: true,
			});
		});

		it("should add department when list is empty", () => {
			const newDepartment = {
				id: 1,
				name: "Finance",
			};

			expect(reducer(initialState, addDepartment(newDepartment))).toEqual({
				departments: [newDepartment],
				loaded: false,
			});
		});
	});

	describe("actions", () => {
		it("should create setDepartments action", () => {
			const payload = [{ id: 1, name: "HR" }];

			expect(setDepartments(payload)).toEqual({
				type: "departments/setDepartments",
				payload,
			});
		});

		it("should create clearDepartments action", () => {
			expect(clearDepartments()).toEqual({
				type: "departments/clearDepartments",
				payload: undefined,
			});
		});

		it("should create invalidateDepartments action", () => {
			expect(invalidateDepartments()).toEqual({
				type: "departments/invalidateDepartments",
				payload: undefined,
			});
		});

		it("should create addDepartment action", () => {
			const payload = { id: 1, name: "Finance" };

			expect(addDepartment(payload)).toEqual({
				type: "departments/addDepartment",
				payload,
			});
		});
	});
});
