import { auth } from '@utils/auth/NextAuth';
import Navigation from './nav';

export default async function Header({ t, currentLang, section = 'default' }) {
  const session = await auth();
  const userId = session?.user?.id;
  const accessibility = session?.user?.accessibility;

  return (
    <header>
      <Navigation
        t={t}
        currentLang={currentLang}
        section={section}
        userId={userId}
        accessibility={accessibility}
      />
    </header>
  );
}
