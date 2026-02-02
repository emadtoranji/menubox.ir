import AnimatedPage from '@components/AnimatedPage';
import Form from '../(components)/StoreForm';
import { storeCategories, storeCurrencies } from '@lib/prismaEnums';
import Head from '../(components)/Head';

export default async function Index({ params }) {
  const { lng } = (await params) || {};

  return (
    <AnimatedPage>
      <div className='container'>
        <Head
          lng={lng}
          title='new.title'
          subTitle='new.subtitle'
          hasStore={true}
        />

        <Form
          storeCategories={storeCategories}
          storeCurrencies={storeCurrencies}
        />
      </div>
    </AnimatedPage>
  );
}
