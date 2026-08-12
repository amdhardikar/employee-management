# Department module

## Purpose

The department module maintains organizational departments and their employee relationships. It provides a responsive directory, department summaries, details, creation, editing, deletion, and employee-assignment controls.

## Routes

| Route | Screen |
| --- | --- |
| `/departments` | Department directory |
| `/departments/new` | Create department |
| `/departments/:id` | Department details and assigned employees |
| `/departments/edit/:id` | Edit department and assignments |

## Main files

- `src/pages/Departments.jsx` coordinates directory data and actions.
- `DepartmentTable.jsx` and `DepartmentCard.jsx` provide desktop/mobile directory views.
- `DepartmentDetails.jsx`, `DepartmentDetailsTable.jsx`, and `DepartmentEmployeeCard.jsx` present a department and its people.
- `DepartmentCreate.jsx` manages creation fields and tag inputs.
- `DepartmentEdit.jsx` and `DepartmentEditTable.jsx` maintain department data and employee membership.
- `src/hooks/useDepartments.js` supplies cached lookup data.
- `src/utils/department.util.js` calculates employee counts.
- `src/api/departmentApi.js` owns department persistence.

## Directory behavior

The directory combines department records with employee data so each department can show total, active, and inactive employee counts. The shared filter model supplies search and pagination behavior. Desktop uses a table; smaller screens use department cards.

View and edit actions use the business `departmentId` in the route. Delete uses the server record identifier expected by the REST resource. Create navigation opens `/departments/new`.

## Summary calculation

`getDepartmentSummary` receives employees associated with a department and derives:

- Total employees
- Active employees
- Inactive employees

The utility is pure, allowing cards, tables, and tests to use identical status counting.

## Create workflow

The create screen collects department identity, descriptive information, managers or related metadata, and repeatable tag-style values. `TagInput` handles adding/removing values while reporting validation errors. After validation, the form sends a normalized body through `departmentApi.createDepartment` and returns to the directory.

## Edit and assignment workflow

The edit screen loads the department selected by the route and the employee collection needed for assignment. `DepartmentEditTable` exposes assignment-related controls while the parent owns persistence and navigation. Successful updates use the department server identifier in `PATCH /departments/:id`.

## Details workflow

The details screen loads the department and its employees, shows department metadata, and chooses a desktop table or employee-card presentation. Loading, API error, and missing department states are handled before rendering dependent content.

## Shared cache

`departmentSlice` stores departments and a `loaded` flag. `useDepartments` returns cached data when valid and can expose either names for filters or full objects for forms. Mutation flows should invalidate or update this cache so later screens do not display stale reference data.

## Maintenance notes

- Keep business `departmentId` and JSON-resource `id` usage explicit.
- Recalculate summaries from employee status rather than storing duplicated counts.
- When adding department fields, update create, edit, details, table/card presentation, API payloads, and tests.
- Assignment changes can affect employee and department views; verify both modules after edits.
