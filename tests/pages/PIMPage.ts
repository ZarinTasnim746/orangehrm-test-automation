import { Page, expect } from '@playwright/test';

export class PIMPage {
  constructor(private page: Page) {}

  async openPIM() {
    await this.page.getByRole('link', { name: 'PIM' }).click();
    await this.page.waitForLoadState('domcontentloaded');

    await expect(
      this.page.getByRole('heading', { name: 'PIM' })
    ).toBeVisible();
  }

  async addEmployee(firstName: string, lastName: string) {
    await this.page.getByRole('link', { name: 'Add Employee' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);

    await this.page.getByPlaceholder('First Name').fill(firstName);
    await this.page.getByPlaceholder('Last Name').fill(lastName);

    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  async searchEmployee(firstName: string, lastName: string) {
    await this.page.getByRole('link', { name: 'Employee List' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    const employeeSearchField = this.page
      .getByPlaceholder('Type for hints...')
      .first();

    await employeeSearchField.fill(firstName);
    await this.page.waitForTimeout(1000);

    const searchButton = this.page.getByRole('button', { name: 'Search' });
    await searchButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  async verifyEmployee(firstName: string, lastName: string) {
    await this.page.waitForTimeout(500);

    const row = this.page
      .getByRole('row')
      .filter({ hasText: firstName })
      .filter({ hasText: lastName });

    await expect(row).toBeVisible({ timeout: 10000 });
  }
}