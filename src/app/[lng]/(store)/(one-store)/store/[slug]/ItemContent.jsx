'use client';

import { useT } from '@i18n/client';
import ItemOption from './ItemOption';
import { useOrder } from '@context/notes/order/useOrder';
import Loading from '@components/Loading/client';
import { OffcanvasButton, OffcanvasWrapper } from '@components/Offcanvas';
import SelectedItemsList from './SelectedItemsList';
import ItemQuantityButton from './ItemQuantityButton';
import ItemPrice from './ItemPrice';
import ItemImage from '@components/ItemImage';
import { useState } from 'react';

export default function ItemContent({
  items = [],
  storeCurrency,
  defaultImage,
}) {
  const { t } = useT('store');
  const { state } = useOrder();
  const [showCanvas, setShowCanvas] = useState(false);

  if (state === null) return <Loading />;

  return (
    <div className='container-fluid'>
      <div
        className='fixed bottom-0 right-0 mx-8 mb-8 rounded'
        style={{ zIndex: 'var(--zindex-offcanvas)' }}
      >
        <OffcanvasButton
          showCanvas={showCanvas}
          setShowCanvas={setShowCanvas}
          btnTitle={t('order-list-button')}
          btnClass='btn-active btn-lg shadow-lg'
        />
      </div>

      <OffcanvasWrapper
        showCanvas={showCanvas}
        setShowCanvas={setShowCanvas}
        title={t('order-list-title')}
        zIndex={'calc(var(--zindex-offcanvas) + 10)'}
      >
        <SelectedItemsList storeCurrency={storeCurrency} />
      </OffcanvasWrapper>

      <div className='container grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-1 lg:gap-2 3xl:gap-3'>
        {(items || []).map((item) => {
          const isOrderable = item?.isAvailable && item?.isActive;

          return (
            <div
              key={`item-${item.id}`}
              style={{ minHeight: '250px' }}
              className={`card bg-white w-full ${isOrderable ? '' : 'opacity-75'}`}
            >
              <div className='card-body flex gap-3'>
                <div className='w-full'>
                  <h3 className='font-bold'>{item.title}</h3>
                  <p className='text-justify px-1'>{item.description}</p>
                </div>
                <div className='w-auto flex items-center justify-center'>
                  <ItemImage
                    key={`logo-${item.category}`}
                    category={item.category}
                    title={item.title}
                    defaultImage={defaultImage}
                  />
                </div>
              </div>

              <div className='border-t border-muted bg-white'>
                <div className='flex items-center justify-between py-1 mt-2'>
                  <ItemPrice item={item} storeCurrency={storeCurrency} />

                  <ItemQuantityButton
                    item={item}
                    isOrderable={isOrderable}
                    storeCurrency={storeCurrency}
                  />
                </div>

                <ItemOption
                  item={item}
                  options={item?.options || []}
                  storeCurrency={storeCurrency}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
