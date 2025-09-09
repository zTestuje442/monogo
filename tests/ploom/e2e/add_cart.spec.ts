import { test } from '../websites/fixtures/test_fixtures';

const SKU = 'ploom-x-advanced';

test('@add product to cart', async ({ home, shop, pdp, cart }) => {
  await home.openHome();
  await shop.openFromNav();
  await shop.openProductPDPBySku(SKU);
  await pdp.addToCart();
  await pdp.getBasketCount(1);
  await pdp.openBasket();
  await cart.assertProductPresent();
});
