'use server';

import { auth } from './NextAuth';

export default async function hasSession() {
  try {
    const session = await auth();
    return session?.user?.id &&
      typeof session.user.id === 'string' &&
      String(session.user.id).length
      ? true
      : false;
  } catch (e) {
    return false;
  }
}
