'use client';

import { useT } from '@i18n/client';
import { freeSpanComponent } from './FreeSpan';
import { formatNumber } from '@utils/numbers';
import { useOrder } from '@context/notes/order/useOrder';
import Loading from '@components/Loading/client';

export default function ItemOption({
  lng,
  options = [],
  itemId = null,
  isOrderable = true,
}) {
  const { t } = useT('store');
  const { state, updateOption } = useOrder();

  if (state === null) return <Loading />;

  if (!itemId) return null;
  if (!options.length) return null;

  const additionalClass = 'm-auto fs-7';
  const freeSpan = freeSpanComponent({ t, additionalClass });

  const orderItem = (state?.items || []).find((i) => i.id === itemId);
  const optionCounts = {};
  orderItem?.options?.forEach((o) => {
    optionCounts[o.id] = o.count ?? o.minSelect ?? 0;
  });

  const currentOptions = orderItem?.options || [];

  function handleOptionSelect({ optionId, minSelect, maxSelect, change }) {
    const currentCount = optionCounts[optionId] ?? minSelect;
    const nextCount = Math.min(
      maxSelect,
      Math.max(minSelect, currentCount + change),
    );

    const optionToUpdate = orderItem.options.find((o) => o.id === optionId);
    if (!optionToUpdate) return;

    updateOption(itemId, { ...optionToUpdate, count: nextCount });
  }

  return (
    <div className='border-top mt-2 pt-2 w-100 row row-cols-1 g-1 px-1'>
      {currentOptions.map((option) => {
        if (!option?.title) return null;
        const optionId = option.id;
        const count = optionCounts?.[optionId] ?? option.minSelect ?? 0;
        const isOrderableOption = isOrderable
          ? (option?.isActive ?? true)
          : false;
        const minSelect = option.minSelect ?? 0;
        const maxSelect = option.maxSelect ?? 1;

        const atMin = count <= minSelect;
        const atMax = count >= maxSelect;
        const isSimpleAdd =
          (minSelect === 0 || minSelect === 1) && maxSelect === 1;
        const isRequiredAndIsSimple = option.isRequired && isSimpleAdd;

        const priceSection = !isNaN(option.priceChangePercent) ? (
          option.priceChangePercent === 0 ? (
            <span className={additionalClass}>
              (<span>{freeSpan}</span>)
            </span>
          ) : (
            <bdi dir='ltr' className={`${additionalClass} fw-bolder`}>
              ({option.priceChangePercent > 0 ? '+' : ''}
              {formatNumber(option.priceChangePercent, lng)}
              {t('general.percent')})
            </bdi>
          )
        ) : null;

        return (
          <div
            key={`item-option-${optionId}`}
            className='d-flex align-items-center justify-content-between'
          >
            <h6 className='d-flex align-items-baseline gap-1 m-0'>
              {option.isRequired && (
                <i className='d-flex align-items-center fs-10 bi bi-asterisk text-danger'></i>
              )}
              <span>{option.title}</span>
              {priceSection}
            </h6>

            {!isOrderableOption ? (
              <button type='button' className='btn btn-danger btn-sm' disabled>
                {t('is-not-active')}
              </button>
            ) : isRequiredAndIsSimple ? (
              <button
                type='button'
                className='d-flex gap-1 align-items-center btn btn-active btn-sm'
                disabled
              >
                <i className='d-flex align-items-center bi bi-check2-circle'></i>
                <span>{t('is-required')}</span>
              </button>
            ) : isSimpleAdd && count === 0 ? (
              <button
                type='button'
                className='d-flex gap-1 btn btn-active btn-sm'
                onClick={() =>
                  handleOptionSelect({
                    optionId,
                    minSelect,
                    maxSelect,
                    change: 1,
                  })
                }
              >
                <i className='d-flex align-items-center bi bi-plus-lg'></i>
                <span>{t('add-option')}</span>
              </button>
            ) : isSimpleAdd && count === 1 ? (
              <button
                type='button'
                className='d-flex gap-1 btn btn-danger btn-sm'
                onClick={() =>
                  handleOptionSelect({
                    optionId,
                    minSelect,
                    maxSelect,
                    change: -1,
                  })
                }
              >
                <i className='d-flex align-items-center bi bi-trash3'></i>
                <span>{t('remove-option')}</span>
              </button>
            ) : (
              <div className='d-flex align-items-center gap-1 rounded border border-dark'>
                <button
                  type='button'
                  className='rounded border border-light btn btn-sm'
                  disabled={atMax}
                  onClick={() =>
                    handleOptionSelect({
                      optionId,
                      minSelect,
                      maxSelect,
                      change: 1,
                    })
                  }
                >
                  +
                </button>

                <span className='small fw-bold border-start border-end px-3'>
                  {formatNumber(count, lng)}
                </span>

                <button
                  type='button'
                  className='rounded border border-light btn btn-sm'
                  disabled={atMin}
                  onClick={() =>
                    handleOptionSelect({
                      optionId,
                      minSelect,
                      maxSelect,
                      change: -1,
                    })
                  }
                >
                  -
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
