import { describe, it, expect, vi, beforeEach } from "vitest";

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock("react-dom/client", () => ({
    createRoot: createRootMock,
}));

vi.mock("../../src/App.jsx", () => ({
    default: () => <div>App</div>,
}));

vi.mock("react-redux", () => ({
    Provider: ({ children }) => children,
}));

vi.mock("react-router-dom", () => ({
    BrowserRouter: ({ children }) => children,
}));

vi.mock("../../src/store/store", () => ({
	store: {},
}));

vi.mock("../../src/utils/reportWebVitals", () => ({
	reportWebVitals: vi.fn(),
}));

describe("main entry point", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = '<div id="root"></div>';
    });

    it("mounts the application into the root element", async () => {
        await import("../../src/main.jsx");

        expect(createRootMock).toHaveBeenCalledWith(document.getElementById("root"));
        expect(renderMock).toHaveBeenCalledTimes(1);
    });
});
