export function replaceInvalidSearchInput(text) {
  if (typeof text !== 'string') return '';
  return text.replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '');
}
