'use client';

import { useT } from '@i18n/client';
import { formatNumber } from '@utils/numbers';
import Image from 'next/image';
import ItemOption from './ItemOption';
import { freeSpanComponent } from './FreeSpan';
import { useOrder } from '@context/notes/order/useOrder';
import Loading from '@components/Loading/client';

export default function ItemContent({
  items = [],
  storeCurrency,
  defaultImage,
}) {
  const { t, i18n } = useT('store');
  const { state, addItem, updateItem, removeItem } = useOrder();

  if (state === null) return <Loading />;

  const lng = i18n.language;
  const freeSpan = freeSpanComponent({ t });
  const currencySpan = (
    <span className='small currency-font'>
      {t(`currencies.${storeCurrency}`, storeCurrency || '')}
    </span>
  );

  function handleAddItem(item) {
    const existingItem = (state?.items || []).find((i) => i.id === item.id);
    if (existingItem) {
      updateItem({
        ...existingItem,
        quantity: (existingItem.quantity || 1) + 1,
      });
    } else {
      const newItem = {
        ...item,
        quantity: 1,
        options: (item.options || []).map((o) => ({
          ...o,
          count: o.minSelect || 0,
        })),
      };
      addItem(newItem);
    }
  }

  function handleRemoveItem(item) {
    const existingItem = (state?.items || []).find((i) => i.id === item.id);
    if (!existingItem) return;

    if ((existingItem.quantity || 1) > 1) {
      updateItem({ ...existingItem, quantity: existingItem.quantity - 1 });
    } else {
      removeItem(item.id);
    }
  }

  return (
    <div className='container-fluid'>
      <div className='row g-1 g-lg-2'>
        {(items || []).map((item) => {
          const discontedPrice =
            item.price - (item.price * item.discountPercent) / 100;
          const isOrderable = item?.isAvailable && item?.isActive;

          const orderItem = (state?.items || []).find((i) => i.id === item.id);
          const quantity = orderItem?.quantity || 0;

          return (
            <div
              key={`item-${item.id}`}
              style={{ minHeight: '250px' }}
              className={`col-12 col-lg-6 col-xxl-4 d-flex ${
                isOrderable ? '' : 'opacity-75'
              }`}
            >
              <div className='card border-0 shadow flex-fill bg-white'>
                <div className='card-body d-flex'>
                  <div className='col px-1'>
                    <h4 className='fw-bold'>{item.title}</h4>
                    <p className='text-justify px-1'>{item.description}</p>
                  </div>
                  <div className='col-auto d-flex align-items-center justify-content-center'>
                    <Image
                      className='rounded'
                      src={item?.imageUrl || defaultImage}
                      alt={item.title}
                      width={100}
                      height={100}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>

                <div className='card-footer bg-white'>
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className=''>
                      <h6
                        className={`m-auto d-flex align-items-center gap-1 ${
                          item.price > 0 && item.discountPercent
                            ? 'text-decoration-line-through fs-7 fw-light'
                            : 'fs-5 fw-bold'
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

                    {quantity === 0 ? (
                      <button
                        type='button'
                        className={`btn btn-sm ${
                          !isOrderable ? 'btn-danger' : 'btn-active'
                        } `}
                        disabled={!isOrderable}
                        onClick={() => handleAddItem(item)}
                      >
                        <span className='d-flex align-items-center gap-1'>
                          {isOrderable ? (
                            <>
                              <i className='d-flex align-items-center bi bi-plus-lg'></i>{' '}
                              <span>{t('add-item')}</span>
                            </>
                          ) : (
                            t('is-not-active')
                          )}
                        </span>
                      </button>
                    ) : (
                      <div className='d-flex align-items-center gap-1'>
                        <button
                          type='button'
                          className={`btn btn-active p-2`}
                          onClick={() => handleAddItem(item)}
                          disabled={!isOrderable}
                        >
                          <i className='d-flex align-items-center bi bi-plus-lg'></i>
                        </button>
                        <span className='px-2 fw-bold'>{quantity}</span>
                        <button
                          type='button'
                          className='btn btn-danger p-2'
                          onClick={() => handleRemoveItem(item)}
                        >
                          <i
                            className={`d-flex align-items-center bi ${quantity === 1 ? 'bi-trash3' : 'bi-dash-lg'}`}
                          ></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <ItemOption
                    lng={lng}
                    itemId={item.id}
                    options={item?.options || []}
                    isOrderable={isOrderable}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
