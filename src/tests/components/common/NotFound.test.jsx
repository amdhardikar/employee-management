import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotFound from "../../../components/common/NotFound";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");

	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

describe("NotFound", () => {
	it("renders default title and message", () => {
		render(<NotFound />);

		expect(screen.getByText("Record Not Found")).toBeInTheDocument();

		expect(
			screen.getByText("The requested record could not be found."),
		).toBeInTheDocument();
	});

	it("renders custom title and message", () => {
		render(
			<NotFound
				title="Employee Missing"
				message="Employee does not exist."
			/>,
		);

		expect(screen.getByText("Employee Missing")).toBeInTheDocument();

		expect(
			screen.getByText("Employee does not exist."),
		).toBeInTheDocument();
	});

	it("navigates back when Go Back button is clicked", async () => {
		const user = userEvent.setup();

		render(<NotFound />);

		await user.click(screen.getByRole("button", { name: /go back/i }));

		expect(mockNavigate).toHaveBeenCalledWith(-1);
	});
});
