import { Page, expect } from '@playwright/test';

export class LeavePage {
  constructor(private page: Page) {}

  async openLeave() {
    await this.page.getByRole('link', { name: 'Leave' }).click();
    await expect(
      this.page.getByRole('heading', { name: 'Leave', exact: true })
    ).toBeVisible();
  }

  async applyLeave(leaveType: string, fromDate: string, toDate: string) {
    await this.page.getByRole('link', { name: 'Apply' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);

    await this.page.locator('.oxd-select-text-input').first().click();
    await this.page.getByRole('option', { name: leaveType, exact: true }).click();

    const dateInputs = this.page.locator('input[placeholder="yyyy-mm-dd"]');

    await dateInputs.nth(0).click({ clickCount: 3 });
    await dateInputs.nth(0).type(fromDate);

    await dateInputs.nth(1).click({ clickCount: 3 });
    await dateInputs.nth(1).type(toDate);

    await this.page.locator('label').filter({ hasText: 'Comments' }).click();
    await this.page.waitForTimeout(300);

    await this.page.getByRole('button', { name: 'Apply' }).click();
    await expect(this.page.getByText('Successfully Saved')).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  async openMyLeave() {
    await this.page.getByRole('link', { name: 'My Leave' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1500);
  }

  private getLeaveRow(dateText: string) {
    return this.page.getByRole('row').filter({ hasText: dateText });
  }

  async verifyLeaveStatus(dateText: string, status: string) {
    const row = this.getLeaveRow(dateText);
    await expect(row).toContainText(status, { timeout: 10000 });
  }

  async cancelLeave(dateText: string) {
    const row = this.getLeaveRow(dateText);
    await row.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(1500);
  }
}
