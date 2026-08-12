import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import logger, { createLogger } from "../../../src/logging/logger";

describe("logger", () => {
	let debugSpy;
	let infoSpy;
	let warnSpy;
	let errorSpy;

	beforeEach(() => {
		debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
		infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
		warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
		errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("suppresses debug, info, and warn logs in the test environment", () => {
		logger.debug("debug");
		logger.info("info");
		logger.warn("warn");

		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
	});

	it("suppresses error logs in the test environment", () => {
		logger.error("failure", { code: 500 });

		expect(errorSpy).not.toHaveBeenCalled();
	});

	it("writes every severity when configured for debug output", () => {
		const debugLogger = createLogger(0);
		debugLogger.debug("debug", 1);
		debugLogger.info("info", 2);
		debugLogger.warn("warn", 3);
		debugLogger.error("error", 4);

		expect(debugSpy).toHaveBeenCalledWith("[DEBUG] debug", 1);
		expect(infoSpy).toHaveBeenCalledWith("[INFO] info", 2);
		expect(warnSpy).toHaveBeenCalledWith("[WARN] warn", 3);
		expect(errorSpy).toHaveBeenCalledWith("[ERROR] error", 4);
	});

	it("suppresses every severity when logging is disabled", () => {
		const silentLogger = createLogger(4);
		silentLogger.debug("debug");
		silentLogger.info("info");
		silentLogger.warn("warn");
		silentLogger.error("error");
		expect(debugSpy).not.toHaveBeenCalled();
		expect(infoSpy).not.toHaveBeenCalled();
		expect(warnSpy).not.toHaveBeenCalled();
		expect(errorSpy).not.toHaveBeenCalled();
	});
});
