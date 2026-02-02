import { getT } from '@i18n/server';
import Main from '@components/Main';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return m.generateMetadata(props, { forcedPage: 'store' });
}

export default async function Layout({ children, params }) {
  const { lng } = (await params) || { lng: null };
  const { t, lng: currentLang } = await getT(lng, 'header-footer');
  return (
    <>
      <Main customClass={'store-section mb-5'}>{children}</Main>
    </>
  );
}
