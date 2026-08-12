# Shared UI, hooks, and state

## Purpose

Shared modules provide the application shell and reusable behavior used across business areas. Reusing these contracts keeps loading, errors, empty results, navigation, filtering, pagination, tables, and cards consistent.

## Application shell

`MainLayout` renders the shared header, sidebar, breadcrumb area, and nested route outlet. Domain layouts (`EmployeeLayout`, `DepartmentLayout`, `AttendanceLayout`, and `PayslipLayout`) provide route grouping and an outlet for their child screens.

`Sidebar` owns primary navigation and active-route highlighting. Its responsive open state comes from `uiSlice`. `Header` exposes the mobile navigation trigger and authenticated-user actions.

## Feedback components

| Component | Use |
| --- | --- |
| `PageLoader` | An active page or record request |
| `ErrorState` | A request or processing failure with readable context |
| `EmptyState` | A successful collection request with zero results |
| `NotFound` | A route lookup that returned no matching record |

These states should be resolved before rendering components that expect complete domain objects.

## Navigation components

`Breadcrumb` combines the current URL with metadata in `src/router.js`. Static and parameterized routes receive labels, intermediate locations are links, and the final segment is marked current.

`ProtectedRoute` is the authentication boundary for the shared business shell. See [Authentication](authentication.md) for its decision flow.

## List controls

`Filters` is controlled by the owning page. It can render search, department, and status fields independently and emits native change/focus events. Its optional New action currently navigates to employee creation.

`Pagination` calculates a compact visible page range, record boundaries, previous/next disabled states, and page-size choices. Pages remain responsible for storing the selected page and making requests.

## Presentation primitives

`DataTable.jsx` exports semantic table elements with common styling. Domain tables compose these primitives instead of reproducing table chrome.

`InfoCard.jsx` exports card container, header, title, subtitle, content, grid, item, footer, and action primitives. Detail pages use them to group related fields consistently.

`StatCard` provides the dashboard metric layout.

## Common hooks

| Hook | Responsibility |
| --- | --- |
| `useDebounce(value, delay)` | Publish a value only after the quiet period; clears stale timers |
| `useMediaQuery(query)` | Track a CSS media-query match and clean up its listener |
| `useFilters({module, tableRef})` | Dispatch module filter changes, reset pagination, and scroll desktop tables |
| `useDepartments(namesOnly)` | Load/cache departments and return names or full records |
| `useEmployeeListing(options)` | Coordinate desktop page and mobile load-more employee results |

## Redux store

`src/store/store.js` registers five slices:

- `auth`: session and authentication request lifecycle
- `dashboard`: aggregate dashboard request lifecycle
- `departments`: reusable department cache
- `filters`: per-module list controls
- `ui`: sidebar visibility

### Filter state

Each module begins with `tablePage`, `cardPage`, `pageSize`, `search`, `sort`, `order`, and `department`. Employee filters additionally include `status`; department sorting defaults to `departmentName`.

`setFilters` merges partial values into one module. `resetFilters` restores one module's defaults. `resetAllFilters` restores the complete initial structure.

## Formatting and colors

`src/utils/display.js` formats missing values, dates, currency, addresses, phone numbers, and masked identifiers. Status color maps live in `src/constants/EMSconstants.js`. Domain components should use these shared utilities/constants so the same data is presented consistently.

## Maintenance notes

- Prefer a shared component only when behavior is truly common; domain rules should stay in domain modules.
- Keep controlled components free of remote-data ownership.
- Add route metadata whenever a route is added to `App.jsx`.
- Keep mobile card and desktop table experiences behaviorally equivalent.
