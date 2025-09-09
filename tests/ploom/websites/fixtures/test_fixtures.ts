import { test as base } from '@playwright/test';
import { markets, type Market } from '../config/markets';
import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { PDP } from '../pages/PDP';
import { CartPage } from '../pages/CartPage';

type Fixtures = {
  market: Market;
  home: HomePage;
  shop: ShopPage;
  pdp: PDP;
  cart: CartPage;
};

export const test = base.extend<Fixtures>({
  market: async ({ baseURL, page }, use) => {
    const raw = baseURL ?? (await page.url());
    const host = new URL(raw).host.toLowerCase();
    const market: Market = host.includes('ploom.pl') ? 'pl' : 'uk';
    await use(market);
  },
  home: async ({ page }, use) => { await use(new HomePage(page)); },
  shop: async ({ page }, use) => { await use(new ShopPage(page)); },
  pdp: async ({ page }, use) => { await use(new PDP(page)); },
  cart: async ({ page }, use) => { await use(new CartPage(page)); },
});

export const expect = test.expect;
