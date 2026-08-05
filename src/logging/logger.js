const LOG_LEVELS = {
	DEBUG: 0,
	INFO: 1,
	WARN: 2,
	ERROR: 3,
	NONE: 4,
};

const CURRENT_LOG_LEVEL = import.meta.env.MODE === "development" ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

const shouldLog = (level) => level >= CURRENT_LOG_LEVEL;

export const logger = {
	debug: (message, ...args) => {
		if (shouldLog(LOG_LEVELS.DEBUG)) {
			console.debug(`[DEBUG] ${message}`, ...args);
		}
	},

	info: (message, ...args) => {
		if (shouldLog(LOG_LEVELS.INFO)) {
			console.info(`[INFO] ${message}`, ...args);
		}
	},

	warn: (message, ...args) => {
		if (shouldLog(LOG_LEVELS.WARN)) {
			console.warn(`[WARN] ${message}`, ...args);
		}
	},

	error: (message, ...args) => {
		if (shouldLog(LOG_LEVELS.ERROR)) {
			console.error(`[ERROR] ${message}`, ...args);
		}
	},
};

export default logger;
