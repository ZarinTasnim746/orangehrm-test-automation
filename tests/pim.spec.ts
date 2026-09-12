import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { PIMPage } from './pages/PIMPage';

test('Q2 - Add and search employee in PIM', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const pimPage = new PIMPage(page);

  const firstName = `Test${Date.now()}`;
  const lastName = 'Employee';

  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');
  await loginPage.verifyLoginSuccessful();

  await pimPage.openPIM();
  await pimPage.addEmployee(firstName, lastName);
  await pimPage.searchEmployee(firstName, lastName);
  await pimPage.verifyEmployee(firstName, lastName);

  await loginPage.logout();

  await expect(page).toHaveURL(/auth\/login/);
});
