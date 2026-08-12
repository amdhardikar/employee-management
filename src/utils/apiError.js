const DEFAULT_CONNECTION_ERROR = "Unable to connect to server. Please try again later.";

export const readResponseError = async (response, fallback) => {
	try {
		const body = await response.clone().json();
		return body?.error || body?.message || fallback;
	} catch {
		return fallback;
	}
};

export const normalizeApiError = (error) => {
	if (error?.name === "AbortError") return error;
	if (error instanceof TypeError && error.message === "Failed to fetch") {
		return new Error(DEFAULT_CONNECTION_ERROR);
	}
	return error instanceof Error ? error : new Error("An unexpected error occurred. Please try again.");
};
