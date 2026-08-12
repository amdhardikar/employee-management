import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import Popup from "../../../../src/components/common/Popup";

describe("Popup", () => {
	it("renders nothing while the save operation is idle", () => {
		const { container } = render(<Popup />);
		expect(container).toBeEmptyDOMElement();
	});

	it("announces an in-progress save and prevents dismissal", () => {
		render(<Popup saving progressTitle="Deleting" savingMessage="Deleting employee..." />);
		expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
		expect(screen.getByRole("heading")).toHaveTextContent("Deleting");
		expect(screen.getByRole("status")).toHaveTextContent("Deleting employee...");
		expect(screen.queryByRole("button")).not.toBeInTheDocument();
	});

	it("shows and dismisses an Error object", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(
			<Popup
				error={new Error("Server unavailable")}
				errorTitle="Unable to create employee"
				onClose={onClose}
			/>,
		);
		expect(screen.getByRole("heading")).toHaveTextContent("Unable to create employee");
		expect(screen.getByRole("alert")).toHaveTextContent("Server unavailable");
		await user.click(screen.getByRole("button", { name: "Close" }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("supports messages, fallback errors, and the icon close control", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		const { rerender } = render(<Popup error="Validation failed" onClose={onClose} />);
		expect(screen.getByRole("alert")).toHaveTextContent("Validation failed");
		await user.click(screen.getByRole("button", { name: "Close error message" }));
		expect(onClose).toHaveBeenCalledOnce();

		rerender(<Popup error={new Error()} onClose={onClose} />);
		expect(screen.getByRole("alert")).toHaveTextContent("An unexpected error occurred");
	});

	it("provides a safe default close handler", async () => {
		const user = userEvent.setup();
		render(<Popup error="Failure" />);
		await expect(user.click(screen.getByRole("button", { name: "Close" }))).resolves.toBeUndefined();
	});
});
