# Dashboard module

## Purpose

The dashboard is the authenticated landing screen and provides a compact operational overview of the EMS data set. It translates aggregate service values into consistent summary cards and handles the complete dashboard request lifecycle.

## Main files

- `src/pages/Dashboard.jsx` renders the dashboard screen and statistics.
- `src/store/dashboardSlice.js` owns dashboard data, loading, error, and refresh behavior.
- `src/api/dashboardApi.js` fetches the aggregate dashboard resource.
- `src/components/common/StatCard.jsx` renders an individual metric.

## Data flow

1. The dashboard page reads the dashboard slice through Redux.
2. When data is not available or a refresh is requested, it dispatches `fetchDashboard`.
3. The async thunk calls `dashboardApi.getDashboard`.
4. Pending state enables the page loader.
5. A fulfilled request stores the aggregate object.
6. A rejected request stores a readable error and displays the error state.
7. The page maps available metrics into `StatCard` components.

## Redux behavior

The slice tracks the returned dashboard data, request loading, failure information, and refresh-related state. `clearDashboard` removes cached information. `refreshDashboard` marks the data for another fetch without requiring consumers to manually rebuild state.

## Data source

The dashboard client calls:

`GET http://localhost:5000/dashboard`

The service response is expected to contain the aggregate counts or metrics used by `Dashboard.jsx`. If the server contract changes, update the page mapping and dashboard-slice tests together.

## UI states

- Loading: the page does not render incomplete metrics.
- Error: a readable failure state replaces the dashboard.
- Success: metric cards are rendered with stable labels and icons.

## Maintenance notes

- Keep aggregation on the server or data source when possible; the dashboard should consume a concise summary rather than load every business record.
- Add new metrics through the API contract, page mapping, and tests together.
- Avoid storing formatted strings in Redux; format values at presentation time.
