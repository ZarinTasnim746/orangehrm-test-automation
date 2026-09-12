# Manual Testing - Part B

This folder has my manual test cases and a bug report.

- `test-cases.csv` - 15 test cases covering Login, PIM, Admin, and Leave. You can open it in Excel or Google Sheets.
- `bug-report.md` - a bug I found in the Leave page while testing.

## How I picked the test cases

I tried not to repeat the same scenarios that are already covered in the Part A automated tests. So instead of testing the "happy path" again, these focus more on:
- empty fields / required field checks
- special characters in inputs
- edge cases like max length, past dates, wrong date ranges
- trying to access pages without logging in
- deleting a user (not done in the automated tests)

Each test case has a "Module/Feature" column that says which part of the app it's testing.

## About the Status column

Most cases were actually run against the real demo site and marked Pass/Fail based on what happened. One test case (TC-15) is marked "Not Executed" because the site wasn't responding when I tried to test it - didn't want to just guess and write Pass/Fail without actually checking.

## The bug I found

Check `bug-report.md` for details - found it while testing the "To Date" field on the Leave > Apply page.
