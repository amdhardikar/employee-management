/**
 * @fileoverview Provides the application's logging facade. Development enables debug-and-higher messages, production limits output to errors, and every method delegates to the matching console severity without changing caller data.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/logging/logger
 */
const LOG_LEVELS = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	NONE: 4,
};

export const createLogger = (currentLogLevel) => ({
	debug: (message, ...args) => {
		if (LOG_LEVELS.DEBUG >= currentLogLevel) {
			console.debug(`[DEBUG] ${message}`, ...args);
		}
	},

	info: (message, ...args) => {
		if (LOG_LEVELS.INFO >= currentLogLevel) {
			console.info(`[INFO] ${message}`, ...args);
		}
	},

	warn: (message, ...args) => {
		if (LOG_LEVELS.WARN >= currentLogLevel) {
			console.warn(`[WARN] ${message}`, ...args);
		}
	},

	error: (message, ...args) => {
		if (LOG_LEVELS.ERROR >= currentLogLevel) {
			console.error(`[ERROR] ${message}`, ...args);
		}
	},
});

const CURRENT_LOG_LEVEL = import.meta.env.MODE === "development" ? LOG_LEVELS.DEBUG : LOG_LEVELS.NONE;

export const logger = createLogger(CURRENT_LOG_LEVEL);

export default logger;
