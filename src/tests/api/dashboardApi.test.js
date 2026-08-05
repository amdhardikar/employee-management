import { afterEach, describe, expect, it, vi } from "vitest";

import { dashboardApi } from "../../api/dashboardApi";

describe("dashboardApi", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should fetch dashboard data", async () => {
		const mockResponse = {
			totalEmployees: 250,
			activeEmployees: 220,
		};

		const fetchSpy = vi.spyOn(globalThis, "fetch");

		fetchSpy.mockResolvedValue(
			new Response(JSON.stringify(mockResponse), {
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			}),
		);

		const result = await dashboardApi.getDashboard();

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(fetchSpy).toHaveBeenCalledWith(
			"http://localhost:5000/dashboard",
		);

		expect(result).toEqual(mockResponse);
	});

	it("should throw an error when the request fails", async () => {
		const fetchSpy = vi.spyOn(globalThis, "fetch");

		fetchSpy.mockResolvedValue(
			new Response(null, {
				status: 500,
				statusText: "Internal Server Error",
			}),
		);

		await expect(dashboardApi.getDashboard()).rejects.toThrow(
			"Failed to load dashboard",
		);

		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});