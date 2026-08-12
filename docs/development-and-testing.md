# Development and testing

## Technology stack

- React 19 and React DOM
- React Router 7
- Redux Toolkit and React Redux
- Tailwind CSS 4 through the Vite plugin
- Vite 6
- Vitest, Testing Library, jsdom, and V8 coverage
- ESLint 9 and Prettier
- JSON Server-compatible REST service

## Prerequisites

- A supported Node.js runtime
- Installed dependencies from `package-lock.json`
- An EMS REST service available at `http://localhost:5000`

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run api` | Start `server/server.js` with nodemon when the server project is available |
| `npm run build` | Create the production bundle in `dist` |
| `npm run preview` | Preview the production bundle |
| `npm run lint` | Run ESLint over the repository |
| `npm test` | Run Vitest in watch mode |
| `npm run coverage` | Run the test suite with text and HTML coverage |
| `npm run test:ui` | Open the Vitest UI |

## Test organization

Tests mirror the application structure under `src/tests`:

- API tests verify request URLs, methods, parsing, and failures.
- Component tests verify rendered states, content, and callbacks.
- Hook tests verify state transitions and side effects.
- Store tests verify reducers and asynchronous thunks.
- Utility tests verify pure transformations and edge cases.
- Router, context, layout, main, and App tests verify application composition.

`src/tests/setup.js` configures the shared jsdom/testing environment. Vite's test configuration enables globals, uses jsdom, and produces V8 text and HTML coverage.

## Change checklist

1. Update domain logic and its closest unit/component tests.
2. Update desktop and mobile presentations when list behavior changes.
3. Update API tests when endpoints, parameters, or response handling change.
4. Update route metadata and documentation when navigation changes.
5. Run lint and focused tests.
6. Run the production build.
7. Run the complete suite and coverage before release or formal handoff.

## Current local verification note

The application production build succeeds. At the time this documentation was prepared, lint reported an existing unused `user` variable in `src/tests/components/department/DepartmentCreate.test.jsx`. Resolve that test-only lint issue before requiring a completely clean lint gate.

## Documentation maintenance

- Update the appropriate file in `docs` when a workflow, route, state contract, or API contract changes.
- Keep top-of-file JSDoc focused on one file and these documents focused on cross-file module behavior.
- Prefer diagrams or tables only when they make a relationship clearer than prose.
- Do not document desired behavior as current behavior unless it is implemented and tested.
