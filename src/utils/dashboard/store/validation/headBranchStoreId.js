//import prisma from '@lib/prisma';

export default function Validate(headBranchStoreId) {
  if (!headBranchStoreId) {
    return 'INVALID_INPUT';
  }
  // else {
  //   if (userId) {
  //     const isHeadStoreExists = await prisma.store.findUnique({
  //       select: { id: true },
  //       where: { id: headBranchStoreId, userId },
  //     });
  //     if (!isHeadStoreExists?.id) {
  //       return 'HEAD_BRANCH_NOT_FOUND';
  //     }
  //   } else {
  //     return 'INVALID_INPUT';
  //   }
  // }

  return false;
}
