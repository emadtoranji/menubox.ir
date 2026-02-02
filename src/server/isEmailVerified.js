import prisma from '@lib/prisma';
import { toBoolean } from '@utils/sanitizer';

export async function isEmailVerified(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { emailVerified: true },
  });

  return toBoolean(user?.emailVerified);
}
