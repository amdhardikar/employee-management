import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Pagination from "../../../components/common/Pagination";

const defaultProps = {
	currentPage: 2,
	totalPages: 5,
	totalItems: 45,
	pageSize: 10,
	onPageChange: vi.fn(),
	onPageSizeChange: vi.fn(),
};

const renderPagination = (props = {}) => {
	return render(<Pagination {...defaultProps} {...props} />);
};

describe("Pagination", () => {
	it("renders pagination information", () => {
		renderPagination();

		expect(screen.getByText("2 / 5")).toBeInTheDocument();

		expect(screen.getByText("45")).toBeInTheDocument();
	});

	it("shows correct item range", () => {
		renderPagination();

		expect(screen.getByText("11")).toBeInTheDocument();

		expect(screen.getByText("20")).toBeInTheDocument();
	});

	it("renders page size options", () => {
		renderPagination();

		expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();

		expect(screen.getByRole("option", { name: "25" })).toBeInTheDocument();

		expect(screen.getByRole("option", { name: "50" })).toBeInTheDocument();

		expect(screen.getByRole("option", { name: "100" })).toBeInTheDocument();
	});

	it("returns null when totalPages is zero", () => {
		const { container } = renderPagination({
			totalPages: 0,
		});

		expect(container.firstChild).toBeNull();
	});

	it("disables previous button on first page", () => {
		renderPagination({
			currentPage: 1,
		});

		expect(
			screen.getByRole("button", {
				name: /previous/i,
			}),
		).toBeDisabled();
	});

	it("disables next button on last page", () => {
		renderPagination({
			currentPage: 5,
			totalPages: 5,
		});

		expect(
			screen.getByRole("button", {
				name: /next/i,
			}),
		).toBeDisabled();
	});

	it("calls onPageChange with previous page", async () => {
		const user = userEvent.setup();

		const onPageChange = vi.fn();

		renderPagination({
			currentPage: 3,
			onPageChange,
		});

		await user.click(
			screen.getByRole("button", {
				name: /previous/i,
			}),
		);

		expect(onPageChange).toHaveBeenCalledWith(2);
	});

	it("calls onPageChange with next page", async () => {
		const user = userEvent.setup();

		const onPageChange = vi.fn();

		renderPagination({
			currentPage: 3,
			onPageChange,
		});

		await user.click(
			screen.getByRole("button", {
				name: /next/i,
			}),
		);

		expect(onPageChange).toHaveBeenCalledWith(4);
	});

	it("calls onPageSizeChange when page size changes", async () => {
		const user = userEvent.setup();

		const onPageSizeChange = vi.fn();

		renderPagination({
			onPageSizeChange,
		});

		const select = screen.getByRole("combobox", {
			name: /rows per page/i,
		});

		await user.selectOptions(select, "25");

		expect(onPageSizeChange).toHaveBeenCalledTimes(1);
	});
});
