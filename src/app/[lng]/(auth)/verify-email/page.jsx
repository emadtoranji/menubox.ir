import { getT } from '@i18n/server';
import Link from 'next/link';

export const generateMetadata = (props) =>
  import('@utils/metadata').then((m) =>
    m.generateMetadata(props, {
      forcedPage: 'verify-email',
      robotsFollow: false,
      robotsIndex: false,
    })
  );

export default async function Index({ params, searchParams }) {
  const { lng } = await params;
  const { t, lng: currentLang } = await getT(lng, 'verify-email');

  const search = await searchParams;
  let token = (await search.token) || null;
  let status = false;

  if (token) {
    const res = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
      }),
    });
    const result = await res.json();
    if (result?.ok) {
      status = true;
    }
  }

  return (
    <>
      <div className='container d-flex justify-content-center h-100 my-auto'>
        <div className='card shadow border-0 mt-5  p-5 rounded lead fw-bolder'>
          <span className={`mb-3 text-${status ? 'success' : 'danger'}`}>
            {status ? t('email-verified') : t('link-expired')}
          </span>

          <Link className='mx-auto' href={`/${currentLang}/dashboard/account`}>
            <button className='btn btn-primary col px-3'>
              {t('button-title')}
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
