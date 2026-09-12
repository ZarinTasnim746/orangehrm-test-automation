import { Page, expect } from '@playwright/test';

export class AdminPage {
  constructor(private page: Page) {}

  async openAdmin() {
    await this.page.getByRole('link', { name: 'Admin' }).click();

    await expect(
      this.page.getByRole('heading', { name: 'Admin' })
    ).toBeVisible();
  }

  async addUser(username: string, password: string, employeeName: string) {
    await this.page.getByRole('button', { name: 'Add' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);

    await this.page.locator('.oxd-select-text-input').first().click();
    await this.page.getByRole('option', { name: 'ESS' }).click();

    const usernameInput = this.page.locator(
      'input.oxd-input:not([placeholder]):not([type="password"])'
    ).first();
    await usernameInput.fill(username);

    const employeeInput = this.page.getByPlaceholder('Type for hints...');
    await employeeInput.fill(employeeName);

    const employeeOption = this.page
      .getByRole('option')
      .filter({ hasText: employeeName.split(' ')[0] });
    await expect(employeeOption.first()).toBeVisible({ timeout: 10000 });
    await employeeOption.first().click();
    await this.page.waitForTimeout(500);
    await expect(this.page.getByText('Invalid', { exact: true })).toHaveCount(0);

    await this.page.locator('.oxd-select-text-input').last().click();
    await this.page.getByRole('option', { name: 'Enabled' }).click();

    const passwordInputs = this.page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill(password);
    await passwordInputs.nth(1).fill(password);

    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(
      this.page.getByRole('heading', { name: 'User Management' })
    ).toBeVisible({ timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async searchUser(username: string) {
    const usernameInput = this.page
      .getByPlaceholder('Type for hints...')
      .first();

    await usernameInput.fill(username);

    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  private getUserRow(username: string) {
    return this.page
      .getByRole('row')
      .filter({ has: this.page.getByRole('cell', { name: username, exact: true }) });
  }

  async verifyUser(username: string) {
    const row = this.getUserRow(username);
    await expect(row).toHaveCount(1);
    await expect(row).toBeVisible();
  }

  async editUserStatus(username: string, status: 'Enabled' | 'Disabled') {
    const row = this.getUserRow(username);
    await row.locator('button').last().click();
    await expect(
      this.page.locator('.oxd-select-text-input').last()
    ).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(500);

    await this.page
      .locator('.oxd-select-text-input')
      .last()
      .click();
    await this.page.getByRole('option', { name: status }).click();

    await this.page.getByRole('button', { name: 'Save' }).click();
    await expect(
      this.page.getByRole('heading', { name: 'User Management' })
    ).toBeVisible({ timeout: 15000 });
    await this.page.waitForLoadState('domcontentloaded');
  }

  async verifyUserStatus(username: string, status: 'Enabled' | 'Disabled') {
    const row = this.getUserRow(username);
    await expect(row).toContainText(status, { timeout: 10000 });
  }
}
