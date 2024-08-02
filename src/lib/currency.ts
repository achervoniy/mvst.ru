export function transformPrice(price?: number, currency?: string) {
  const config: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  if (!currency) {
    config.style = 'currency';
    config.currency = 'RUB';
  }

  const formatted = (price ?? 0).toLocaleString('ru-RU', config);

  return currency ? `${formatted} ${currency}` : formatted;
}
