# Bug Report — BUG-01

## Title
Leave "To Date" field silently produces a corrupted/concatenated date value when typed over without first clearing the auto-populated default.

## Module / Feature
Leave > Apply Leave

## Severity
Medium

## Priority
Medium

## Environment
- Application: OrangeHRM demo, https://opensource-demo.orangehrmlive.com
- Module: Leave > Apply
- Browser: Chrome (Chrome for Testing build), via Playwright automation
- Date observed: during Part A (Q4) test automation development

## Preconditions
- User is logged in as Admin.
- User has navigated to Leave > Apply.

## Steps to Reproduce
1. Select any Leave Type with a positive balance (e.g. "CAN - Personal").
2. Click into the **From Date** field and enter a valid date, e.g. `2026-11-10`.
3. Click into the **To Date** field. Note that it auto-populates with the same value as From Date (`2026-11-10`) as soon as it receives focus.
4. Without first clearing the field, type a new date directly, e.g. `2026-11-15`.
5. Inspect the field's actual value (e.g. via browser dev tools or by reading the input's value attribute).

## Expected Result
Typing into the "To Date" field while it holds an auto-populated value should either:
- replace the existing value character-by-character in a masked-input-safe way, or
- clear the field entirely once the user starts typing,

so the field always holds a single, valid `yyyy-mm-dd` date.

## Actual Result
The newly typed characters are **appended/interleaved with the existing auto-populated value** rather than replacing it. Directly observed and logged during test execution:

| Action | To Date field value (captured via `inputValue()`) |
|---|---|
| Before interaction | *(empty)* |
| After clicking into the field (auto-populated) | `2026-11-10` |
| After typing `2026-11-15` without clearing first | `2026-11-10026-11-10` (garbled/concatenated) |

The field ends up holding a malformed string that is not a valid date. In one reproduction the form's own client-side validator caught this and blocked submission with "Should be a valid date in yyyy-mm-dd format" — but this only happens if the user notices; there is no visual indication while typing that the value is being corrupted, and the field's on-screen rendering can look plausible at a glance.

## Impact
A real user (or a manual tester following normal instincts — click the field, type the new date) is very likely to trigger this, since the "To Date" field's auto-fill behavior is not obvious and the masked input does not clear on focus or on the first keystroke. This can lead to:
- confusing, hard-to-parse validation errors for end users, or
- (in a build without matching server-side validation) potential submission of a malformed leave request date.

## Suggested Fix
- Clear the "To Date" input's value automatically as soon as the user begins typing over an auto-populated value, or
- Select the entire existing value on focus (so typing naturally replaces it, matching standard browser date-input UX).

## Workaround (used in test automation)
Triple-click the field (select-all) before typing, which correctly replaces the value:
```ts
await dateInput.click({ clickCount: 3 });
await dateInput.type(newDate);
```
This is not something an average manual tester or end user would intuitively do.

## Screenshot
![To Date field showing the corrupted concatenated value](screenshots/BUG-01-todate-concatenation.png)

The To Date field visibly reads `...26-11-102026-11-15` — the tail end of the original auto-populated value concatenated with the newly typed date, confirming the defect described above.

## Related finding: locale-dependent date order
While reproducing this defect, the date fields' expected input order was also observed to vary between sessions: `placeholder="yyyy-mm-dd"` in some sessions and `placeholder="yyyy-dd-mm"` in others (screenshot above shows the `yyyy-dd-mm` variant). This is not necessarily a defect on its own, but it means any automation or manual data entry that assumes a fixed `yyyy-mm-dd` order can silently submit an unintended (but still calendar-valid) date if day and month differ, since the wrong characters land in the wrong position. The Part A automation (`tests/pages/LeavePage.ts`) now reads each field's actual placeholder at runtime and reorders the typed value accordingly, rather than assuming a fixed format.

## Notes
This defect is independent of and not covered by the Part A UI automation, which works around it deliberately (see `tests/pages/LeavePage.ts`, `formatForField` / triple-click-before-type).
