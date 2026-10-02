# Employee Management Application

A responsive Employee Management dashboard built with React and Redux
Toolkit. It was upgraded from an earlier basic MERN "User" CRUD starter
into a full assignment-ready application backed by the provided
MockAPI endpoints.

## Features

- Employee listing in a responsive, accessible table (desktop/tablet/mobile)
- Search employee by ID with loading, not-found and error states
- Add employee with full client-side validation
- Edit employee with automatic pre-population of existing data
- Delete employee behind a confirmation modal (Cancel / Delete)
- Country dropdown populated live from the Country mock API
- Redux Toolkit as the single source of truth for employees and countries
  (no employee/country data lives only in component `useState`)
- Smart/Dumb component architecture (see **Architecture** below)
- Loading, error and empty states on every asynchronous operation
- Toast notifications (`react-hot-toast`) for create/update/delete and
  API failures
- Unit and integration tests with mocked API calls (no real network
  calls are made from tests)

## Technology

- React 19 (Create React App / `react-scripts`)
- Redux Toolkit + React Redux
- Axios
- Bootstrap 5 + Font Awesome (loaded via CDN in `public/index.html`)
- React Router v7
- React Testing Library + Jest (via `react-scripts test`) +
  `@testing-library/jest-dom` + `@testing-library/user-event`
- `react-hot-toast` for notifications

## API

The app talks to the MockAPI instance supplied with the assignment:

| Purpose            | Method | URL                                                                 |
|---------------------|--------|----------------------------------------------------------------------|
| List employees      | GET    | `https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee`        |
| Get employee by ID  | GET    | `https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee/:id`    |
| Create employee     | POST   | `https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee`        |
| Update employee     | PUT    | `https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee/:id`    |
| Delete employee     | DELETE | `https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee/:id`    |
| List countries      | GET    | `https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/country`         |

Base URLs are configurable through environment variables (Create React
App requires the `REACT_APP_` prefix) instead of being hardcoded — see
`.env.example`:

```
REACT_APP_EMPLOYEE_API_URL=https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/employee
REACT_APP_COUNTRY_API_URL=https://669b3f09276e45187d34eb4e.mockapi.io/api/v1/country
```

Copy `.env.example` to `.env` (CRA loads `.env` automatically) if you
want to point at a different instance.

> **Note on State/District:** the assignment only supplies a Country
> API. There is no State/District API, and the real employee records
> returned by the mock API store `state`/`district` as free-text
> strings (e.g. `"Maharashtra"`, `"Pune"`) rather than IDs from a
> lookup table. The form therefore treats State and District as
> required text inputs rather than fabricating a fake dependent
> dropdown/API that doesn't exist.

## Installation

```bash
cd client
npm install
npm start
```

The app runs at `http://localhost:3000`.

## Testing

```bash
cd client
npm test
```

This runs the full Jest + React Testing Library suite in watch mode
(`npm test -- --watchAll=false` for a single CI-style run). All HTTP
calls are mocked at the service-module boundary — no test hits the
real network.

Test coverage includes:
- **Services** (`employeeService`, `countryService`): every CRUD call,
  success and failure paths
- **Redux** (`employeeSlice`, `countrySlice`): initial state, pending/
  fulfilled/rejected for every thunk, list mutation after add/update/
  delete
- **Components**: `EmployeeTable` rendering + actions, `EmployeeForm`
  validation (required fields, email format, mobile format, name
  length, successful submit, pre-population), `EmployeeSearch`
  (empty-input validation, trimmed submit, loading, clear)
- **Pages**: `EmployeeListPage` (loading/list/empty/error, edit
  navigation, delete confirm/cancel/confirm, error toast on failed
  delete), `AddEmployeePage` (blocked invalid submit, successful
  create + navigation, failed create), `EditEmployeePage` (load +
  pre-populate, load failure, successful update), `SearchEmployeePage`
  (found, not-found, empty-input guard)

## Build

```bash
cd client
npm run build
```

Produces an optimized production bundle in `client/build`.

## Architecture

```
src/
├── app/
│   └── store.js                 # configureStore wiring both slices
├── services/
│   ├── apiClient.js              # shared axios instance + error helper
│   ├── employeeService.js        # Employee CRUD HTTP calls
│   └── countryService.js         # Country HTTP calls
├── features/
│   ├── employees/employeeSlice.js
│   └── countries/countrySlice.js
├── components/
│   ├── common/                   # Loading, ErrorMessage, EmptyState,
│   │                              # DeleteConfirmationModal, Navbar
│   └── employees/                # EmployeeTable, EmployeeForm,
│                                  # EmployeeSearch
├── pages/                        # EmployeeListPage, AddEmployeePage,
│                                  # EditEmployeePage, SearchEmployeePage
├── utils/validation.js
└── tests/                        # components / features / services / pages
```

### Smart vs Dumb

- **Smart** (`pages/*`): hold Redux state via `useSelector`, dispatch
  thunks, own navigation and submission/deletion business logic.
- **Dumb** (`components/*`): pure presentational components. They
  receive data and callbacks as props and have no knowledge of Redux
  or Axios. `EmployeeForm` is the one exception worth calling out — it
  owns its own per-keystroke input state and client-side validation
  (standard for controlled forms), but never talks to the API itself;
  it only calls the `onSubmit(values)` prop it's given.

## Redux

Two slices, both created with `createSlice` + `createAsyncThunk`:

- **`employees`**: `employees`, `selectedEmployee` (for editing),
  `searchResult` (for the search page), and separate status/error
  fields for the list fetch, the single-employee fetch, the search,
  and any add/update/delete "operation" — so, for example, a failed
  delete doesn't clobber the loaded list state.
- **`countries`**: `countries`, `status`, `error`.

## Validation

Implemented in `src/utils/validation.js` and enforced in
`EmployeeForm` before any API call is made:

- Name: required, 3–50 characters
- Email: required, valid email format
- Mobile: required, 10-digit Indian mobile number (starts 6-9)
- Country: required (selected from the live API-backed dropdown)
- State: required
- District: required

## API error handling

- All axios errors are normalized in `services/apiClient.js`
  (`extractErrorMessage`) into a single user-facing string, so Redux
  state never stores non-serializable error/axios objects.
- Every thunk has its own `pending` / `fulfilled` / `rejected` case,
  so every page can show a loading spinner, an inline error message
  (with Retry where relevant) or a toast, instead of relying on
  `console.log`.
- Empty employee list → dedicated empty state with an "Add Employee"
  call to action. Empty search result / 404 → "Employee not found."

## Known constraints

- This project was completed inside a sandboxed environment with no
  outbound network access, so `npm install`, `npm test` and
  `npm run build` could not be executed here to verify a clean run.
  The code was written and reasoned through carefully (including
  fetching the live mock API responses to confirm field names), but
  please run the three commands above yourself after extracting the
  project, and treat this as your first verification step.
- `react-scripts` (5.0.1) predates React 19; if `npm install` reports
  peer-dependency warnings for `react`/`react-dom`, they are expected
  from the original project and are non-blocking (CRA still builds
  fine against React 19 in practice, but consider `npm install
  --legacy-peer-deps` if `npm install` hard-fails).
- The original Node/Express/MongoDB backend under `server/` is no
  longer used by the frontend — the assignment requires the given
  MockAPI endpoints instead of a custom backend for `Employee`/
  `Country` data (the old backend modeled a different `User` schema:
  name/email/address, no Redux, no country support). It has been left
  in the repository only for reference and is not required to run the
  app; it is not started by any script here.
