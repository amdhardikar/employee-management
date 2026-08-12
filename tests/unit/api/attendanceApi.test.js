import { afterEach, describe, expect, it, vi } from "vitest";

import { attendanceApi } from "../../../src/api/attendanceApi";

describe("attendanceApi", () => {
	afterEach(() => {
		vi.restoreAllMocks();
		vi.clearAllMocks();
	});

	describe("getByEmployeeId", () => {
		it("should fetch attendance by employee id", async () => {
			const attendance = [{ id: 1 }];

			const fetchSpy = vi.spyOn(globalThis, "fetch");

			fetchSpy.mockResolvedValue(
				new Response(JSON.stringify(attendance), {
					status: 200,
				}),
			);

			const result = await attendanceApi.getByEmployeeId("EMP001");

			expect(fetchSpy).toHaveBeenCalledWith(
				"http://localhost:5000/monthlyAttendance?employeeId=EMP001&_sort=createdAt&_order=desc",
			);

			expect(result).toEqual(attendance);
		});

		it("should throw when getByEmployeeId request fails", async () => {
			const fetchSpy = vi.spyOn(globalThis, "fetch");

			fetchSpy.mockResolvedValue(
				new Response(null, {
					status: 500,
				}),
			);

			await expect(attendanceApi.getByEmployeeId("EMP001")).rejects.toThrow("Failed to load employee attendance");
		});
	});
});
