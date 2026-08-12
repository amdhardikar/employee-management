import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchWithRetry } from "../../../src/utils/fetchWithRetry";

describe("fetchWithRetry", () => {
	beforeEach(() => vi.restoreAllMocks());

	it("returns the first successful response", async () => {
		const response = { ok: true };
		globalThis.fetch = vi.fn().mockResolvedValue(response);
		await expect(fetchWithRetry("/employees", undefined, [])).resolves.toBe(response);
	});

	it("retries transient TypeErrors", async () => {
		const response = { ok: true };
		globalThis.fetch = vi
			.fn()
			.mockRejectedValueOnce(new TypeError("Failed to fetch"))
			.mockResolvedValueOnce(response);
		await expect(fetchWithRetry("/employees", undefined, [0])).resolves.toBe(response);
		expect(fetch).toHaveBeenCalledTimes(2);
	});

	it("does not retry non-network errors", async () => {
		globalThis.fetch = vi.fn().mockRejectedValue(new Error("Invalid request"));
		await expect(fetchWithRetry("/employees", undefined, [0])).rejects.toThrow("Invalid request");
		expect(fetch).toHaveBeenCalledOnce();
	});

	it("throws after all network retries fail", async () => {
		globalThis.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
		await expect(fetchWithRetry("/employees", undefined, [0])).rejects.toThrow("Failed to fetch");
		expect(fetch).toHaveBeenCalledTimes(2);
	});
});
