import { useT } from '@i18n/client';
import { freeSpanComponent } from './FreeSpan';
import { formatNumber } from '@utils/numbers';
import CurrencySpan from './CurrencySpan';

export default function ItemPrice({ lng, item, storeCurrency }) {
  const { t } = useT('store');
  const freeSpan = freeSpanComponent({
    t,
    additionalClass: 'text-success small',
  });
  const currencySpan = <CurrencySpan t={t} storeCurrency={storeCurrency} />;
  const discontedPrice = item.price - (item.price * item.discountPercent) / 100;
  return (
    <div>
      <h6
        className={`m-auto d-flex align-items-center gap-1 mt-3 mb-1 ${
          item.price > 0 && item.discountPercent
            ? 'text-decoration-line-through h6 fw-light'
            : 'h4 fw-bold'
        }`}
      >
        {item.price === 0 ? (
          freeSpan
        ) : (
          <>
            <span>{formatNumber(item.price, lng)}</span>
            {currencySpan}
          </>
        )}
      </h6>

      {item.discountPercent ? (
        <h6 className='fw-bold fs-5 m-auto d-flex align-items-center gap-1'>
          {discontedPrice === 0 ? (
            freeSpan
          ) : (
            <>
              <span>{formatNumber(discontedPrice, lng)}</span>
              {currencySpan}
            </>
          )}
        </h6>
      ) : null}
    </div>
  );
}
