import ResetForm from './ResetForm';
import CheckToken from './CheckToken';
import hasSession from '@utils/auth/hasSession';

export const generateMetadata = (props) =>
  import('@utils/metadata').then((m) =>
    m.generateMetadata(props, {
      forcedPage: 'reset-password',
      robotsFollow: false,
      robotsIndex: false,
    }),
  );

export default async function ResetPassword({ params, searchParams }) {
  const { lng } = await params;
  const hasAccess = await hasSession();

  const { token = undefined } = await searchParams;

  return (
    <div className='container col-12 col-md-8 col-lg-7 col-xl-6 col-xxl-5 '>
      <div className='d-flex align-items-center justify-content-center card border-0 shadow mt-5 px-2 py-5'>
        {token ? (
          <CheckToken currentLang={lng} token={token} />
        ) : (
          <ResetForm hasAccess={hasAccess} currentLang={lng} />
        )}
      </div>
    </div>
  );
}
