import StoreNotFound from '../../../StoreNotFound';
import { getStores } from '@server/getStores';
import { getT } from '@i18n/server';
import { cache } from 'react';
import StoreComponent from './StoreComponent';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return m.generateMetadata(props, { forcedPage: 'storeSlug' });
}

const fetchStoreCached = cache(async ({ slug }) => {
  const response = await getStores({ slug });

  if (!response?.ok || !response?.result?.slug) {
    return {};
  }

  return {
    store: response.result,
  };
});

export default async function Page({ params }) {
  const { lng, slug = undefined } = (await params) || {};
  const { t } = await getT(lng, 'store');

  if (!slug) {
    return <StoreNotFound t={t} />;
  }

  const data = await fetchStoreCached({ slug });
  const { store = {} } = data;

  if (!store?.slug) {
    return <StoreNotFound t={t} />;
  }

  return (
    <section className='container-fluid'>
      <StoreComponent store={store} lng={lng} />
    </section>
  );
}
