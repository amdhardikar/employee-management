import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableHeader,
	TableCell,
} from "../../../../src/components/common/DataTable";

describe("DataTable Components", () => {
	it("renders Table with children", () => {
		render(
			<Table>
				<tbody>
					<tr>
						<td>John</td>
					</tr>
				</tbody>
			</Table>,
		);

		expect(screen.getByText("John")).toBeInTheDocument();
	});

	it("renders TableHead", () => {
		const { container } = render(
			<table>
				<TableHead>
					<tr>
						<th>Name</th>
					</tr>
				</TableHead>
			</table>,
		);

		expect(container.querySelector("thead")).toBeInTheDocument();
	});

	it("renders TableBody", () => {
		const { container } = render(
			<table>
				<TableBody>
					<tr>
						<td>John</td>
					</tr>
				</TableBody>
			</table>,
		);

		expect(container.querySelector("tbody")).toBeInTheDocument();
	});

	it("renders TableRow with custom class", () => {
		const { container } = render(
			<table>
				<tbody>
					<TableRow className="bg-red-500">
						<td>John</td>
					</TableRow>
				</tbody>
			</table>,
		);

		expect(container.querySelector("tr")).toHaveClass("bg-red-500");
	});

	it("renders TableHeader with custom class", () => {
		const { container } = render(
			<table>
				<thead>
					<tr>
						<TableHeader className="text-center">Name</TableHeader>
					</tr>
				</thead>
			</table>,
		);

		expect(screen.getByText("Name")).toBeInTheDocument();
		expect(container.querySelector("th")).toHaveClass("text-center");
	});

	it("renders TableCell with custom class", () => {
		const { container } = render(
			<table>
				<tbody>
					<tr>
						<TableCell className="font-bold">John</TableCell>
					</tr>
				</tbody>
			</table>,
		);

		expect(screen.getByText("John")).toBeInTheDocument();
		expect(container.querySelector("td")).toHaveClass("font-bold");
	});
});
