import { describe, expect, it } from "vitest";
import { display, date, currency, address, phone, mask, formatIndianPhone, properCase } from "../../../src/utils/formatter";

describe("display", () => {
	it.each([
		["9876543210", "+91 9876543210"],
		["+919876543210", "+91 9876543210"],
		["+91 9876543210", "+91 9876543210"],
		["123", "123"],
		[null, ""],
	])("formats Indian phone input %p", (input, expected) => {
		expect(formatIndianPhone(input)).toBe(expected);
	});
	it("returns the value when it exists", () => {
		expect(display("John")).toBe("John");
		expect(display(123)).toBe(123);
		expect(display(false)).toBe(false);
	});

	it("returns fallback for null, undefined and empty string", () => {
		expect(display(null)).toBe("—");
		expect(display(undefined)).toBe("—");
		expect(display("")).toBe("—");
	});

	it("returns custom fallback", () => {
		expect(display(null, "N/A")).toBe("N/A");
	});
});

describe("properCase", () => {
	it("capitalizes every word and lowercases remaining letters", () => {
		expect(properCase("jOHN doe")).toBe("John Doe");
		expect(properCase("12A mG ROAD")).toBe("12A Mg Road");
	});

	it("handles empty values and preserves whitespace", () => {
		expect(properCase(null)).toBe("");
		expect(properCase("new   delhi")).toBe("New   Delhi");
		expect(properCase("123 --")).toBe("123 --");
	});
});

describe("date", () => {
	it("formats a valid date", () => {
		expect(date("2024-01-15")).toBe("01-15-2024");
	});

	it("formats Date objects", () => {
		expect(date(new Date("2024-12-25"))).toBe("12-25-2024");
	});

	it("returns fallback for invalid date", () => {
		expect(date("invalid-date")).toBe("—");
	});

	it("returns fallback for nullish values", () => {
		expect(date(null)).toBe("—");
		expect(date(undefined)).toBe("—");
		expect(date("")).toBe("—");
	});

	it("returns custom fallback", () => {
		expect(date(null, "N/A")).toBe("N/A");
	});
});

describe("currency", () => {
	it("formats numeric values", () => {
		expect(currency(1000)).toBe("₹1,000");
		expect(currency("25000")).toBe("₹25,000");
		expect(currency(1234.56)).toBe("₹1,234.56");
	});

	it("returns fallback for invalid number", () => {
		expect(currency("abc")).toBe("—");
	});

	it("returns fallback for nullish values", () => {
		expect(currency(null)).toBe("—");
		expect(currency(undefined)).toBe("—");
		expect(currency("")).toBe("—");
	});

	it("returns custom fallback", () => {
		expect(currency(undefined, "N/A")).toBe("N/A");
	});
});

describe("address", () => {
	it("formats complete address", () => {
		expect(
			address({
				street: "221B Baker Street",
				city: "London",
				state: "Greater London",
				country: "UK",
				pincode: "123456",
			}),
		).toBe("221B Baker Street, London, Greater London, UK - 123456");
	});

	it("formats partial address", () => {
		expect(
			address({
				city: "Mumbai",
				state: "Maharashtra",
			}),
		).toBe("Mumbai, Maharashtra");
	});

	it("returns only pincode when no other fields exist", () => {
		expect(
			address({
				pincode: "400001",
			}),
		).toBe("400001");
	});

	it("returns fallback for empty object", () => {
		expect(address({})).toBe("—");
	});

	it("returns fallback for null", () => {
		expect(address(null)).toBe("—");
	});

	it("returns custom fallback", () => {
		expect(address(null, "N/A")).toBe("N/A");
	});

	it("returns address with pincode", () => {
		expect(
			address({
				city: "Mumbai",
				pincode: "400001",
			}),
		).toBe("Mumbai - 400001");
	});

	it("returns fallback when address has only empty values", () => {
		expect(
			address({
				street: "",
				city: "",
				state: "",
				country: "",
			}),
		).toBe("—");
	});
});

describe("phone", () => {
	it("formats a plain number", () => {
		expect(phone("9876543210")).toBe("+91 9876543210");
	});

	it("removes non-digit characters", () => {
		expect(phone("(987)-654-3210")).toBe("+91 9876543210");
	});

	it("preserves +91 prefix with spacing", () => {
		expect(phone("+919876543210")).toBe("+91 9876543210");
	});

	it("preserves already spaced +91 prefix", () => {
		expect(phone("+91 9876543210")).toBe("+91 9876543210");
	});

	it("returns fallback for empty values", () => {
		expect(phone("")).toBe("—");
		expect(phone("   ")).toBe("—");
		expect(phone(null)).toBe("—");
		expect(phone(undefined)).toBe("—");
	});

	it("returns fallback when no digits exist", () => {
		expect(phone("abcd")).toBe("—");
	});

	it("returns custom fallback", () => {
		expect(phone(null, "N/A")).toBe("N/A");
	});

	it("returns fallback when phone contains only symbols", () => {
		expect(phone("()--")).toBe("—");
	});
});

describe("mask", () => {
	it("masks all but last four characters", () => {
		expect(mask("1234567890")).toBe("XXXXXX7890");
		expect(mask("ABCDEFGHIJ")).toBe("XXXXXXGHIJ");
	});

	it("returns original value when length is four or less", () => {
		expect(mask("1234")).toBe("1234");
		expect(mask("123")).toBe("123");
	});

	it("trims whitespace before masking", () => {
		expect(mask(" 12345678 ")).toBe("XXXX5678");
	});

	it("returns fallback for empty values", () => {
		expect(mask(null)).toBe("—");
		expect(mask(undefined)).toBe("—");
		expect(mask("")).toBe("—");
		expect(mask("   ")).toBe("—");
	});

	it("returns custom fallback", () => {
		expect(mask(undefined, "N/A")).toBe("N/A");
	});
});
