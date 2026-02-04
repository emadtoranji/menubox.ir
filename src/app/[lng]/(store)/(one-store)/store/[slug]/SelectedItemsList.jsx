'use client';

import Loading from '@components/Loading/client';
import { useOrder } from '@context/notes/order/useOrder';
import { useT } from '@i18n/client';
import { formatNumber } from '@utils/numbers';
import ItemQuantityButton from './ItemQuantityButton';
import CurrencySpan from './CurrencySpan';
import OptionQuantityButton from './OptionQuantityButton';

export default function SelectedItemsList({ lng, storeCurrency }) {
  const { state } = useOrder();
  const { t } = useT('store');

  if (state === null) return <Loading />;
  if (!state?.items?.length) return <h3>{t('order-list-empty')}</h3>;

  const currencySpan = <CurrencySpan t={t} storeCurrency={storeCurrency} />;
  console.log(state.totalPrice);

  return (
    <div className='row row-cols-1 g-2'>
      {state.items.map((item, index) => {
        return (
          <div key={index} className='py-1 border-bottom text-active'>
            <div className='d-flex align-items-center justify-content-between my-auto'>
              <h4>{item.title}</h4>
              <ItemQuantityButton item={item} />
            </div>

            <div className='row row-cols-1 g-2 mt-1'>
              {item.options.map((option) => {
                if (option.count <= 0 || !option?.isActive) return undefined;
                return (
                  <div
                    key={option.id}
                    className='d-flex align-items-center justify-content-between'
                  >
                    <h6>{option.title}</h6>
                    <OptionQuantityButton
                      item={item}
                      lng={lng}
                      option={option}
                    />
                  </div>
                );
              })}
            </div>

            <div className='d-flex align-items-center justify-content-start gap-1 h4 mt-3'>
              <span>{formatNumber(item.price, lng)}</span>
              <span>{currencySpan}</span>
            </div>
          </div>
        );
      })}

      <div className='d-flex align-items-center justify-content-center gap-1 h2 mt-3'>
        <span>{formatNumber(state.totalPrice, lng)}</span>
        <span>{currencySpan}</span>
      </div>
    </div>
  );
}
