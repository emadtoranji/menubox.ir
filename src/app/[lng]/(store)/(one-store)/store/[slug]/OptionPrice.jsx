import { formatNumber } from '@utils/numbers';
import CurrencySpan from './CurrencySpan';
import { useT } from '@i18n/client';
import { freeSpanComponent } from './FreeSpan';

export default function OptionPrice({ lng, option, storeCurrency }) {
  const { t } = useT('store');
  const additionalClass = 'm-auto fs-7 fw-bolder';
  const currencySpan = <CurrencySpan t={t} storeCurrency={storeCurrency} />;
  const freeSpan = freeSpanComponent({ t, additionalClass });

  return !isNaN(option.price) ? (
    option.price === 0 ? (
      <span className={additionalClass}>
        (<span>{freeSpan}</span>)
      </span>
    ) : (
      <div className={`d-flex align-items-center ${additionalClass} `}>
        <span>(</span>
        <span className='d-flex align-items-center gap-1'>
          <span>{formatNumber(option.price, lng)}</span>
          {currencySpan}
        </span>
        <span>)</span>
      </div>
    )
  ) : null;
}
