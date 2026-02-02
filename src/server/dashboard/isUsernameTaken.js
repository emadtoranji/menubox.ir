import prisma from '@lib/prisma';

export async function isUsernameTaken(text, exceptUserId) {
  const exists = await prisma.user.findFirst({
    where: {
      username: text,
      id: {
        not: exceptUserId,
      },
    },
    select: {
      id: true,
    },
  });

  if (exists?.id) {
    return true;
  }
  return false;
}
