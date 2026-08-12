# Payroll module

## Purpose

The payroll module provides a searchable payroll directory and an employee-specific payslip/details view. It presents payroll status, compensation summaries, earnings, deductions, and final salary information.

## Routes

| Route | Screen |
| --- | --- |
| `/payroll` | Payroll directory |
| `/payroll/:id` | Payroll details for one employee |

## Main files

- `src/pages/Payroll.jsx` coordinates the directory request and responsive presentation.
- `PayrollTable.jsx` renders the desktop directory.
- `PayrollCard.jsx` renders mobile employee payroll summaries.
- `PayrollDetails.jsx` loads the selected employee's payroll data.
- `PayrollDetailsTable.jsx` renders detailed payroll values.
- `PayrollDetailCard.jsx` renders an individual detailed item responsively.
- `PayrollStatCard.jsx` displays high-level payroll metrics.
- `src/api/payrollApi.js` owns payroll lookup requests.

## Listing behavior

The payroll page uses the shared filter namespace and responsive list approach. Desktop users receive a table and numbered pagination; mobile users receive cards and load-more behavior. Selecting a payroll record navigates to `/payroll/:employeeId`.

Payroll statuses use `PAYROLL_STATUS_COLORS` so status badges remain consistent. Currency values are formatted as Indian rupees for user-facing tables, cards, and details.

## Details behavior

`PayrollDetails` reads the employee ID from the route and calls `payrollApi.getByEmployeeId`. It renders summary cards and detailed earnings/deduction information only after resolving loading, failure, and missing-record conditions.

The detail table and card components are presentation-only: they receive payroll objects, format values, and do not own requests or routing.

## Data source

Payroll data comes from the `payrolls` REST resource:

`GET /payrolls?employeeId={employeeId}`

## Maintenance notes

- Centralize currency behavior if additional payroll screens are introduced; currently detail components include local formatters while shared display utilities also support currency.
- Treat compensation values as numeric data even when the JSON service returns serializable strings.
- Update status colors, table, cards, details, and tests when adding a payroll state.
- Payroll is currently read-only in the client; adding mutations requires explicit API, authorization, validation, and audit behavior.
