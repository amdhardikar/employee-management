import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageLoader from "../../../../src/components/common/PageLoader";

describe("PageLoader", () => {
	it("renders default loading text", () => {
		render(<PageLoader />);

		expect(screen.getByText("Loading...")).toBeInTheDocument();
	});

	it("renders helper message", () => {
		render(<PageLoader />);

		expect(
			screen.getByText("Please wait while we fetch the data."),
		).toBeInTheDocument();
	});

	it("renders custom loading text", () => {
		render(<PageLoader text="Loading Employees..." />);

		expect(screen.getByText("Loading Employees...")).toBeInTheDocument();
	});
});
