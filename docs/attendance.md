# Attendance module

## Purpose

The attendance module presents monthly employee attendance at two levels: a cross-employee summary list and an employee-specific monthly detail view.

## Routes

| Route | Screen |
| --- | --- |
| `/attendance` | Employee attendance summary |
| `/attendance/:id` | Monthly attendance for one employee |

## Main files

- `src/pages/Attendance.jsx` coordinates the listing, filters, pagination, and navigation.
- `AttendanceTable.jsx` renders desktop summaries.
- `AttendanceCard.jsx` renders mobile summaries.
- `AttendanceDetails.jsx` loads the selected employee's attendance history.
- `AttendanceDetailsTable.jsx` renders detailed day/month information.
- `AttendanceMonthCard.jsx` renders a responsive monthly record.
- `src/utils/attendance.util.js` chooses percentage colors.
- `src/utils/attendanceDetails.util.js` calculates status totals.
- `src/api/attendanceApi.js` queries monthly attendance.

## Listing behavior

The list follows the shared responsive pattern: filter state comes from Redux, desktop renders a table with numbered pagination, and mobile renders cards with Load More behavior. Selecting a record navigates with the business `employeeId` to `/attendance/:id`.

Attendance percentages are converted to configured visual colors using threshold logic in `getAttendancePercentageColor`. Keeping this rule in a utility makes the table and card presentations consistent.

## Details behavior

`AttendanceDetails` requests records matching the route employee ID, sorted by `createdAt` in descending order so the latest month appears first. The screen presents monthly records and computed status totals.

`getAttendanceSummary` counts present, absent, leave, half-day, holiday, and weekend entries. The details components consume this derived data rather than duplicating counting logic in JSX.

## Data source

Attendance data comes from the `monthlyAttendance` REST resource. The API currently exposes an employee-specific lookup:

`GET /monthlyAttendance?employeeId={employeeId}&_sort=createdAt&_order=desc`

## UI states

- `PageLoader` while attendance is being requested
- `ErrorState` when the request fails
- `EmptyState` for a successful listing with no matching records
- `NotFound` when an employee-specific route has no attendance data

## Maintenance notes

- Add new attendance statuses to the constants, summary utility, table/card presentation, and tests together.
- Preserve percentage thresholds across all presentation modes.
- Date sorting depends on valid `createdAt` values from the service.
- Route IDs are employee business identifiers, not necessarily JSON-resource IDs.
