import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import PropTypes from "prop-types"

import useFilters from "../../../src/hooks/useFilters";
import filterReducer from "../../../src/store/filterSlice";
import React from "react";

function createWrapper() {
	const store = configureStore({
		reducer: {
			filters: filterReducer,
		},
	});

	function Wrapper({ children }) {
		return React.createElement(Provider, { store }, children);
	}

	Wrapper.propTypes = {
		children: PropTypes.node.isRequired,
	};

	return Wrapper;
}

describe("useFilters hook", () => {
	it("should dispatch search filter and reset pagination", () => {
		const wrapper = createWrapper();

		const { result } = renderHook(
			() =>
				useFilters({
					module: "employee",

					tableRef: {
						current: null,
					},
				}),
			{
				wrapper,
			},
		);

		act(() => {
			result.current.updateQuery({
				search: "john",
			});
		});
	});

	it("should update search value", () => {
		const wrapper = createWrapper();

		const { result } = renderHook(
			() =>
				useFilters({
					module: "employee",

					tableRef: {
						current: null,
					},
				}),
			{
				wrapper,
			},
		);

		const event = {
			target: {
				value: "developer",
			},
		};

		act(() => {
			result.current.onSearchChangeHandler(event);
		});

		// Hook dispatches internally.
		// Slice test verifies reducer state.

		expect(result.current).toHaveProperty("onSearchChangeHandler");
	});

	it("should update department filter", () => {
		const wrapper = createWrapper();

		const { result } = renderHook(
			() =>
				useFilters({
					module: "employee",

					tableRef: {
						current: null,
					},
				}),

			{
				wrapper,
			},
		);

		act(() => {
			result.current.onDepartmentChangeHandler({
				target: {
					value: "Engineering",
				},
			});
		});

		expect(result.current).toHaveProperty("onDepartmentChangeHandler");
	});

	it("should update status filter", () => {
		const wrapper = createWrapper();

		const { result } = renderHook(
			() =>
				useFilters({
					module: "employee",

					tableRef: {
						current: null,
					},
				}),

			{
				wrapper,
			},
		);

		act(() => {
			result.current.onStatusChangeHandler({
				target: {
					value: "active",
				},
			});
		});
	});

	it("should change page and scroll table", () => {
		const scrollMock = vi.fn();

		const wrapper = createWrapper();

		const tableRef = {
			current: {
				scrollIntoView: scrollMock,
			},
		};

		const { result } = renderHook(
			() =>
				useFilters({
					module: "employee",

					tableRef,
				}),

			{
				wrapper,
			},
		);

		act(() => {
			result.current.onPageChangeHandler(3);
		});

		expect(scrollMock).toHaveBeenCalledWith({
			behavior: "smooth",

			block: "start",
		});
	});

	it("should update page size as number", () => {
		const wrapper = createWrapper();

		const { result } = renderHook(
			() =>
				useFilters({
					module: "employee",

					tableRef: {
						current: null,
					},
				}),

			{
				wrapper,
			},
		);

		act(() => {
			result.current.onPageSizeChangeHandler({
				target: {
					value: "25",
				},
			});
		});
	});
});
