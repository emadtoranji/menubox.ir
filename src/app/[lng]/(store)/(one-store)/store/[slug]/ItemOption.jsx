import { useT } from '@i18n/client';
import { freeSpanComponent } from './FreeSpan';
import { formatNumber } from '@utils/numbers';

export default function ItemOption({ lng, options = {}, isOrderable = true }) {
  const { t } = useT('store');
  if (!options.length) return;
  const additionalClass = 'm-auto fs-7';
  const freeSpan = freeSpanComponent({ t, additionalClass });
  // title: true,
  // isRequired: true,
  // minSelect: true,
  // maxSelect: true,
  // priceChangePercent: true,
  // isActive: true,

  return (
    <div className='border-top mt-2 pt-2 w-100 row row-cols-1 g-1 px-1'>
      {options.map((option, index) => {
        const isOrderableOption = isOrderable ? option?.isActive : false;
        const priceSection = !isNaN(option.priceChangePercent) ? (
          option.priceChangePercent === 0 ? (
            <span className={additionalClass}>
              <span>(</span>
              <span>{freeSpan}</span>
              <span>)</span>
            </span>
          ) : (
            <span dir='ltr' style={{ unicodeBidi: 'isolate' }}>
              <span className={`${additionalClass} fw-bolder`}>
                <span>(</span>
                {option.priceChangePercent >= 0 ? '+' : '-'}
                {formatNumber(option.priceChangePercent, lng)}
                {t('general.percent')}
                <span>)</span>
              </span>
            </span>
          )
        ) : undefined;
        if (!option?.title) return undefined;

        return (
          <div
            className='d-flex align-items-center justify-content-between'
            key={`item-option-${index}`}
          >
            <h6 className='d-flex align-items-baseline gap-1'>
              <span>{option.title}</span>
              <span>{priceSection}</span>
            </h6>

            <button
              type='button'
              className={`d-flex align-items-center gap-1 btn ${isOrderableOption ? 'btn-active' : 'btn-danger'} btn-sm`}
              disabled={!isOrderableOption}
            >
              {isOrderableOption ? (
                <>
                  <i className='d-flex align-items-center bi bi-plus-lg'></i>
                  <span className='d-flex align-items-center small'>
                    {t('add-item')}
                  </span>
                </>
              ) : (
                <span className='text-bg-danger'>{t('is-not-active')}</span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
