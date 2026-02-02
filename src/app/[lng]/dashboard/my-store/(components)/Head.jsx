import { fallbackLng } from '@i18n/settings';
import { getT } from '@i18n/server';
import Link from 'next/link';

export default async function Head({
  lng = fallbackLng,
  title = '',
  subTitle = '',
  id = undefined,
  hasStore = false,
  hasHomeEdit = false,
  hasNew = false,
  hasDelete = false,
}) {
  const { t } = await getT(lng, 'dashboard-my-store');

  if (!id) {
    // id required
    hasHomeEdit = false;
    hasDelete = false;
    // set a minimum true
    if (!hasNew && !hasStore) {
      hasNew = true;
      hasStore = true;
    }
  }

  return (
    <>
      <div className='d-flex align-items-center justify-content-between'>
        <h3>{t(title)}</h3>
        <div className='d-flex gap-1 gap-sm-2 gap-md-3 gap-lg-4'>
          {!hasDelete ? undefined : (
            <Link
              href={`/${lng}/dashboard/my-store/edit/${id}/delete`}
              className='col'
            >
              <i
                type='button'
                className='bi bi-trash3-fill text-danger fs-3'
              ></i>
            </Link>
          )}{' '}
          {!hasNew ? undefined : (
            <Link href={`/${lng}/dashboard/my-store/new`} className='col'>
              <i
                type='button'
                className='bi bi-plus-circle-fill text-success fs-3'
              ></i>
            </Link>
          )}
          {!hasHomeEdit ? undefined : (
            <Link
              href={`/${lng}/dashboard/my-store/edit/${id}`}
              className='col'
            >
              <i
                type='button'
                className='bi bi-pencil-square text-danger-emphasis fs-3'
              ></i>
            </Link>
          )}
          {!hasStore ? undefined : (
            <Link href={`/${lng}/dashboard/my-store`} className='col'>
              <i type='button' className='bi bi-shop text-success fs-3'></i>
            </Link>
          )}
        </div>
      </div>
      <div className='muted-small'>{t(subTitle)}</div>
      <hr />
    </>
  );
}
