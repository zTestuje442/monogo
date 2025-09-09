import { Page, APIResponse, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectors } from '../selectors/common';

export class PDP extends BasePage {
  constructor(page: Page) {
    super(page);
  }

 async addToCart() {
  const add = this.page.locator(selectors.pdp.addToCartButton).first();
  await expect(add).toBeVisible({ timeout: 10000 });
  await expect(add).toBeEnabled({ timeout: 10000 });
  await add.click();
}

  async getBasketCount(expected: number | string) {
  const badge = this.page.locator(selectors.cart.countBadge).first();
  const value = String(expected);
  await expect(badge).toBeVisible({ timeout: 10000 });
  await expect(badge).toHaveText(value, { timeout: 10000 });
}

  async openBasket() {
  const checkoutBtn = this.page.locator(selectors.cart.chekout).first();
  await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
  await expect(checkoutBtn).toBeEnabled({ timeout: 10000 });
  await checkoutBtn.click();
}

async verifyAllLinks({ sameOriginOnly = true } = {}) {
  const base = new URL(this.page.url()); 
  const hrefs = await this.page.$$eval('a[href]', as =>
    as.map(a => (a as HTMLAnchorElement).getAttribute('href') || '')
  ); 

  const urls = new Set<string>();
  for (const href of hrefs) {
    if (!href) continue;
    if (href.startsWith('#')) continue;
    if (/^(javascript:|mailto:|tel:)/i.test(href)) continue; 
    const u = new URL(href, base);
    if (sameOriginOnly && u.origin !== base.origin) continue; 
    urls.add(u.toString());
  }

  const failures: Array<{ url: string; status: number | null }> = [];
  await Promise.all(
    Array.from(urls).map(async url => {
      const resp = await this.page.request.get(url); 
      const status = resp.status();
      if (status >= 400) failures.push({ url, status }); 
    })
  );

  expect(
    failures,
    failures.length ? `Broken links: ${failures.map(f => `${f.status} ${f.url}`).join(', ')}` : ''
  ).toEqual([]); 
}

async verifyAllImages(options?: {
  scope?: string;             
  onlyVisible?: boolean;      
  triggerLazyLoad?: boolean;  
  perImageTimeoutMs?: number; 
}) {
  const { scope = 'img', onlyVisible = true, triggerLazyLoad = true, perImageTimeoutMs = 1500 } = options ?? {};

  const imgs = this.page.locator(scope); 
  const total = await imgs.count();
  const failures: Array<{ index: number; src: string | null; reason: string }> = [];

  for (let i = 0; i < total; i++) {
    if (this.page.isClosed && this.page.isClosed()) break;
    const img = imgs.nth(i);

    if (onlyVisible) {
      const renderable = await img.evaluate(el => {
        const cs = getComputedStyle(el as HTMLElement);
        const r = (el as HTMLElement).getBoundingClientRect();
        return cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      }).catch(() => false); 
      if (!renderable) continue;
    }

    try {
      if (triggerLazyLoad) {
        await img.scrollIntoViewIfNeeded().catch(() => {}); 
      }

      const ok = await img.evaluate(el => {
        const im = el as HTMLImageElement;
        return !!(im.complete && im.naturalWidth > 0 && im.naturalHeight > 0);
      }); 

      if (!ok) {
        failures.push({ index: i, src: await img.getAttribute('src'), reason: 'not loaded' });
      }
    } catch (e: any) {
      failures.push({ index: i, src: await img.getAttribute('src'), reason: e?.message ?? 'error' });
    }
  }

  expect(
    failures,
    failures.length ? `Broken images: ${failures.map(f => `[${f.index}] ${f.src} (${f.reason})`).join(', ')}` : ''
  ).toEqual([]); 
}
}


