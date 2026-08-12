import { describe, expect, it } from "vitest";
import reducer, {
	clearDesignations,
	invalidateDesignations,
	setDesignations,
} from "../../../src/store/designationSlice";

describe("designationSlice", () => {
	it("manages the designation cache lifecycle", () => {
		expect(reducer(undefined, {})).toEqual({ designations: [], loaded: false });
		const loaded = reducer(undefined, setDesignations([{ designationId: "D1" }]));
		expect(loaded).toEqual({ designations: [{ designationId: "D1" }], loaded: true });
		expect(reducer(loaded, invalidateDesignations())).toEqual({
			designations: [{ designationId: "D1" }],
			loaded: false,
		});
		expect(reducer(loaded, clearDesignations())).toEqual({ designations: [], loaded: false });
	});
});
