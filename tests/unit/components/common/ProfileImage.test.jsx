import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfileImage from "../../../../src/components/common/ProfileImage";

describe("ProfileImage", () => {
	it("uses custom images with explicit dimensions and lazy loading", () => {
		render(<ProfileImage src="/employee.jpg" name="John Doe" className="avatar" />);
		const image = screen.getByRole("img", { name: "John Doe" });
		expect(image).toHaveAttribute("src", "/employee.jpg");
		expect(image).toHaveAttribute("width", "128");
		expect(image).toHaveAttribute("height", "128");
		expect(image).toHaveAttribute("loading", "lazy");
	});

	it("replaces remote generated avatars and failed images with local SVG fallbacks", () => {
		const { rerender } = render(
			<ProfileImage src="https://ui-avatars.com/api/?name=John%20Doe" name="John Doe" />,
		);
		expect(screen.getByRole("img").getAttribute("src")).toMatch(/^data:image\/svg\+xml/);

		rerender(<ProfileImage src="/broken.jpg" name="Jane Smith" eager />);
		const image = screen.getByRole("img", { name: "Jane Smith" });
		fireEvent.error(image);
		expect(image.getAttribute("src")).toMatch(/^data:image\/svg\+xml/);
		expect(image).toHaveAttribute("loading", "eager");
		expect(image).toHaveAttribute("fetchpriority", "high");
	});
});
