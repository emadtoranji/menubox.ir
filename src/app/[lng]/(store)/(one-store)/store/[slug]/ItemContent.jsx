import { useT } from '@i18n/client';
import { formatNumber } from '@utils/numbers';
import Image from 'next/image';
import ItemOption from './ItemOption';
import { freeSpanComponent } from './FreeSpan';

export default function ItemContent({
  items = {},
  storeCurrency,
  defaultImage,
}) {
  const { t, i18n } = useT('store');
  const lng = i18n.language;
  const freeSpan = freeSpanComponent({ t });
  const currencySpan = (
    <span className='small currency-font'>
      {t(`currencies.${storeCurrency}`, storeCurrency || '')}
    </span>
  );

  return (
    <div className='container-fluid'>
      <div className='row g-1 g-lg-2'>
        {items.map((item) => {
          const discontedPrice =
            item.price - (item.price * item.discountPercent) / 100;
          const isOrderable = item?.isAvailable && item?.isActive;
          return (
            <div
              key={`item-${item.id}`}
              style={{ minHeight: '250px' }}
              className={`col-12 col-lg-6 col-xxl-4 d-flex ${isOrderable ? '' : 'opacity-75'}`}
            >
              <div className={`card border-0 shadow flex-fill bg-white`}>
                <div className='card-body d-flex'>
                  <div className='col px-1'>
                    <h4 className='fw-bold'>{item.title}</h4>
                    <p className='text-justify px-1'>{item.description}</p>
                  </div>
                  <div className='col-auto d-flex align-items-center jusitfy-content-center'>
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
                        className={`m-auto d-flex align-items-center gap-1 ${item.price > 0 && item.discountPercent ? 'text-decoration-line-through fs-7 fw-light' : 'fs-5 fw-bold'}`}
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
                      ) : undefined}
                    </div>
                    <button
                      type='button'
                      className={`d-flex align-items-center gap-1 btn ${!item?.isActive || !item?.isAvailable ? 'btn-danger' : 'btn-active'} btn-sm`}
                      disabled={!isOrderable}
                    >
                      {isOrderable ? (
                        <>
                          <i className='d-flex align-items-center bi bi-plus-lg'></i>
                          <span className='d-flex align-items-center'>
                            {t('add-item')}
                          </span>
                        </>
                      ) : !item?.isActive ? (
                        <span className='text-bg-danger'>
                          {t('is-not-active')}
                        </span>
                      ) : !item?.isAvailable ? (
                        t('is-not-avaialbe')
                      ) : undefined}
                    </button>
                  </div>
                  <ItemOption
                    lng={lng}
                    options={item?.options || {}}
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
