import prisma from '@lib/prisma';

export async function isSlugTaken(slug) {
  try {
    const exists = await prisma.store.findFirst({
      where: {
        slug,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (exists?.id) {
      return {
        ok: true,
        result: {
          isTaken: true,
          id: exists?.id,
          userId: exists?.userId,
        },
        status: 200,
      };
    }
    return {
      ok: true,
      result: { isTaken: false },
      status: 200,
    };
  } catch (e) {
    return {
      ok: false,
      status: 500,
      devMessage: 'APSIST: ' + e.message,
    };
  }
}
