/**
 * @fileoverview Provides reactive CSS media-query matching. It reads the initial match safely, subscribes to MediaQueryList changes, cleans up the listener on unmount, and returns whether the current viewport satisfies the supplied query.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/hooks/useMediaQuery
 */
import { useEffect, useState } from "react";

/**
 * Get matches.
 * @param {string} query - CSS media query to observe.
 * @returns {*} Computed result.
 */
export function getMatches(query) {
	if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;

	return window.matchMedia(query).matches;
}

/**
 * Manages media query state and exposes values and callbacks to React consumers.
 * @param {string} query - CSS media query to observe.
 * @returns {Object|*} Hook state, derived values, and/or callback functions.
 */
export default function useMediaQuery(query) {
	const [matches, setMatches] = useState(() => getMatches(query));

	useEffect(() => {
		if (typeof window.matchMedia !== "function") return undefined;
		const mediaQuery = window.matchMedia(query);

		const handleChange = (event) => {
			setMatches(event.matches);
		};

		setMatches(mediaQuery.matches);
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, [query]);

	return matches;
}
