export function formatCurrency(cents: number, currency: string = 'EUR', locale: string = 'de-DE') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
}
