export type Market = 'pl' | 'uk';

// “logiczne” SKU używane w testach:
export type LogicalSku = 'ploom-x-advanced';

// mapowanie na realne data-sku per rynek
const map: Record<Market, Record<LogicalSku, string>> = {
  uk: {
    'ploom-x-advanced': 'ploom-x-advanced', // UK = takie samo jak logiczne
  },
  pl: {
    'ploom-x-advanced': '16355387', // PL = inne ID w data-sku
  },
};

export function resolveSku(market: Market, logicalSku: LogicalSku): string {
  const resolved = map[market]?.[logicalSku];
  if (!resolved) {
    throw new Error(`No SKU mapping for market=${market} logicalSku=${logicalSku}`);
  }
  return resolved;
}
