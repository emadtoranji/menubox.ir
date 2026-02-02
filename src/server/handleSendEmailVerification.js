import prisma from '@lib/prisma';
import { getT } from '@i18n/server';
import { fallbackLng, languages } from '@i18n/settings';
import sendMail from '@server/email';
import { generateHtmlEmailSingleButtons } from '@utils/generateHtmlEmailSingleButtons';
import { BaseUrlAddress } from '@utils/globalSettings';
import {
  generateVerifyToken,
  hourToSecond,
  numberToFarsi,
} from '@utils/numbers';

export const handleSendEmailVerification = async (email, language = 'en') => {
  const token = generateVerifyToken();

  language = String(language).toLowerCase();
  if (!languages.includes(language)) {
    language = fallbackLng;
  }

  const { t, lng: currentLang } = await getT(language, 'general');
  const { t: tVerifyEmail } = await getT(currentLang, 'verify-email');

  const AppName = t('general.app-name');
  const verifyUrl = `${BaseUrlAddress}${currentLang}/verify-email?token=${token}`;

  try {
    const expires = new Date(Date.now() + hourToSecond(3) * 1000);

    await prisma.verificationToken.upsert({
      where: {
        identifier: email,
      },
      create: {
        identifier: email,
        token,
        expires,
      },
      update: {
        token,
        expires,
      },
    });
  } catch (e) {
    return {
      ok: false,
      status: 500,
      message: 'DATABASE_ERROR',
      devMessage: e?.message,
    };
  }

  let sent = { ok: false };

  const dateYear = numberToFarsi(new Date().getFullYear(), currentLang);
  const subject = tVerifyEmail('html.subject');

  const finalHTML = generateHtmlEmailSingleButtons({
    language: currentLang,
    subject,
    message: tVerifyEmail('html.description'),
    buttonTitle: tVerifyEmail('html.button-title'),
    buttonUrl: verifyUrl,
    note: tVerifyEmail('html.expire-time'),
    footer: tVerifyEmail('html.if-its-not-you'),
    signature: `${AppName} © ${dateYear}`,
  });

  try {
    sent = await sendMail({
      displayName: AppName,
      to: email,
      subject,
      html: finalHTML,
    });
  } catch (e) {
    return {
      ok: false,
      status: 500,
      message: 'SEND_EMAIL_FAILED',
      devMessage: e?.message || null,
    };
  }

  if (sent.ok === true) {
    return { ok: true, status: 200, message: 'SEND_EMAIL_SUCCESS' };
  }

  return {
    ok: false,
    status: 500,
    message: sent?.message || 'SEND_EMAIL_FAILED',
    devMessage: sent?.devMessage,
  };
};
