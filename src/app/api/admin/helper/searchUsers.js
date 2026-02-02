import { methodFailedOnTryResponse } from '@api/route';
import prisma from '@lib/prisma';
import { replaceInvalidSearchInput } from '@utils/replaceInvalidSearchInput';

export default async function searchUsers({ id, query }) {
  let searchLower = undefined;
  if (id) {
    if (typeof id !== 'string') {
      return {
        ...methodFailedOnTryResponse,
        devMessage: 'AAHSU1',
      };
    }
    searchLower = id;
  } else {
    if (typeof query !== 'string') {
      return {
        ...methodFailedOnTryResponse,
        devMessage: 'AAHSU2',
      };
    }
    searchLower = query;
  }

  searchLower = replaceInvalidSearchInput(searchLower).toLowerCase();
  if (!searchLower) {
    return {
      ...methodFailedOnTryResponse,
      devMessage: 'AAHSU3',
    };
  }

  try {
    const result = await prisma.user.findMany({
      take: 100,
      select: {
        id: true,
        email: true,
        emailVerified: true,
        username: true,
        balance: true,
        accessibility: true,
        status: true,
        createdAt: true,
        lastLogin: true,
      },
      where: id
        ? { id }
        : {
            OR: [
              { email: { contains: searchLower, mode: 'insensitive' } },
              { username: { contains: searchLower, mode: 'insensitive' } },
            ],
          },
    });

    return {
      ok: true,
      status: 200,
      result,
      message: 'SUCCESS',
    };
  } catch (e) {
    return {
      ...methodFailedOnTryResponse,
      devMessage: 'AAHSU1: ' + e.message,
    };
  }
}
