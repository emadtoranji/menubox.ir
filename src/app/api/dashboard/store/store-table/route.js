import prisma from '@lib/prisma';
import { auth } from '@utils/auth/NextAuth';
import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { withRateLimit } from '@utils/rateLimit';

const limited = withRateLimit({ max: 10, windowMs: 60_000 });

export const GET = async () => HandleResponse(methodNotAllowedResponse);

export const POST = limited(async (req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

    const body = await req.json();
    const { storeTableId, title, isActive, storeId } = body;

    if (
      !storeId ||
      typeof title !== 'string' ||
      typeof isActive !== 'boolean'
    ) {
      return HandleResponse({
        ok: false,
        status: 400,
        message: 'INVALID_INPUT',
      });
    }

    if (storeTableId) {
      // --- Update existing table ---
      const table = await prisma.storeTable.findUnique({
        where: { id: storeTableId },
      });

      if (!table) {
        return HandleResponse({
          ok: false,
          status: 404,
          message: 'TABLE_NOT_FOUND',
        });
      }

      await prisma.storeTable.update({
        where: { id: storeTableId },
        data: { title, isActive },
      });

      return HandleResponse({
        ok: true,
        status: 200,
        message: 'UPDATED_SUCCESSFULLY',
      });
    } else {
      // --- Create new table ---
      const newTable = await prisma.storeTable.create({
        data: {
          storeId,
          title,
          isActive,
        },
      });

      return HandleResponse({
        ok: true,
        status: 201,
        message: 'CREATED_SUCCESSFULLY',
        result: {
          tableId: newTable.id,
        },
      });
    }
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'STORE_TABLE_UPSERT: ' + e.message,
    });
  }
});

export const DELETE = limited(async (req) => {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

    const body = await req.json();
    const { storeTableId } = body;

    if (!storeTableId)
      return HandleResponse({
        ok: false,
        status: 400,
        message: 'INVALID_INPUT',
      });

    const table = await prisma.storeTable.findUnique({
      where: { id: storeTableId },
    });

    if (!table)
      return HandleResponse({
        ok: false,
        status: 404,
        message: 'TABLE_NOT_FOUND',
      });

    await prisma.storeTable.delete({
      where: { id: storeTableId },
    });

    return HandleResponse({
      ok: true,
      status: 200,
      message: 'DELETED_SUCCESSFULLY',
    });
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'STORE_TABLE_DELETE: ' + e.message,
    });
  }
});
