const DEFAULT_RETRY_DELAYS = [400, 800];

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

/**
 * Retries transient network failures, such as the short outage while nodemon restarts.
 * HTTP error responses are returned immediately and remain the caller's responsibility.
 * @param {RequestInfo|URL} input - Fetch target.
 * @param {RequestInit} [init] - Fetch options.
 * @param {number[]} [retryDelays] - Delay before each retry.
 * @returns {Promise<Response>} Fetch response.
 */
export const fetchWithRetry = async function (input, init, retryDelays = DEFAULT_RETRY_DELAYS) {
	const hasInitArgument = arguments.length >= 2;
	let attempt = 0;
	while (true) {
		try {
			return await (hasInitArgument ? fetch(input, init) : fetch(input));
		} catch (error) {
			if (!(error instanceof TypeError) || attempt === retryDelays.length) throw error;
			await wait(retryDelays[attempt]);
			attempt += 1;
		}
	}
};
