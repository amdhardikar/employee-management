# Authentication module

## Purpose

Authentication controls access to every EMS business route. The current implementation validates an employee's email and employee code against the employees REST resource, stores the authenticated employee in Redux and localStorage, and redirects unauthenticated visitors to login.

## Main files

- `src/pages/Login.jsx` renders credentials, validation, submission, error feedback, and post-login navigation.
- `src/context/AuthContext.js` defines the shared context.
- `src/context/AuthProvider.jsx` connects Redux authentication state to context consumers.
- `src/store/authSlice.js` implements the asynchronous login operation and session state.
- `src/components/common/ProtectedRoute.jsx` guards private routes.
- `src/components/common/Header.jsx` and `Sidebar.jsx` expose authenticated navigation and logout.
- `src/api/employeeApi.js` performs the credential lookup.

## Login flow

1. The user enters email and employee code on `/login`.
2. The login page validates that required values exist.
3. `AuthProvider.login` dispatches the Redux `login` thunk.
4. The thunk requests `GET /employees?email={email}&employeeCode={code}`.
5. A matching employee becomes the current user and is serialized under `ems_session` in localStorage.
6. The user returns to the protected URL they originally requested, or `/dashboard` when no return location exists.
7. Errors remain in authentication state and are displayed without navigating away.

## Session restoration

`authSlice` reads `ems_session` when its initial state is created. `AuthProvider` exposes an initialization/loading state so protected content does not redirect prematurely while the existing session is being resolved.

## Route protection

`ProtectedRoute` has three outcomes:

- Initialization in progress: render a loading state.
- No authenticated user: redirect to `/login` and preserve the requested location.
- Authenticated user: render the protected child layout and routes.

All routes nested under `MainLayout` are guarded by this component.

## Logout flow

Logout clears the persisted session and Redux user state. The application shell then navigates to `/login` with replacement semantics so the protected page is not retained as the active history entry.

## Security boundaries

This implementation is appropriate for a local demonstration but is not server-enforced authentication. Credentials are queried through a JSON REST resource, and session data is stored in browser-readable localStorage. A production system should use a secured authentication endpoint, hashed credentials, short-lived tokens or secure cookies, server-side authorization, HTTPS, and an explicit session-expiry policy.

## Maintenance notes

- Never place passwords, access tokens, bank details, or other secrets in logs.
- Preserve the requested location when modifying login redirects.
- Keep localStorage key changes synchronized between initialization and logout.
- Authorization must be enforced by the server; client route guards only control presentation.
