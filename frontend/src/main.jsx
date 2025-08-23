/**
 * Main Entry Point
 * ----------------
 * The main entry point for the React application. Renders the root component (`App`) inside the `#root` element.
 *
 * Imports:
 *   - StrictMode: React's strict mode for highlighting potential issues in the app.
 *   - createRoot: ReactDOM's method for rendering the app in the DOM.
 *   - BrowserRouter: Provides routing capabilities for the app.
 *   - App: The root component of the application.
 *   - index.css: Global styles for the application.
 *
 * Layout:
 *   - Wraps the `App` component with `BrowserRouter` for routing.
 *   - Wraps the entire app in `StrictMode` for development warnings.
 *
 * Usage:
 *   - This file is the entry point specified in `index.html` and is responsible for bootstrapping the React app.
 *
 * Example:
 *   - Rendered in `index.html`:
 *       <script type="module" src="/src/main.jsx"></script>
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StrictMode>
);
