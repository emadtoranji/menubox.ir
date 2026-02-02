export const slugChars = 'a-zA-Z0-9-_';

export function isValidSlug(text) {
  const regex = new RegExp(`^[${slugChars}]{4,}$`);
  return regex.test(text);
}
