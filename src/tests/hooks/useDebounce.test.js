import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { renderHook, act } from "@testing-library/react";

import useDebounce from "../../hooks/useDebounce";

describe("useDebounce", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("hello", 500));

		expect(result.current).toBe("hello");
	});

	it("updates value after delay", () => {
		const { result, rerender } = renderHook(
			({ value, delay }) => useDebounce(value, delay),
			{
				initialProps: {
					value: "hello",
					delay: 500,
				},
			},
		);

		expect(result.current).toBe("hello");

		rerender({
			value: "hello world",
			delay: 500,
		});

		// value should not update immediately
		expect(result.current).toBe("hello");

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(result.current).toBe("hello world");
	});

	it("uses default delay when delay is not provided", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value),
			{
				initialProps: {
					value: "first",
				},
			},
		);

		rerender({
			value: "second",
		});

		act(() => {
			vi.advanceTimersByTime(499);
		});

		expect(result.current).toBe("first");

		act(() => {
			vi.advanceTimersByTime(1);
		});

		expect(result.current).toBe("second");
	});

	it("clears previous timer when value changes quickly", () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 500),
			{
				initialProps: {
					value: "first",
				},
			},
		);

		rerender({
			value: "second",
		});

		act(() => {
			vi.advanceTimersByTime(200);
		});

		rerender({
			value: "third",
		});

		act(() => {
			vi.advanceTimersByTime(300);
		});

		// first timer was cleared,
		// second value should not update yet
		expect(result.current).toBe("first");

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(result.current).toBe("third");
	});
});
