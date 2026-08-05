import { afterEach, describe, expect, it, vi } from "vitest";

import { payrollApi } from "../../api/payrollApi";

describe("payrollApi", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("getByEmployeeId", () => {
		it("should fetch payroll by employee id", async () => {
			const payroll = [
				{
					id: 1,
					employeeId: "EMP001",
					month: "July",
					netSalary: 50000,
				},
			];

			const fetchSpy = vi.spyOn(globalThis, "fetch");

			fetchSpy.mockResolvedValue(
				new Response(JSON.stringify(payroll), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				}),
			);

			const result = await payrollApi.getByEmployeeId("EMP001");

			expect(fetchSpy).toHaveBeenCalledTimes(1);
			expect(fetchSpy).toHaveBeenCalledWith(
				"http://localhost:5000/payrolls?employeeId=EMP001",
			);

			expect(result).toEqual(payroll);
		});

		it("should throw an error when request fails", async () => {
			const fetchSpy = vi.spyOn(globalThis, "fetch");

			fetchSpy.mockResolvedValue(
				new Response(null, {
					status: 500,
				}),
			);

			await expect(payrollApi.getByEmployeeId("EMP001")).rejects.toThrow(
				"Failed to load employee payroll",
			);

			expect(fetchSpy).toHaveBeenCalledTimes(1);
		});

		it("should return an empty array when no payroll records exist", async () => {
			const fetchSpy = vi.spyOn(globalThis, "fetch");

			fetchSpy.mockResolvedValue(
				new Response(JSON.stringify([]), {
					status: 200,
				}),
			);

			const result = await payrollApi.getByEmployeeId("EMP001");

			expect(result).toEqual([]);
		});
	});
});
