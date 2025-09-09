export const markets = {
  pl: { code: 'PL', baseURL: 'https://www.ploom.pl/pl', locale: 'pl-PL' },
  uk: { code: 'UK', baseURL: 'https://www.ploom.co.uk/en', locale: 'en-GB' },
} as const;
export type Market = keyof typeof markets;

