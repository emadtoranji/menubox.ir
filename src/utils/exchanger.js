export function currencyExchanger(amount, from, to) {
  try {
    from = String(from).toLowerCase();
    to = String(to).toLowerCase();
    amount = Number(amount);
    if (isNaN(amount)) {
      return false;
    }
    if (from === to) {
      return amount;
    }
    if (from === 'irr' && to === 'irt') {
      return Math.round(amount / 10);
    } else if (from === 'irt' && to === 'irr') {
      return Math.round(amount * 10);
    } else {
      const iranianCurrencies = ['irt', 'irr'];
      const exchangeRates = undefined; // TODO

      if (!exchangeRates?.ok) {
        return false;
      }
      if (iranianCurrencies.includes(from)) {
        const priceRate = exchangeRates?.result?.[to]?.['buy'];
        if (!priceRate || isNaN(priceRate)) {
          return false;
        } else {
          return Math.round(
            (from === 'irt' ? amount : amount * 10) * priceRate,
          );
        }
      } else if (iranianCurrencies.includes(to)) {
        const priceRate = exchangeRates?.result?.[from]?.['buy'];
        if (!priceRate || isNaN(priceRate)) {
          return false;
        } else {
          return (to === 'irt' ? amount : amount * 10) / priceRate;
        }
      }
    }
  } catch {
    return false;
  }
  return false;
}
