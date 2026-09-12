import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { LeavePage } from './pages/LeavePage';

test('Q4 - Apply, verify and cancel leave request', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const leavePage = new LeavePage(page);

  const daysAhead = 200 + Math.floor(Math.random() * 150);
  const leaveDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');
  await loginPage.verifyLoginSuccessful();

  await leavePage.openLeave();
  await leavePage.applyLeave('CAN - Personal', leaveDate, leaveDate);

  await leavePage.openMyLeave();
  await leavePage.verifyLeaveStatus(leaveDate, 'Pending Approval');

  await leavePage.cancelLeave(leaveDate);
  await leavePage.verifyLeaveStatus(leaveDate, 'Cancelled');

  await loginPage.logout();

  await expect(page).toHaveURL(/auth\/login/);
});
