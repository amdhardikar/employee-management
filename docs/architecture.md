# Architecture

## Purpose

EMS is a client-rendered React single-page application. Its architecture separates route-level orchestration, reusable presentation components, domain-specific components, remote-data clients, reusable hooks, Redux state, and pure utilities.

## Runtime composition

`src/main.jsx` mounts the application and installs providers in this order:

1. `React.StrictMode` enables additional development checks.
2. Redux `Provider` makes the configured store available to the component tree.
3. `BrowserRouter` supplies URL-based routing and navigation.
4. `AuthProvider` exposes the current session and authentication operations.
5. `App` declares the public and protected route tree.

The order is important: authentication and route components can access both Redux and routing APIs.

## Route model

`/login` is public. All business routes are children of `ProtectedRoute` and `MainLayout`.

| Area | Routes |
| --- | --- |
| Dashboard | `/dashboard` |
| Employees | `/employees`, `/employees/new`, `/employees/:id`, `/employees/edit/:id` |
| Departments | `/departments`, `/departments/new`, `/departments/:id`, `/departments/edit/:id` |
| Attendance | `/attendance`, `/attendance/:id` |
| Payroll | `/payroll`, `/payroll/:id` |

An unknown URL redirects to `/dashboard`. `src/router.js` separately defines route labels and parents for breadcrumb generation; changes to user-visible routes should update both the route tree and route metadata.

## Layer responsibilities

| Layer | Location | Responsibility |
| --- | --- | --- |
| Pages | `src/pages` | Coordinate a complete list or dashboard screen, including requests, filters, responsive mode, and UI states |
| Domain components | `src/components/{domain}` | Render tables, cards, details, and domain forms |
| Common components | `src/components/common` | Provide reusable layout, feedback, filtering, navigation, table, and card primitives |
| Layouts | `src/layout` | Render shared shells and nested route outlets |
| Hooks | `src/hooks` | Reuse stateful behavior such as debouncing, media queries, form state, lookup loading, and filters |
| API clients | `src/api` | Own URLs, HTTP methods, response parsing, logging, and network error translation |
| Redux | `src/store` | Own cross-route authentication, dashboard, department cache, filters, and UI state |
| Utilities | `src/utils` | Perform pure validation, payload construction, formatting, and summary calculations |

## Typical list-screen data flow

1. The page reads its module filters from Redux.
2. Search input is debounced before it affects the request.
3. A page callback calls the relevant API client.
4. Desktop mode requests one page for a table; mobile mode expands the limit for load-more cards.
5. The page chooses loading, error, empty, or populated presentation.
6. Shared filters update Redux and reset pagination when criteria change.
7. View/edit actions navigate to domain routes; mutation actions call the API before updating or reloading the view.

## State ownership

Use local component state for short-lived form and request details. Use Redux for state that must survive route/component changes or is consumed by multiple areas:

- `auth`: current user, authentication status, loading, and error.
- `dashboard`: dashboard data and request lifecycle.
- `departments`: shared department cache and loaded flag.
- `filters`: independent employee, attendance, payroll, and department list controls.
- `ui`: global sidebar visibility.

## Responsive strategy

List screens use `useMediaQuery("(min-width: 1024px)")`. Desktop renders a table with numbered pagination. Mobile renders cards and progressively increases the requested record limit through a Load More interaction. Keeping separate table and card page fields prevents one presentation mode from corrupting the other.

## Error and empty-state strategy

API clients throw domain-readable errors. Pages catch them and render `ErrorState`; successful empty responses render `EmptyState`; route lookups without a record render `NotFound`; active requests render `PageLoader`. This keeps feedback consistent and prevents data-dependent components from rendering incomplete models.
