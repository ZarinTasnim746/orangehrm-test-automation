# Manual Testing — Part B

## Contents
- `test-cases.csv` — 15 manual test cases spanning Login, PIM, Admin, and Leave modules. Opens directly in Excel/Google Sheets.
- `bug-report.md` — Defect found during manual/exploratory testing of the Leave > Apply Leave "To Date" field.

## Scope and traceability
Each test case's **Module/Feature** column maps it to the requirement/screen it validates (Login, PIM, Admin, or Leave), satisfying the test-to-requirement traceability requirement.

These cases were deliberately chosen to **complement**, not duplicate, the Part A UI automation (`tests/login.spec.ts`, `tests/pim.spec.ts`, `tests/admin.spec.ts`, `tests/leave.spec.ts`). Part A covers the "happy path" + one negative login case per the assignment brief; Part B instead focuses on:
- empty/required-field validation
- special character / injection input handling
- boundary conditions (max length, past dates, invalid date ranges)
- unauthorized/direct-URL access and session handling
- destructive actions not exercised in Part A (user deletion)

## Status column
`Pass` / `Fail` reflect actual execution against the live OrangeHRM demo instance during this test cycle. One case (TC-15) is marked `Not Executed` because the shared public demo instance (used concurrently by many learners) was unresponsive during the test window; it should be re-run before final sign-off rather than reported with a guessed result.

## Bug found
See `bug-report.md` — BUG-01, a data-corruption defect in the Leave "To Date" field's masked date input, found and precisely reproduced (with captured field values) while building the Part A Leave automation.
