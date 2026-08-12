import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import useEmployeeListing from "../../../src/hooks/useEmployeeListing";

describe("useEmployeeListing hook", () => {
	it("should fetch table employees in desktop mode", async () => {
		const fetchEmployees = vi.fn().mockResolvedValue({
			data: [
				{
					id: 1,
					name: "John",
				},
			],
			pages: 5,
			items: 50,
		});

		const { result } = renderHook(() =>
			useEmployeeListing({
				fetchEmployees,
				isDesktop: true,
				tablePage: 2,
				cardPage: 1,
				pageSize: 10,
			}),
		);

		await waitFor(() => {
			expect(result.current.tableEmployees).toHaveLength(1);
		});

		expect(fetchEmployees).toHaveBeenCalledWith(2, 10);

		expect(result.current.pagination).toEqual({
			totalPages: 5,
			totalItems: 50,
		});

		expect(result.current.loading).toBe(false);
	});

	it("should fetch card employees in mobile mode", async () => {
		const fetchEmployees = vi.fn().mockResolvedValue({
			data: [
				{
					id: 1,
					name: "John",
				},
				{
					id: 2,
					name: "Alex",
				},
			],
			pages: 10,
			items: 100,
		});

		const { result } = renderHook(() =>
			useEmployeeListing({
				fetchEmployees,
				isDesktop: false,
				tablePage: 1,
				cardPage: 1,
				pageSize: 10,
			}),
		);

		await waitFor(() => {
			expect(result.current.cardEmployees).toHaveLength(2);
		});

		expect(fetchEmployees).toHaveBeenCalledWith(1, 10);

		expect(result.current.tableEmployees).toEqual([]);
	});

	it("should load more cards when cardPage increases", async () => {
		const fetchEmployees = vi.fn().mockResolvedValue({
			data: [
				{
					id: 1,
					name: "John",
				},
			],
			pages: 10,
			items: 100,
		});

		renderHook(() =>
			useEmployeeListing({
				fetchEmployees,
				isDesktop: false,
				tablePage: 1,
				cardPage: 3,
				pageSize: 20,
			}),
		);

		await waitFor(() => {
			expect(fetchEmployees).toHaveBeenCalledWith(1, 60);
		});
	});

	it("should stop loading after API success", async () => {
		const fetchEmployees = vi.fn().mockResolvedValue({
			data: [],
			pages: 1,
			items: 0,
		});

		const { result } = renderHook(() =>
			useEmployeeListing({
				fetchEmployees,
				isDesktop: true,
				tablePage: 1,
				cardPage: 1,
				pageSize: 10,
			}),
		);

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
	});

	it("exposes an API error and clears loading states", async () => {
		const error = new Error("Employees unavailable");
		const fetchEmployees = vi.fn().mockRejectedValue(error);

		const { result } = renderHook(() =>
			useEmployeeListing({
				fetchEmployees,
				isDesktop: false,
				tablePage: 1,
				cardPage: 2,
				pageSize: 10,
			}),
		);

		await waitFor(() => expect(result.current.error).toBe(error));
		expect(result.current.loading).toBe(false);
		expect(result.current.loadingMore).toBe(false);
	});
});
