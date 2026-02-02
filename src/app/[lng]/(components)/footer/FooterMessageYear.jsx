'use client';

import { useT } from '@i18n/client';
import { numberToFarsi } from '@utils/numbers';

export default function FooterMessageYear() {
  const { t, i18n } = useT('header-footer');
  const lng = i18n.language;
  let year;

  if (lng === 'fa') {
    year = new Date().toLocaleDateString('fa-IR-u-ca-persian', {
      year: 'numeric',
    });
  } else {
    year = new Date().getFullYear();
  }
  return (
    <p className='mb-0 small'>
      {t('footer.copy', {
        year: numberToFarsi(year, lng),
      })}
    </p>
  );
  return;
}
