import { fallbackLng } from '@i18n/settings';
import Link from 'next/link';
import Main from './Main';

export default function Problem({
  content,
  code = 404,
  currentLang = fallbackLng,
  message = '',
}) {
  return (
    <Main>
      <div className='container d-flex align-items-center justify-content-center main-vh-100 text-center'>
        <div className=''>
          <div className='mb-3'>
            <div>
              <h1 className='display-1 fw-bold text-muted'>{code}</h1>
            </div>
          </div>
          <div className='mb-5'>
            <div>
              <p className=''>{content.title}</p>
            </div>
          </div>
          <div className='mb-3'>
            <Link
              className='btn rounded btn-secondary text-light fw-bold'
              href={`/${currentLang}`}
            >
              {content.button}
            </Link>
          </div>
          <div className=''>
            {message && code == 500 ? <code>{message}</code> : undefined}
          </div>
        </div>
      </div>
    </Main>
  );
}
