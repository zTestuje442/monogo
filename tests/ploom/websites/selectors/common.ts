export const selectors = {
  cookie: {
    acceptButton: '#onetrust-accept-btn-handler',
  },

 nav: {
    // UK: 
    shopLinkUK: 'a[data-testid="headerItem-0"][href*="/en/shop"]',
    // PL:
    shopLinkPL: 'a[title="Sklep"][href*="/pl/sklep"]',
  },

  productGrid: {
    productTileBySku: (sku: string) => `[data-sku="${sku}"]`,
  },

  pdp: {
    addToCartButton:
      '[data-testid="pdpAddToProduct"]',
    basketOpenButton:
      '[data-test="open-basket"], a[aria-label*="Cart"], a[aria-label*="Koszyk"], a[href*="basket"], a[href*="cart"]',
  },

  cart: {
    countBadge: 'span.CartIcon-module-label-qGXlU',
    chekout: '[data-testid="miniCartCheckoutButton"]',
    cartItems: '[data-test="cart-item"], li[data-test="cart-item"], .cart-item',
    removeItemButton: 'span.Button-module-content-ZY6ar',
    removeConfirm: '[data-testid="remove-item-submit-button"]',
    
    
  },
} as const;
