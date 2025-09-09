import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectors } from '../selectors/common';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertProductPresent() {
    await expect(this.page.locator('body')).toContainText(/Ploom\s*X\s*Advanced/i, { timeout: 10000 });
  }

  async removeItem() {
  const remove_button = this.page.locator(selectors.cart.removeItemButton).nth(2);
  await expect(remove_button).toBeVisible({ timeout: 10000 });
  await remove_button.click();
}

async removeConfirm() {
  const remComfirm = this.page.locator(selectors.cart.removeConfirm).first();
  await expect(remComfirm).toBeVisible({ timeout: 10000 });
  await expect(remComfirm).toBeEnabled({ timeout: 10000 });
  await remComfirm.click();
}

  async assertCartEmpty() {
  const badge_empty = this.page.locator(selectors.cart.countBadge);
  await expect(badge_empty).toBeHidden({ timeout: 10000 });
}
}
