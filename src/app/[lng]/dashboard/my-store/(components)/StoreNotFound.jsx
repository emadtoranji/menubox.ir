import { fallbackLng } from '@/src/app/i18n/settings';
import { getT } from '@i18n/server';
import Link from 'next/link';

export default async function StoreNotFound({ params }) {
  const { lng = fallbackLng } = (await params) || {};
  const { t } = await getT(lng, 'dashboard-my-store');
  return (
    <div className='container'>
      <div className='d-flex flex-column gap-2 mb-3'>
        <div className='d-flex justify-content-between'>
          <h3>{t('store-not-found')}</h3>
          <Link href={`/${lng}/dashboard/my-store`}>
            <button className='btn btn-success shadow'>{t('my-store')}</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
