import { getT } from '@i18n/server';
import Problems from '@components/Problems';
import Main from '@components/Main';
import Header from '../(components)/header';

export async function generateMetadata(props) {
  const m = await import('@utils/metadata');
  return m.generateMetadata(props, {
    forcedPage: 'not-found',
    robotsFollow: false,
    robotsIndex: false,
  });
}

export default async function Rest({ params }) {
  const { lng } = (await params) || {};
  const { t, lng: currentLang } = await getT(lng, 'error');
  const { t: HFt } = await getT(currentLang, 'header-footer');

  const content = {
    title: t('notFound.title'),
    button: t('notFound.button'),
  };
  return (
    <>
      <Header t={HFt} currentLang={currentLang} section='not-found' />
      <Main>
        <Problems content={content} code={404} currentLang={currentLang} />
      </Main>
    </>
  );
}
