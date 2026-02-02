import Image from 'next/image';
import Link from 'next/link';
import {
  nav_admin,
  nav_dashboard,
  nav_default,
  signin_default,
} from './handler';
import ActivePage from './ActivePage';

export default function Navigation({
  t,
  currentLang,
  section = 'default',
  userId = undefined,
  accessibility = 'user',
}) {
  let customNav = undefined;
  const isLogin = typeof userId === 'string' && userId;

  if (section === 'admin') {
    if (userId) {
      customNav = nav_admin({ t, currentLang });
    } else {
      if (['admin', 'developer'].includes(accessibility)) {
        customNav = signin_default({ t, currentLang });
      }
    }
  } else if (section === 'dashboard') {
    customNav = nav_dashboard({
      t,
      currentLang,
      isAdmin: ['admin', 'developer'].includes(accessibility),
      isLogin,
    });
  }

  if (!customNav) {
    if (userId) {
      customNav = nav_dashboard({
        t,
        currentLang,
        isAdmin: ['admin', 'developer'].includes(accessibility),
        isLogin,
      });
    } else {
      customNav = nav_default({ t, currentLang, isLogin });
    }
  }

  if (!Array.isArray(customNav) || !customNav) {
    return null;
  }

  return (
    <nav className='navbar navbar-expand-lg navbar-dark shadow-lg text-light'>
      <div className='container'>
        <div>
          <button
            className='navbar-toggler mb-1'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarNav'
          >
            <span className='visually-hidden'>Navbar</span>
            <span className='navbar-toggler-icon small'></span>
          </button>

          <div className='collapse navbar-collapse' id='navbarNav'>
            <ul className='navbar-nav fs-6'>
              {customNav.map((nav, index) => {
                return <ActivePage key={index} nav={nav} />;
              })}
            </ul>
          </div>
        </div>
        <div className='align-self-start'>
          <Link className='navbar-brand fw-bold' href={`/${currentLang}`}>
            <Image
              src={'/images/icons/512/app-logo.webp'}
              alt={'API Developers Logo'}
              width={50}
              height={50}
              loading={'eager'}
              className='d-inline-block align-middle mx-2'
            />
            <h6 className='d-inline-block my-auto company-name'>
              {t('general.app-name')}
            </h6>
          </Link>
        </div>
      </div>
    </nav>
  );
}
