import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import ErrorState from "../../../../src/components/common/ErrorState";

describe("ErrorState", () => {
    it("renders default title and message", () => {
        render(<ErrorState />);

        expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
        expect(screen.getByText("Unable to load data. Please try again.")).toBeInTheDocument();
    });

    it("renders custom title and message", () => {
    render(<ErrorState title="Request failed" message="Please retry the operation." />);

        expect(screen.getByRole("heading", { name: "Request failed" })).toBeInTheDocument();
    expect(screen.getByText("Please retry the operation.")).toBeInTheDocument();
  });

	it("runs the supplied retry action", () => {
		const onRetry = vi.fn();
		render(<ErrorState onRetry={onRetry} />);
		fireEvent.click(screen.getByRole("button", { name: "Try again" }));
		expect(onRetry).toHaveBeenCalledOnce();
	});

	it("provides a working default retry action", () => {
		render(<ErrorState />);
		expect(() => fireEvent.click(screen.getByRole("button", { name: "Try again" }))).not.toThrow();
	});
});
