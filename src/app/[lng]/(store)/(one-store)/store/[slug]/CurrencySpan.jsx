export default function CurrencySpan({ t, storeCurrency }) {
  return (
    <span className='small currency-font'>
      {t(`currencies.${storeCurrency}`, storeCurrency || '')}
    </span>
  );
}
