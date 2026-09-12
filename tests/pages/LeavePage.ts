import { Page, Locator, expect } from '@playwright/test';

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

    const balance = await this.selectLeaveTypeWithBalance(leaveType);

    // Structural selector -- resilient to the placeholder's date-format text,
    // which is locale-dependent (observed both "yyyy-mm-dd" and "yyyy-dd-mm").
    const dateInputs = this.page.locator('.oxd-date-input input');
    await dateInputs.first().waitFor({ state: 'visible', timeout: 15000 });

    await dateInputs.nth(0).click({ clickCount: 3 });
    await dateInputs.nth(0).type(await this.formatForField(dateInputs.nth(0), fromDate));

    await dateInputs.nth(1).click({ clickCount: 3 });
    await dateInputs.nth(1).type(await this.formatForField(dateInputs.nth(1), toDate));
    await this.page.waitForTimeout(500);

    // If the available balance can't cover a Full Day, switch Duration to
    // Half Day Morning so the request matches what's actually available.
    if (balance < 1 && balance > 0) {
      const durationSelect = this.page.locator('.oxd-select-text-input').last();
      if (await durationSelect.isVisible().catch(() => false)) {
        await durationSelect.click();
        const halfDay = this.page.getByRole('option', { name: /Half Day Morning/i });
        if (await halfDay.count()) {
          await halfDay.click();
        } else {
          await this.page.keyboard.press('Escape');
        }
      }
    }

    await this.page.locator('label').filter({ hasText: 'Comments' }).click();
    await this.page.waitForTimeout(300);

    await this.page.getByRole('button', { name: 'Apply' }).click();
    await expect(this.page.getByText('Successfully Saved')).toBeVisible({ timeout: 10000 });
    await this.page.waitForTimeout(1000);
  }

  /**
   * Select a leave type that actually has a positive balance, returning that
   * balance. The preferred type is tried first; the full set of configured
   * types (and their balances) on this shared demo account fluctuates, so if
   * the preferred type is unavailable or has a zero balance, the type with
   * the largest available positive balance is used instead.
   */
  private async selectLeaveTypeWithBalance(preferredType: string): Promise<number> {
    await this.page.locator('.oxd-select-text-input').first().click();
    await this.page.waitForTimeout(500);

    const options = await this.page.getByRole('option').allTextContents();
    const candidates = options
      .map((o) => o.trim())
      .filter((o) => o && o !== '-- Select --');

    const ordered = [
      ...candidates.filter((o) => o === preferredType),
      ...candidates.filter((o) => o !== preferredType),
    ];

    let best: { candidate: string; balance: number } | null = null;

    for (const candidate of ordered) {
      await this.page.getByRole('option', { name: candidate, exact: true }).click();
      await this.page.waitForTimeout(500);

      const balanceText = await this.page
        .locator('.orangehrm-leave-balance-text')
        .innerText()
        .catch(() => '0');
      const balance = parseFloat(balanceText) || 0;

      if (balance >= 1) {
        return balance;
      }

      if (balance > 0 && (!best || balance > best.balance)) {
        best = { candidate, balance };
      }

      await this.page.locator('.oxd-select-text-input').first().click();
      await this.page.waitForTimeout(300);
    }

    if (best) {
      await this.page.getByRole('option', { name: best.candidate, exact: true }).click();
      await this.page.waitForTimeout(500);
      return best.balance;
    }

    throw new Error('No leave type with a positive balance is available to apply for.');
  }

  /**
   * The date field's expected input order is locale-dependent (its
   * placeholder has been observed as both "yyyy-mm-dd" and "yyyy-dd-mm").
   * Re-order the given ISO (yyyy-mm-dd) date to match whatever order this
   * specific field actually expects, so day/month are never silently
   * swapped into a different (but still valid) date.
   */
  private async formatForField(field: Locator, isoDate: string): Promise<string> {
    const placeholder = (await field.getAttribute('placeholder')) || 'yyyy-mm-dd';
    const [year, month, day] = isoDate.split('-');

    if (placeholder.toLowerCase() === 'yyyy-dd-mm') {
      return `${year}-${day}-${month}`;
    }
    return `${year}-${month}-${day}`;
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
