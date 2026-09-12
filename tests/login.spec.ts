import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test('Q1 - Login with invalid username and password', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();

  await page.getByPlaceholder('Username').fill('invalid_user');
  await page.getByPlaceholder('Password').fill('invalid_password');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByText('Invalid credentials')).toBeVisible();
});
