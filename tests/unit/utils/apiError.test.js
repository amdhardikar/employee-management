import { describe, expect, it } from "vitest";

import { normalizeApiError, readResponseError } from "../../../src/utils/apiError";

describe("api error helpers", () => {
	it("uses an API error or message and falls back for unreadable bodies", async () => {
		const response = (body) => ({ clone: () => ({ json: async () => body }) });
		expect(await readResponseError(response({ error: "Rejected" }), "Fallback")).toBe("Rejected");
		expect(await readResponseError(response({ message: "Unavailable" }), "Fallback")).toBe("Unavailable");
		expect(await readResponseError(response({}), "Fallback")).toBe("Fallback");
		expect(await readResponseError({}, "Fallback")).toBe("Fallback");
	});

	it("normalizes network and unexpected failures while preserving real errors", () => {
		expect(normalizeApiError(new TypeError("Failed to fetch")).message).toContain("Unable to connect");
		const error = new Error("Known failure");
		expect(normalizeApiError(error)).toBe(error);
		expect(normalizeApiError(null).message).toContain("unexpected error");
		const aborted = new DOMException("Aborted", "AbortError");
		expect(normalizeApiError(aborted)).toBe(aborted);
	});
});
