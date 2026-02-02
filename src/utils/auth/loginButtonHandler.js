'use server';

import { signIn } from '@utils/auth/NextAuth';

export async function nextAuthLoginButtonHandler(provider, redirectTo) {
  await signIn(provider, {
    redirectTo,
  });
}
