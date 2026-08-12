import { describe, it, expect } from "vitest";

import reducer, {
	setFilters,
	resetFilters,
	resetAllFilters,
} from "../../../src/store/filterSlice";

describe("filterSlice", () => {
	it("returns initial state", () => {
		const state = reducer(undefined, {});

		expect(state).toEqual({
			employee: {
				tablePage: 1,
				cardPage: 1,
				pageSize: 10,
				search: "",
				sort: "employeeId",
				order: "desc",
				department: "all",
				status: "all",
			},

			attendance: {
				tablePage: 1,
				cardPage: 1,
				pageSize: 10,
				search: "",
				sort: "employeeId",
				order: "desc",
				department: "all",
			},

			payroll: {
				tablePage: 1,
				cardPage: 1,
				pageSize: 10,
				search: "",
				sort: "employeeId",
				order: "desc",
				department: "all",
			},

			department: {
				tablePage: 1,
				cardPage: 1,
				pageSize: 10,
				search: "",
				sort: "departmentId",
				order: "asc",
				department: "all",
			},
		});
	});

	it("updates employee filters using setFilters", () => {
		const previousState = reducer(undefined, {});

		const nextState = reducer(
			previousState,
			setFilters({
				module: "employee",
				search: "John",
				department: "IT",
			}),
		);

		expect(nextState.employee).toEqual({
			...previousState.employee,
			search: "John",
			department: "IT",
		});
	});

	it("updates only provided filter values", () => {
		const previousState = reducer(undefined, {});

		const nextState = reducer(
			previousState,
			setFilters({
				module: "attendance",
				pageSize: 25,
			}),
		);

		expect(nextState.attendance.pageSize).toBe(25);

		expect(nextState.attendance.search).toBe(
			previousState.attendance.search,
		);

		expect(nextState.attendance.sort).toBe(previousState.attendance.sort);
	});

	it("resets a specific module filters", () => {
		const previousState = reducer(
			undefined,
			setFilters({
				module: "employee",
				search: "John",
				pageSize: 50,
			}),
		);

		const nextState = reducer(previousState, resetFilters("employee"));

		expect(nextState.employee).toEqual({
			tablePage: 1,
			cardPage: 1,
			pageSize: 10,
			search: "",
			sort: "employeeId",
			order: "desc",
			department: "all",
			status: "all",
		});
	});

	it("does not reset other modules when resetting one module", () => {
		const previousState = reducer(
			undefined,
			setFilters({
				module: "employee",
				search: "John",
			}),
		);

		const nextState = reducer(previousState, resetFilters("employee"));

		expect(nextState.attendance).toEqual(previousState.attendance);

		expect(nextState.payroll).toEqual(previousState.payroll);
	});

	it("resets all filters", () => {
		const modifiedState = reducer(
			undefined,
			setFilters({
				module: "payroll",
				search: "Salary",
				pageSize: 50,
			}),
		);

		const nextState = reducer(modifiedState, resetAllFilters());

		expect(nextState).toEqual(reducer(undefined, {}));
	});
});
