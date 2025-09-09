import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { selectors } from '../selectors/common';
import { resolveSku, type LogicalSku, type Market } from '../config/skuMap';

export class ShopPage extends BasePage {
  constructor(page: Page, private readonly market?: Market) {
    super(page);
  }

  // Fallback gdy nie wstrzykniesz marketu z fixtures
  private async getMarket(): Promise<Market> {
    if (this.market) return this.market;
    const url = new URL(await this.page.url());
    if (url.host.includes('ploom.pl')) return 'pl';
    return 'uk';
  }

  async openFromNav() {
  await this.clickShopFromNav(); // przejście do listingu [3]

  // Kotwica listingu: pierwszy kafelek produktu
  const firstTile = this.page.locator('[data-sku]').first(); // stabilny anchor [1]
  await firstTile.waitFor({ state: 'visible', timeout: 20000 }); // auto-wait elementu [1]
  await expect(firstTile).toBeVisible({ timeout: 20000 }); // czytelny log asercji [7][8]
}


  async openProductPDPBySku(logicalSku: LogicalSku) {
    const market = await this.getMarket();
    const realSku = resolveSku(market, logicalSku);

    const tile = this.page.locator(selectors.productGrid.productTileBySku(realSku)).first();
    await tile.waitFor({ state: 'visible', timeout: 10000 });
    await tile.click({ trial: true }).catch(() => {});
    await tile.click({ force: true, timeout: 20000 });
  }
}
