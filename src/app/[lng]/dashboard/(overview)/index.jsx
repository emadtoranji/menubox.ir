import { getT } from '@i18n/server';
import AnimatedPage from '@components/AnimatedPage';
import { formatNumber } from '@utils/numbers';
import { redirect } from 'next/navigation';
import { auth } from '@utils/auth/NextAuth';

export default async function Index({ params }) {
  const { lng } = (await params) || {};
  const { t, lng: currentLang } = await getT(lng, 'dashboard');

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect(`/${lng}/signout`);
  }

  let storeExplorerStatsData = {};
  const periods = [
    {
      name: 'today',
      where: {
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    },
    {
      name: 'yesterday',
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 1)),
          lt: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    },
    {
      name: 'current_month',
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    {
      name: 'previous_month',
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    },
    {
      name: 'current_year',
      where: {
        createdAt: { gte: new Date(new Date().getFullYear(), 0, 1) },
      },
    },
    {
      name: 'previous_year',
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear() - 1, 0, 1),
          lt: new Date(new Date().getFullYear(), 0, 1),
        },
      },
    },
    { name: 'all', where: {} },
  ];

  for (const period of periods) {
    const result = await prisma.storeExplorerLog.aggregate({
      _count: { _all: true },
      where: { userId, ...period.where },
    });

    storeExplorerStatsData[period.name] = {
      count: result._count._all || 0,
    };
  }

  return (
    <AnimatedPage>
      <div className='container'>
        <div className='d-flex flex-column gap-2 mb-3'>
          <h3>{t('dashboard.overview.title')}</h3>
          <div className='muted-small'>{t('dashboard.overview.subtitle')}</div>
        </div>
        <>
          <div className='row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-3 mb-4'>
            {[
              { key: 'today', label: t('dashboard.stats.today') },
              { key: 'yesterday', label: t('dashboard.stats.yesterday') },
              {
                key: 'current_month',
                label: t('dashboard.stats.currentMonth'),
              },
              {
                key: 'previous_month',
                label: t('dashboard.stats.previousMonth'),
              },
              { key: 'current_year', label: t('dashboard.stats.currentYear') },
              {
                key: 'previous_year',
                label: t('dashboard.stats.previousYear'),
              },
              { key: 'all', label: t('dashboard.stats.all') },
            ].map(({ key, label }) => (
              <div className='' key={key}>
                <div className='card border-0 shadow rounded p-3'>
                  <div className='muted-small'>{label}</div>
                  <div className='big-number'>
                    {formatNumber(
                      storeExplorerStatsData?.[key]?.count,
                      currentLang,
                    ) || '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      </div>
    </AnimatedPage>
  );
}
