import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';

test('Q3 - Search, edit and verify user in Admin', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const adminPage = new AdminPage(page);

  const username = `TestUser${Date.now()}`;
  const password = 'Password123!';

  await loginPage.goto();
  await loginPage.login('Admin', 'admin123');
  await loginPage.verifyLoginSuccessful();

  await adminPage.openAdmin();
  await adminPage.addUser(username, password, 'Bilol Abdurasul');

  await adminPage.searchUser(username);
  await adminPage.verifyUser(username);

  await adminPage.editUserStatus(username, 'Disabled');

  await page.reload();
  await adminPage.searchUser(username);
  await adminPage.verifyUserStatus(username, 'Disabled');

  await loginPage.logout();

  await expect(page).toHaveURL(/auth\/login/);
});
