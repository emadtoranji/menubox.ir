import { slugChars } from '@utils/isValidSlug';

export default function Validate(slug) {
  if (!slug) {
    return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
  } else if (slug.length > 32) {
    return 'MAXIMUM_LENGTH_EXCEEDED';
  } else if (slug.length <= 3) {
    return 'MINIMUM_LENGTH_NOT_REACHED';
  } else if (new RegExp(`[^${slugChars}]`, 'gi').test(slug)) {
    return 'INVALID_INPUT';
  }
  return false;
}
