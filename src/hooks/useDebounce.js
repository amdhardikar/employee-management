/**
 * @fileoverview Delays propagation of a rapidly changing value until it remains unchanged for the configured interval. The hook cancels the previous timer on every change, preventing list pages from issuing a request for every search keystroke.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/hooks/useDebounce
 */
import { useEffect, useState } from "react";

/**
 * Manages debounce state and exposes values and callbacks to React consumers.
 * @param {*} value - Value to render, format, debounce, or edit.
 * @param {number} delay - Quiet period in milliseconds before publishing the value.
 * @returns {Object|*} Hook state, derived values, and/or callback functions.
 */
const useDebounce = (value, delay = 500) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
};

export default useDebounce;