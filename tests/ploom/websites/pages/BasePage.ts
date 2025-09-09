import { Page, expect, Locator } from '@playwright/test';
import { selectors } from '../selectors/common';
import { navI18n } from '../i18n/nav';

export class BasePage {
  constructor(protected page: Page) {}

  async open(path: string = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  

async acceptCookiesIfShown() {
  const btn = this.page.locator('#onetrust-accept-btn-handler');
  await btn.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  if (await btn.isVisible().catch(() => false)) {
    await btn.click().catch(() => void 0);
    await this.page.waitForTimeout(150).catch(() => {});
  }
}


  protected async currentMarket(): Promise<'pl' | 'uk'> {
  const url = new URL(await this.page.url());
  return url.host.includes('ploom.pl') ? 'pl' : 'uk';
}

  async passAgeGateIfShown() {
  if (this.page.isClosed && this.page.isClosed()) return;

  const market = await this.currentMarket();

  const ageGateTexts: Record<'pl' | 'uk', string> = {
    pl: 'Potwierdź',
    uk: 'Yes, discover more',
  };

  const confirmSpan = this.page.locator('button', { hasText: ageGateTexts[market] }).first();
  const confirmButton = confirmSpan.locator('xpath=..');

  try {
    await confirmButton.waitFor({ state: 'visible', timeout: 10000 });

    if (this.page.isClosed && this.page.isClosed()) return;

    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click({ force: true }).catch(() => {});
      await this.page.waitForTimeout(300).catch(() => {});
    }
  } catch (err: any) {
    if (
      err.message?.includes('Target page, context or browser has been closed') ||
      (this.page.isClosed && this.page.isClosed())
    )
      return;
    throw err;
  }
};

 async clickShopFromNav() {
  const market = await this.currentMarket();


  const byRole = this.page.getByRole('link', { name: market === 'uk' ? /^Shop$/i : /^Sklep$/i }).first(); 
  const byTestId = this.page.getByTestId('headerItem-0').filter({ hasText: market === 'uk' ? /^Shop$/i : /^Sklep$/i }).first();
  const byCommons = this.page.locator(market === 'uk' ? selectors.nav.shopLinkUK : selectors.nav.shopLinkPL).first(); 
  const byHref = this.page.locator(market === 'uk' ? 'a[href*="/en/shop"]' : 'a[href*="/pl/sklep"]').first();

  const link =
    (await byRole.count()) ? byRole :
    (await byTestId.count()) ? byTestId :
    (await byCommons.count()) ? byCommons :
    byHref;

  await link.scrollIntoViewIfNeeded(); 
  await this.page.keyboard.press('Escape').catch(() => {});

  const target = market === 'uk' ? /\/en\/shop(\/|$)/i : /\/pl\/sklep(\/|$)/i; 
  await Promise.all([
    this.page.waitForURL(target, { waitUntil: 'domcontentloaded', timeout: 20000 }),
    link.click({ timeout: 10000, force: true })
  ]);
}
}
