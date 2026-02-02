import prisma from '@lib/prisma';
import {
  HandleResponse,
  methodAuthenticationRequiredResponse,
  methodFailedOnTryResponse,
  methodNotAllowedResponse,
} from '@api/route';
import { auth } from '@utils/auth/NextAuth';
import { withRateLimit } from '@utils/rateLimit';
import { isValidUsername } from '@utils/validateUsername';
import { isUsernameTaken } from '@server/dashboard/isUsernameTaken';

const limited = withRateLimit({
  max: 3,
  windowMs: 600_000,
});

export const GET = async () => {
  return HandleResponse(methodNotAllowedResponse);
};

export const POST = limited(async (req) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return HandleResponse(methodAuthenticationRequiredResponse);

  const body = await req.json();

  const newUsername = body.username;
  const newUsernameIsValid = isValidUsername(body.username);

  if (!newUsername || !newUsernameIsValid) {
    return HandleResponse({
      ok: false,
      message: 'INVALID_USERNAME',
      status: 400,
    });
  }

  const resultIsTaken = await isUsernameTaken(newUsername, userId);
  if (resultIsTaken) {
    return HandleResponse({
      ok: false,
      message: 'USERNAME_ALREADY_EXISTS',
      status: 400,
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });

    return HandleResponse({
      ok: true,
      result: { username: updatedUser.username },
      status: 200,
    });
  } catch (e) {
    return HandleResponse({
      ...methodFailedOnTryResponse,
      devMessage: 'ADUU1',
    });
  }
});
