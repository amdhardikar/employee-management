import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import StatCard from "../../../../src/components/common/StatCard";

describe("StatCard", () => {
	it("renders label and value without icon", () => {
		render(<StatCard label="Total Employees" value={120} />);

		expect(screen.getByText("Total Employees")).toBeInTheDocument();

		expect(screen.getByText("120")).toBeInTheDocument();
	});

	it("renders string values correctly", () => {
		render(<StatCard label="Attendance" value="95%" />);

		expect(screen.getByText("95%")).toBeInTheDocument();
	});

	it("renders icon when provided", () => {
		render(
			<StatCard
				label="Employees"
				value={50}
				icon={<span data-testid="stat-icon">Icon</span>}
			/>,
		);

		expect(screen.getByTestId("stat-icon")).toBeInTheDocument();
	});

	it("renders value with icon", () => {
		render(
			<StatCard
				label="Employees"
				value={50}
				icon={<span data-testid="stat-icon">Icon</span>}
			/>,
		);

		expect(screen.getByText("50")).toBeInTheDocument();
	});

	it("does not render icon when icon is not provided", () => {
		render(<StatCard label="Employees" value={50} />);

		expect(screen.queryByTestId("stat-icon")).not.toBeInTheDocument();
	});
});
