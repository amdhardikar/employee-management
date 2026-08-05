import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import useMediaQuery from "../../hooks/useMediaQuery";
import * as mediaQueryModule from "../../hooks/useMediaQuery";

describe("useMediaQuery", () => {
	let listeners = [];

	beforeEach(() => {
		listeners = [];

		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: vi.fn().mockImplementation((query) => ({
				matches: false,
				media: query,
				addEventListener: vi.fn((event, callback) => {
					listeners.push(callback);
				}),
				removeEventListener: vi.fn((event, callback) => {
					listeners = listeners.filter((cb) => cb !== callback);
				}),
			})),
		});
	});

	it("should return false when window is undefined", () => {
		const originalWindow = globalThis.window;

		try {
			Object.defineProperty(globalThis, "window", {
				value: undefined,
				writable: true,
				configurable: true,
			});

			expect(mediaQueryModule.getMatches("(min-width: 768px)")).toBe(
				false,
			);
		} finally {
			Object.defineProperty(globalThis, "window", {
				value: originalWindow,
				writable: true,
				configurable: true,
			});
		}
	});

	it("should return false initially", () => {
		const { result } = renderHook(() =>
			useMediaQuery("(min-width: 768px)"),
		);

		expect(result.current).toBe(false);
	});

	it("should return true when media query matches", () => {
		window.matchMedia.mockImplementation((query) => ({
			matches: true,
			media: query,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}));

		const { result } = renderHook(() =>
			useMediaQuery("(min-width: 768px)"),
		);

		expect(result.current).toBe(true);
	});

	it("should update when media query changes", () => {
		const { result } = renderHook(() =>
			useMediaQuery("(min-width: 768px)"),
		);

		expect(result.current).toBe(false);

		act(() => {
			listeners[0]({
				matches: true,
			});
		});

		expect(result.current).toBe(true);

		act(() => {
			listeners[0]({
				matches: false,
			});
		});

		expect(result.current).toBe(false);
	});

	it("should remove listener on unmount", () => {
		const removeEventListener = vi.fn();

		window.matchMedia.mockImplementation((query) => ({
			matches: false,
			media: query,
			addEventListener: vi.fn(),
			removeEventListener,
		}));

		const { unmount } = renderHook(() =>
			useMediaQuery("(min-width: 768px)"),
		);

		unmount();

		expect(removeEventListener).toHaveBeenCalledTimes(1);
	});
});
