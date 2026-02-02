export function isValidUsername(text) {
  if (typeof text !== 'string') return false;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{4,}$/;
  return usernameRegex.test(text);
}
