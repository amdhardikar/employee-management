# API module

## Purpose

The API layer is the single boundary between React code and the local EMS REST service. Components and hooks should call these clients instead of constructing URLs or invoking `fetch` directly.

## Base service

All resources currently use `http://localhost:5000`.

| Client | Resource | Responsibility |
| --- | --- | --- |
| `employeeApi` | `/employees` | Employee listing, lookups, authentication query, create, update, and delete |
| `departmentApi` | `/departments` | Department list, lookup, create, update, and delete |
| `designationApi` | `/designations` | Designations filtered by department |
| `dashboardApi` | `/dashboard` | Aggregate dashboard information |
| `attendanceApi` | `/monthlyAttendance` | Employee monthly attendance history |
| `payrollApi` | `/payrolls` | Employee payroll records |

## Employee API

| Method | Request | Result |
| --- | --- | --- |
| `getAll()` | `GET /employees` | Complete employee collection |
| `getEmployees(options)` | `GET /employees` with `_page`, `_limit`, `_sort`, `_order`, search, department, and status | `{ data, page, pages, items }` using `X-Total-Count` |
| `getManagers()` | `GET /employees/?employment.manager.id=null` | Simplified manager `{id, name}` options |
| `getById(id)` | `GET /employees?employeeId={id}` | First matching employee |
| `getByDepartment(id)` | `GET /employees?employment.departmentId={id}` | Employees in a department |
| `getByEmailAndEmployeeCode(email, code)` | Credential query against `/employees` | Raw response used by authentication |
| `createEmployee(employee)` | `POST /employees` | Created employee |
| `updateEmployee(id, employee)` | `PATCH /employees/:id` | Updated employee |
| `removeEmployee(id)` | `DELETE /employees/:id` | `true` after success |

Employee listing defaults to page 1, page size 10, descending employee ID order, and no department/status restriction. Search whitespace is trimmed before the parameter is sent.

## Department API

| Method | Request | Result |
| --- | --- | --- |
| `getAll()` | `GET /departments` | Complete department collection |
| `getById(id)` | `GET /departments?departmentId={id}` | First matching department |
| `createDepartment(body)` | `POST /departments` | Created department |
| `updateDepartment(departmentId, body)` | `PATCH /departments/:departmentId` | Updated department |
| `removeDepartment(id)` | `DELETE /departments/:id` | Mutation completion |

Callers must distinguish the business `departmentId` used by query routes from the server resource key required by mutation URLs.

## Reference and reporting APIs

- `designationApi.getByDepartment(departmentId)` requests `GET /designations?departmentId={departmentId}` for dependent form choices.
- `dashboardApi.getDashboard()` requests `GET /dashboard` and returns the aggregate object.
- `attendanceApi.getByEmployeeId(employeeId)` requests monthly attendance sorted newest first.
- `payrollApi.getByEmployeeId(employeeId)` requests payroll records for one employee.

## Request policy

- JSON mutations send `Content-Type: application/json` and serialize the supplied body.
- Every method checks `response.ok` before parsing or returning data.
- Expected JSON bodies are parsed inside the client.
- Operations log diagnostic, success, and failure information through `logger`.
- A browser `TypeError` with message `Failed to fetch` is translated to: `Unable to connect to server. Please try again later.`
- Other errors are rethrown so the owning page can display the domain-specific failure state.

## Pagination contract

The employee list relies on JSON Server conventions:

- `_page`: one-based page number
- `_limit`: records per page
- `_sort`: property used for ordering
- `_order`: `asc` or `desc`
- `X-Total-Count`: total matching records in the response headers

The client calculates total pages as `Math.ceil(totalItems / pageSize)`.

## Maintenance notes

- Move the base URL to environment configuration before deployment.
- Keep request construction inside API modules.
- Do not silently swallow errors; pages depend on rejected promises to render `ErrorState`.
- Add response-schema validation when integrating with a production backend.
- Avoid logging credential or confidential payroll/bank values.
