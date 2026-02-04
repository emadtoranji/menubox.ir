'use client';

import Loading from '@components/Loading/client';
import { useOrder } from '@context/notes/order/useOrder';
import { useT } from '@i18n/client';
import { formatNumber } from '@utils/numbers';
import ItemQuantityButton from './ItemQuantityButton';
import CurrencySpan from './CurrencySpan';
import OptionQuantityButton from './OptionQuantityButton';
import ItemPrice from './ItemPrice';
import OptionPrice from './OptionPrice';

export default function SelectedItemsList({ lng, storeCurrency }) {
  const { state } = useOrder();
  const { t } = useT('store');

  if (state === null) return <Loading />;
  if (!state?.items?.length) return <h3>{t('order-list-empty')}</h3>;

  const currencySpan = <CurrencySpan t={t} storeCurrency={storeCurrency} />;

  return (
    <div className='container-lg mx-auto row row-cols-1 g-2'>
      {state.items.map((item, index) => {
        return (
          <div key={index} className='py-3 border-bottom border-3 text-active'>
            <div className='d-flex align-items-center justify-content-between my-auto'>
              <h4>{item.title}</h4>
              <ItemQuantityButton item={item} />
            </div>

            <ItemPrice lng={lng} item={item} storeCurrency={storeCurrency} />

            <div className='container mx-1 row row-cols-1 g-2 mt-2'>
              {item.options.map((option) => {
                if (option.count <= 0 || !option?.isActive) return undefined;
                return (
                  <div className='my-auto border-top py-2'>
                    <div
                      key={option.id}
                      className='d-flex align-items-center justify-content-between'
                    >
                      <div className='d-flex align-items-baseline gap-1 m-0'>
                        {option.isRequired && (
                          <i className='d-flex align-items-center fs-11 bi bi-asterisk text-danger'></i>
                        )}
                        <div>{option.title}</div>
                        <OptionPrice
                          option={option}
                          lng={lng}
                          storeCurrency={storeCurrency}
                        />
                      </div>
                      <OptionQuantityButton
                        item={item}
                        lng={lng}
                        option={option}
                      />
                    </div>
                  </div>
                );
              })}
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
