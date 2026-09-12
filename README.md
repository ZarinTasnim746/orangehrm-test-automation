# OrangeHRM Test Automation Assignment

This is my project assignment for QA automation. It covers UI testing with Playwright, some manual test cases, and API testing with Postman.

- UI site: [OrangeHRM demo](https://opensource-demo.orangehrmlive.com/web/index.php/auth/login)
- API: [JSONPlaceholder](https://jsonplaceholder.typicode.com/users)

## What's in this project

- **Part A - UI automation**: `tests/` folder, 4 test files (Q1 to Q4)
- **Part B - Manual testing**: `manual-tests/` folder, test cases in a CSV file + 1 bug report
- **Part C - GitHub**: this repo + commits
- **Part D - API automation**: `postman/` folder, Postman collection for the JSONPlaceholder API

## Tools used

- Playwright with TypeScript for the UI tests (using Page Object Model, one file per page in `tests/pages/`)
- Postman + Newman for the API tests
- GitHub Actions for CI (runs the tests automatically when I push)

## How to run it

First install everything:

```bash
npm install
npx playwright install --with-deps chromium
```

### Running the UI tests

You can run all 4 tests together:

```bash
npm run test:ui
```

Or run one at a time:

```bash
npm run test:login    # Q1
npm run test:pim      # Q2
npm run test:admin    # Q3
npm run test:leave    # Q4
```

To see the report after running:

```bash
npx playwright show-report
```

### Running the API tests

```bash
npm run test:api
```

This runs the Postman collection using Newman and creates an HTML report in `reports/api-report.html`. It checks the status codes and also checks the response data (like the id and phone number).

### Run everything

```bash
npm run test:all
```

This runs the UI tests first then the API tests.

## Part B - Manual testing

I put the manual test cases in `manual-tests/test-cases.csv`. There's also a bug report in `manual-tests/bug-report.md` for a bug I found while testing the Leave page. More info in `manual-tests/README.md`.

I tried to write test cases for things that weren't already covered by the automated tests, like empty fields, special characters, and some edge cases.

## A few notes / issues I ran into

The OrangeHRM demo site is a public site that lots of people use for practice, so sometimes it's slow or the test data changes while I'm testing (like the leave balance running out, or dropdown values being different each time). I tried to make the tests handle this better:

- The date fields on the Leave page sometimes show `yyyy-mm-dd` format and sometimes `yyyy-dd-mm` - my code checks which one it is before typing the date
- If the leave type I picked has no balance left, the test tries other leave types instead
- Sometimes Q3 and Q4 fail because the site is slow/busy with other people using it, not because of a bug in my code. Running it again usually works.

## Project files

```
tests/
  login.spec.ts    -> Q1
  pim.spec.ts      -> Q2
  admin.spec.ts    -> Q3
  leave.spec.ts    -> Q4
  pages/           -> page objects
postman/
  jsonplaceholder-users.postman_collection.json
manual-tests/
  test-cases.csv
  bug-report.md
playwright.config.ts
package.json
```
