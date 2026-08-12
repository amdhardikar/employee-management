/**
 * @fileoverview Starts the browser application. It mounts React in StrictMode, supplies the Redux store and authentication context, enables browser routing, and loads global styles.
 *
 * @description
 * This module is part of the Employee Management System client. The summary above describes
 * its ownership boundary so maintainers can quickly identify why it exists and how it participates
 * in the surrounding UI, state, or data flow.
 *
 * @module src/main
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { reportWebVitals } from "./utils/reportWebVitals";

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
);

reportWebVitals();
