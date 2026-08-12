/**
 * @fileoverview Contains null-safe formatting helpers for EMS detail views. It formats fallback text, dates, Indian currency, postal addresses, phone numbers, and masked confidential values without forcing each component to repeat edge-case handling.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/utils/formatter
 */
/**
 * Display.
 * @param {*} value - Value to render, format, debounce, or edit.
 * @param {string} fallback - Text returned when the source value is missing or invalid.
 * @returns {*} Computed result.
 */
export const display = (value, fallback = "—") => {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}
	return value;
};

/**
 * Date.
 * @param {*} value - Value to render, format, debounce, or edit.
 * @param {string} fallback - Text returned when the source value is missing or invalid.
 * @returns {*} Computed result.
 */
export const date = (value, fallback = "—") => {
	if (!value) return fallback;

	const d = new Date(value);

	if (Number.isNaN(d.getTime())) {
		return fallback;
	}

	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	const year = d.getFullYear();

	return `${month}-${day}-${year}`;
};

/**
 * Currency.
 * @param {*} value - Value to render, format, debounce, or edit.
 * @param {string} fallback - Text returned when the source value is missing or invalid.
 * @returns {*} Computed result.
 */
export const currency = (value, fallback = "—") => {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}
	const number = Number(value);
	return Number.isNaN(number) ? fallback : `₹${number.toLocaleString("en-IN")}`;
};

/**
 * Address.
 * @param {Object} addr - Address object containing printable address fields.
 * @param {string} fallback - Text returned when the source value is missing or invalid.
 * @returns {*} Computed result.
 */
export const address = (addr, fallback = "—") => {
	if (!addr) return fallback;
	const parts = [addr.street, addr.city, addr.state, addr.country].filter(Boolean);
	const text = parts.join(", ");

	if (addr.pincode) {
		return text ? `${text} - ${addr.pincode}` : addr.pincode;
	}
	return text || fallback;
};

/**
 * Phone.
 * @param {*} value - Value to render, format, debounce, or edit.
 * @param {string} fallback - Text returned when the source value is missing or invalid.
 * @returns {*} Computed result.
 */
export const phone = (value, fallback = "—") => {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}

	const number = String(value).trim();

	if (!number) {
		return fallback;
	}

	if (number.startsWith("+91")) {
		return number.replace(/^\+91\s*/, "+91 ");
	}

	const cleanNumber = number.replace(/\D/g, "");

	return cleanNumber ? `+91 ${cleanNumber}` : fallback;
};

export const formatIndianPhone = (value) => {
	const input = String(value ?? "").trim();
	const compact = input.replace(/\s+/g, "");

	if (/^\d{10}$/.test(compact)) return `+91 ${compact}`;
	if (/^\+91\d{10}$/.test(compact)) return `+91 ${compact.slice(3)}`;

	return input;
};

/**
 * Converts each whitespace-separated word to proper case.
 * @param {*} value - Text to normalize.
 * @returns {string} Proper-cased text, preserving whitespace between words.
 */
export const properCase = (value) =>
	String(value ?? "").replace(/\S+/g, (word) => {
		const match = word.match(/^([^\p{L}]*)(\p{L})(.*)$/u);
		if (!match) return word;
		return `${match[1]}${match[2].toUpperCase()}${match[3].toLowerCase()}`;
	});

/**
 * Mask.
 * @param {*} value - Value to render, format, debounce, or edit.
 * @param {string} fallback - Text returned when the source value is missing or invalid.
 * @returns {*} Computed result.
 */
export const mask = (value, fallback = "—") => {
	if (value === null || value === undefined || value === "") {
		return fallback;
	}

	const number = String(value).trim();

	if (!number) {
		return fallback;
	}

	if (number.length <= 4) {
		return number;
	}

	return `${"X".repeat(number.length - 4)}${number.slice(-4)}`;
};
