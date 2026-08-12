import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import EmptyState from "../../../../src/components/common/EmptyState";

describe("EmptyState", () => {
	it("renders default title and message", () => {
		render(<EmptyState />);

		expect(screen.getByText("No Data Found")).toBeInTheDocument();
		expect(
			screen.getByText("There is no data available to display."),
		).toBeInTheDocument();
	});

	it("renders custom title and message", () => {
		render(
			<EmptyState
				title="Employees Not Found"
				message="Try changing your filters."
			/>,
		);

		expect(screen.getByText("Employees Not Found")).toBeInTheDocument();

		expect(
			screen.getByText("Try changing your filters."),
		).toBeInTheDocument();
	});
});
