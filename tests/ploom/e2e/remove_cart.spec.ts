import { test } from '../websites/fixtures/test_fixtures';

const SKU = 'ploom-x-advanced';

test('@remove product from cart and verify count', async ({ home, shop, pdp, cart }) => {
  // adding a product to the cart before removing it
  await home.openHome();
  await shop.openFromNav();
  await shop.openProductPDPBySku(SKU);
  await pdp.addToCart();
  await pdp.getBasketCount(1);
  await pdp.openBasket();
  await cart.assertProductPresent();
  await cart.removeItem();
  await cart.removeConfirm();
  await cart.assertCartEmpty();
});
