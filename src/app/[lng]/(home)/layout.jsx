import Main from '@components/Main';
import Footer from '../(components)/footer';
import { getT } from '@i18n/server';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return m.generateMetadata(props, { forcedPage: 'home' });
}

export default async function Layout({ children, params }) {
  const { lng } = (await params) || { lng: null };
  const { t, lng: currentLang } = await getT(lng, 'header-footer');
  return (
    <>
      <Main>{children}</Main>
      <Footer t={t} currentLang={currentLang} />
    </>
  );
}
