# OrangeHRM Test Automation Assignment

End-to-end QA assignment covering UI automation, manual testing, and API automation against:
- UI: [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login)
- API: [JSONPlaceholder](https://jsonplaceholder.typicode.com/users)

## Project overview

| Part | What it covers | Where |
|---|---|---|
| A — UI Automation | Login, PIM, Admin, Leave scenarios (Q1–Q4) | `tests/` |
| B — Manual Testing | 15 manual test cases + 1 bug report, complementing Part A | `manual-tests/` |
| C — GitHub Workflow | This repo, its commit history, and this README | — |
| D — API Automation | Postman/Newman collection against JSONPlaceholder | `postman/` |

## Tech stack

- **UI automation:** [Playwright](https://playwright.dev/) (TypeScript) using the Page Object Model — one Page Object per module (`LoginPage`, `PIMPage`, `AdminPage`, `LeavePage`) under `tests/pages/`.
- **API automation:** [Postman](https://www.postman.com/) collection, run headlessly via [Newman](https://github.com/postmanlabs/newman) with the `newman-reporter-htmlextra` HTML reporter.
- **CI:** GitHub Actions (`.github/workflows/playwright.yml`) runs both suites on every push/PR.

## Setup

```bash
npm install
npx playwright install --with-deps chromium
```

> Node.js 18+ is recommended. Tests run headless by default (Playwright's own bundled Chromium — no manual browser setup needed).

## Running the UI suite (Part A)

Each scenario runs independently, and all four run together as one suite.

```bash
# All four scenarios together, in one run
npm run test:ui

# Individually
npm run test:login    # Q1 - invalid login
npm run test:pim      # Q2 - add & search employee in PIM
npm run test:admin    # Q3 - search/edit/verify user in Admin
npm run test:leave    # Q4 - apply, verify, cancel leave
```

Equivalent raw Playwright commands:

```bash
npx playwright test --project=chromium                 # all four
npx playwright test tests/login.spec.ts --project=chromium
npx playwright test tests/pim.spec.ts --project=chromium
npx playwright test tests/admin.spec.ts --project=chromium
npx playwright test tests/leave.spec.ts --project=chromium
```

### Generating / viewing the UI report

An HTML report is generated automatically after every run (`playwright.config.ts` → `reporter: 'html'`).

```bash
npm run test:ui:report
# or
npx playwright show-report
```

## Running the API suite (Part D)

The Postman collection (`postman/jsonplaceholder-users.postman_collection.json`) is run from the command line via Newman:

```bash
npm run test:api
```

This runs the collection and writes an HTML report to `reports/api-report.html` (via `newman-reporter-htmlextra`), alongside CLI output. Every request validates its status code; the second request additionally validates that the returned `id` matches the one captured from the first request, and that `phone` is present and non-empty.

To run the collection with the plain Postman CLI/Newman directly:

```bash
npx newman run postman/jsonplaceholder-users.postman_collection.json
```

## Running everything together

```bash
npm run test:all
```

Runs the full UI suite followed by the API suite in one command — matching the "all scenarios runnable individually and together" requirement.

## Part B — Manual Testing

See [`manual-tests/README.md`](manual-tests/README.md) for the test case sheet (`test-cases.csv`) and the bug report (`bug-report.md`). These cases deliberately cover scenarios (empty-field validation, special characters, boundary/edge cases, unauthorized access, session behavior) not already exercised by the Part A automation.

## CI

GitHub Actions (`.github/workflows/playwright.yml`) installs dependencies, runs the Chromium UI suite, runs the Newman API suite, and uploads both HTML reports as build artifacts on every push and pull request to `main`/`master`.

## Known limitation

`opensource-demo.orangehrmlive.com` is a public, shared demo instance used concurrently by many learners, which surfaces a few environment-level quirks unrelated to the automation logic itself:

- Under heavy concurrent load, dropdown/autocomplete responses (Admin > Add User, Leave > Apply) can become slow, or the shared `Admin` account's linked employee data can shift mid-run, causing Q3/Q4 to occasionally time out. Re-running usually succeeds once the shared instance is less busy.
- The Leave module's date fields have been observed with **both** `yyyy-mm-dd` and `yyyy-dd-mm` placeholder orders depending on session/locale. `LeavePage.ts` reads the actual placeholder at runtime and reorders the typed date to match, rather than assuming a fixed format.
- The set of Leave Types configured with a positive balance on the shared `Admin` account fluctuates (and can be fully exhausted, i.e. every type at `0.00 Day(s)`, since many learners submit leave requests against the same shared entitlements). `LeavePage.ts` picks whichever available type actually has a usable balance, falling back to a Half Day request if no type has a full day available, and raises a clear error if none has any balance at all.

## Project structure

```
.
├── tests/
│   ├── login.spec.ts       # Q1
│   ├── pim.spec.ts         # Q2
│   ├── admin.spec.ts       # Q3
│   ├── leave.spec.ts       # Q4
│   └── pages/               # Page Objects
│       ├── LoginPage.ts
│       ├── PIMPage.ts
│       ├── AdminPage.ts
│       └── LeavePage.ts
├── postman/
│   └── jsonplaceholder-users.postman_collection.json
├── manual-tests/
│   ├── test-cases.csv
│   ├── bug-report.md
│   └── README.md
├── playwright.config.ts
└── package.json
```

<!-- last updated: 2026-09-12T09:03:31Z -->
