import { test } from '../websites/fixtures/test_fixtures';

const SKU = 'ploom-x-advanced';

test('@PDP no broken links or images', async ({ home, shop, pdp }) => {
  await home.openHome();
  await shop.openFromNav();
  await shop.openProductPDPBySku(SKU);

  await pdp.verifyAllLinks();
  await pdp.verifyAllImages();
});
