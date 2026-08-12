# Employee module

## Purpose

The employee module owns the employee directory and the complete employee lifecycle presented by the client: listing, searching, filtering, viewing, creating, editing, and deleting employees.

## Routes

| Route | Screen | Behavior |
| --- | --- | --- |
| `/employees` | `Employees` | Responsive directory with filters and pagination |
| `/employees/new` | `EmployeeCreate` | Full employee onboarding form |
| `/employees/:id` | `EmployeeDetails` | Read-only employee profile |
| `/employees/edit/:id` | `EmployeeEdit` | Existing employee maintenance form |

## Main files

- `src/pages/Employees.jsx` orchestrates the directory.
- `src/components/employee/EmployeeTable.jsx` renders the desktop list and CRUD actions.
- `src/components/employee/EmployeeCard.jsx` renders each mobile summary.
- `src/components/employee/EmployeeDetails.jsx` loads and presents the complete profile.
- `src/components/employee/EmployeeCreate.jsx` and `EmployeeEdit.jsx` render the full forms.
- `src/hooks/useEmployeeListing.js` coordinates desktop/mobile result loading.
- `src/hooks/useEmployeeCreate.js` and `useEmployeeEdit.js` own form state and lookup loading.
- `src/utils/employeeValidation.js` contains the form rules.
- `src/utils/employeePayload.js` creates the server payload.
- `src/api/employeeApi.js` owns employee requests.

## Directory workflow

`Employees` reads the employee filter namespace from Redux. Search text is debounced for 500 ms before a server request is made. Department and status criteria are sent to `employeeApi.getEmployees` with page size, sort field, and order.

Desktop mode renders one page in `EmployeeTable` and displays `Pagination`. Mobile mode renders `EmployeeCard` records and increases `cardPage` when Load More is selected. Search focus is restored after loading so keyboard users can continue typing without manually refocusing the field.

Directory actions navigate using the business `employeeId`. Deletion sends the server record `id` to the DELETE endpoint and reloads the page after completion.

## Employee form model

The form represents these groups:

- Identity and personal information
- Email and phone contacts
- Current and permanent addresses
- Employment, department, designation, type, mode, location, and status
- Manager, HR, and lead reporting relationships
- Bank account information
- Emergency contact information
- Salary/default values where supported by the model

Create and edit hooks expose immutable helpers for root, nested, and deeply nested fields. Department changes refresh compatible designation choices. Touched state controls when field errors become visible, while full validation runs before submission.

## Validation rules

Validation returns an object keyed by the same names used by form controls. Current checks include:

- Required and pattern checks for names and email
- Required gender, blood group, marital status, and nationality
- Minimum employee age of 18
- Indian phone and six-digit postal-code formats
- Required current and permanent address fields
- Required employment selections
- Optional reporting IDs using the `EMP` identifier format
- Bank name, account number, IFSC, and branch rules
- Emergency-contact name, relationship, and phone rules

The form does not submit while validation errors exist.

## Save flow

1. The component prevents native form submission.
2. The hook validates the complete model.
3. `buildEmployeeUpdatePayload` derives values such as full name and employee code and normalizes nested groups.
4. Create sends `POST /employees`; edit sends `PATCH /employees/:id`.
5. On success, navigation returns to the employee detail route.
6. A saving flag prevents ambiguous UI state while the request is active.

## Details presentation

`EmployeeDetails` queries by the route `employeeId`, formats missing or sensitive values using display utilities, and groups the response into understandable cards. It explicitly handles loading, API failure, and a successful response with no employee.

## Maintenance notes

- Keep `EMPLOYEE_DEFAULT_VALUES`, validation keys, form field paths, and payload construction synchronized.
- Distinguish the server record `id` from the business-facing `employeeId`.
- Update both table and card views when adding a directory field.
- Add any new list criterion to the filter slice, page request callback, and API query builder together.
