import { MAX_PASSWORD_LENGTH } from './globalSettings';

export function validateStrongPassword(password) {
  password = String(password).trim();
  if (!/[a-z]/.test(password)) {
    return {
      ok: false,
      reason: 'PASSWORD_STRONG_VERIFICATION_LOWERCASE_NOT_FOUND',
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      ok: false,
      reason: 'PASSWORD_STRONG_VERIFICATION_UPPERCASE_NOT_FOUND',
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      ok: false,
      reason: 'PASSWORD_STRONG_VERIFICATION_DIGIT_NOT_FOUND',
    };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return {
      ok: false,
      reason: 'PASSWORD_STRONG_VERIFICATION_SPECIAL_CHAR_NOT_FOUND',
    };
  }
  if (password.length < 8) {
    return {
      ok: false,
      reason: 'PASSWORD_STRONG_VERIFICATION_LENGTH_TOO_SHORT_FOUND',
    };
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return {
      ok: false,
      reason: 'PASSWORD_STRONG_VERIFICATION_LENGTH_TOO_LONG_FOUND',
    };
  }
  return { ok: true };
}
