# Bug Report - BUG-01

## Title
"To Date" field on the Leave page gets messed up if you type over it without clearing it first

## Where
Leave > Apply Leave

## Severity
Medium

## Steps to reproduce
1. Pick any leave type that has some balance
2. Click on "From Date" and type a date, like `2026-11-10`
3. Click on "To Date" - notice it automatically fills in with the same date as From Date
4. Without clearing it, just type a new date over it, like `2026-11-15`
5. Look at what's actually in the field now

## What I expected
Typing a new date should replace the old one (like normal input fields do).

## What actually happens
The new date gets mixed in with the old one instead of replacing it. I checked the actual field value and got stuff like `2026-11-10026-11-10` - totally garbled.

| Step | To Date value |
|---|---|
| before clicking | empty |
| after clicking (auto-fills) | `2026-11-10` |
| after typing `2026-11-15` | `2026-11-10026-11-10` (broken) |

Sometimes the form catches this and shows an error, but sometimes it doesn't and you don't notice anything's wrong until you submit.

## Screenshot
![To Date field bug](screenshots/BUG-01-todate-concatenation.png)

You can see the field shows a mixed-up value instead of the date I typed.

## Why this matters
A normal user would just click the field and type - they wouldn't know they need to clear it first. This could lead to people submitting wrong leave dates without realizing it.

## Extra thing I noticed
While testing this I also noticed the date format placeholder changes sometimes - it's `yyyy-mm-dd` sometimes and `yyyy-dd-mm` other times. Not sure why but worth knowing about since it could also cause wrong dates to get submitted if day and month values are different.

## Workaround
In my automated tests I select all the text first before typing (triple-click), which fixes it. But a regular user wouldn't know to do that.
