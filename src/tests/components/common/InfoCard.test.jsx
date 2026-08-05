import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
	Card,
	CardHeader,
	CardTitle,
	CardSubtitle,
	CardContent,
	CardGrid,
	CardItem,
	CardFooter,
	CardAction,
} from "../../../components/common/InfoCard";

describe("InfoCard Components", () => {
	it("renders Card with children", () => {
		render(
			<Card>
				<p>Card Content</p>
			</Card>,
		);

		expect(screen.getByText("Card Content")).toBeInTheDocument();
	});

	it("renders CardHeader", () => {
		render(
			<CardHeader>
				<h1>Header</h1>
			</CardHeader>,
		);

		expect(screen.getByText("Header")).toBeInTheDocument();
	});

	it("renders CardTitle", () => {
		render(<CardTitle>Employee Details</CardTitle>);

		expect(
			screen.getByRole("heading", {
				name: /employee details/i,
			}),
		).toBeInTheDocument();
	});

	it("renders CardSubtitle", () => {
		render(<CardSubtitle>Software Engineer</CardSubtitle>);

		expect(screen.getByText("Software Engineer")).toBeInTheDocument();
	});

	it("renders CardContent", () => {
		render(
			<CardContent>
				<p>Main Content</p>
			</CardContent>,
		);

		expect(screen.getByText("Main Content")).toBeInTheDocument();
	});

	it("renders CardGrid with custom columns", () => {
		const { container } = render(
			<CardGrid columns="grid-cols-3">
				<div>One</div>
				<div>Two</div>
			</CardGrid>,
		);

		expect(screen.getByText("One")).toBeInTheDocument();
		expect(screen.getByText("Two")).toBeInTheDocument();

		expect(container.firstChild).toHaveClass("grid-cols-3");
	});

	it("renders CardItem with label and value", () => {
		render(<CardItem label="Department" value="Engineering" />);

		expect(screen.getByText("Department")).toBeInTheDocument();

		expect(screen.getByText("Engineering")).toBeInTheDocument();
	});

	it("renders CardItem children when no label is provided", () => {
		render(
			<CardItem>
				<p>Custom Content</p>
			</CardItem>,
		);

		expect(screen.getByText("Custom Content")).toBeInTheDocument();
	});

	it("renders horizontal CardItem", () => {
		render(<CardItem variant="horizontal" label="Salary" value="₹50,000" />);

		expect(screen.getByText("Salary")).toBeInTheDocument();
		expect(screen.getByText("₹50,000")).toBeInTheDocument();
	});

	it("renders CardFooter", () => {
		render(
			<CardFooter>
				<button>Save</button>
			</CardFooter>,
		);

		expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
	});

	it("calls CardAction onClick", async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();

		render(<CardAction onClick={onClick}>Edit</CardAction>);

		await user.click(
			screen.getByRole("button", {
				name: /edit/i,
			}),
		);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("renders CardGrid with default columns", () => {
		const { container } = render(
			<CardGrid>
				<div>Default Grid</div>
			</CardGrid>,
		);

		expect(screen.getByText("Default Grid")).toBeInTheDocument();

		expect(container.firstChild).toHaveClass("grid-cols-2");
	});

	it("renders horizontal CardItem using children when value is missing", () => {
		render(
			<CardItem variant="horizontal" label="Manager">
				John Doe
			</CardItem>,
		);

		expect(screen.getByText("Manager")).toBeInTheDocument();

		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});

	it("renders CardItem with custom class names", () => {
		const { container } = render(
			<CardItem
				label="Department"
				value="Engineering"
				className="custom-item"
				labelClassName="custom-label"
				valueClassName="custom-value"
			/>,
		);

		expect(container.firstChild).toHaveClass("custom-item");

		expect(screen.getByText("Department")).toHaveClass("custom-label");

		expect(screen.getByText("Engineering")).toHaveClass("custom-value");
	});

	it("renders CardAction with custom class", () => {
		const { container } = render(<CardAction className="custom-action">Action</CardAction>);

		expect(
			screen.getByRole("button", {
				name: "Action",
			}),
		).toBeInTheDocument();

		expect(container.firstChild).toHaveClass("custom-action");
	});
});
