# Employee Management System documentation

This directory is the technical and functional guide for the EMS React client. It is organized by business module so developers, reviewers, and demo presenters can move from the product view to the implementation details quickly.

## Documentation map

| Document | Scope |
| --- | --- |
| [Architecture](architecture.md) | Application structure, runtime providers, routing, state, data flow, and design conventions |
| [Authentication](authentication.md) | Login, session persistence, protected routing, and logout |
| [Dashboard](dashboard.md) | Summary metrics and dashboard state lifecycle |
| [Employee](employee.md) | Employee directory, create/edit forms, details, validation, and responsive listing |
| [Department](department.md) | Department directory, assignments, CRUD workflows, and summaries |
| [Attendance](attendance.md) | Monthly attendance listing, percentages, and employee attendance details |
| [Payroll](payroll.md) | Payroll listing, salary summaries, and payslip details |
| [API](api.md) | REST resources, client methods, request behavior, and error policy |
| [Shared UI and state](shared-ui-and-state.md) | Layout, reusable components, filters, pagination, Redux slices, and common hooks |
| [Development and testing](development-and-testing.md) | Local commands, dependencies, build, linting, and tests |

## Product at a glance

The Employee Management System is a protected single-page application for viewing and maintaining employee, department, attendance, and payroll information. After authentication, users enter a shared application shell with navigation and route-aware breadcrumbs. List modules provide desktop tables and mobile cards, while detail routes present complete domain records.

The client is built with React 19, React Router, Redux Toolkit, Tailwind CSS, and Vite. It communicates with a local JSON-style REST service at `http://localhost:5000` through API modules in `src/api`.

## Recommended reading order

1. Read [Architecture](architecture.md) to understand the runtime and request flow.
2. Read the relevant business-module document before changing a screen.
3. Use [API](api.md) when changing server queries or mutations.
4. Use [Shared UI and state](shared-ui-and-state.md) before introducing new controls, filters, or global state.
5. Run the checks listed in [Development and testing](development-and-testing.md) before handing over a change.

## Source of truth

These documents explain intent and relationships. Function signatures, PropTypes, JSDoc, and tests remain the source of truth for exact implementation behavior. Update the relevant module document whenever routes, API contracts, state ownership, or primary workflows change.
