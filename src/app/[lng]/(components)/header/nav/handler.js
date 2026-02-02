export function nav_default({ t, currentLang, isLogin = false }) {
  let nav = [];
  nav.push(
    { path: `/${currentLang}`, title: t('nav.home') },
    {
      path: `/${currentLang}/store`,
      title: t('nav.store'),
    },
  );
  if (isLogin) {
    nav.push({
      path: `/${currentLang}/dashboard`,
      title: t('nav.dashboard'),
    });
  } else {
    nav.push({
      id: 'signin',
      path: `/${currentLang}/signin`,
      title: t('nav.signin'),
    });
  }
  return nav;
}

export function signin_default({ t, currentLang }) {
  return [
    {
      id: 'signin',
      path: `/${currentLang}/signin`,
      title: t('nav.signin'),
    },
  ];
}

export function nav_dashboard({
  t,
  currentLang,
  isAdmin = false,
  isLogin = false,
}) {
  let nav = [];
  if (isLogin) {
    nav.push(
      { path: `/${currentLang}/dashboard`, title: t('nav.dashboard') },
      {
        path: `/${currentLang}/dashboard/my-store`,
        title: t('nav.my-store'),
      },
      //{ path: `/${currentLang}/dashboard/finance`, title: t('nav.finance') },
      { path: `/${currentLang}/dashboard/setting`, title: t('nav.setting') },
    );
    if (isAdmin) {
      nav.push({
        id: 'admin',
        path: `/${currentLang}/admin`,
        title: t('nav.admin'),
      });
    }
    nav.push({
      id: 'signout',
      path: `/${currentLang}/signout`,
      title: t('nav.signout'),
    });
  } else {
    nav.push({
      id: 'signin',
      path: `/${currentLang}/signin`,
      title: t('nav.signin'),
    });
  }
  return nav;
}

export function nav_admin({ t, currentLang }) {
  return [
    {
      path: `/${currentLang}/dashboard`,
      title: t('nav.dashboard'),
    },
    {
      path: `/${currentLang}/admin/manage-users`,
      title: t('nav.admin-section.manage-users'),
    },
  ];
}
