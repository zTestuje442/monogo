import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openHome() {
    await this.open('/');
    await this.acceptCookiesIfShown();
    await this.passAgeGateIfShown();
  }
}

