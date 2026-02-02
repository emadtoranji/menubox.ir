import { storeCategories } from '@lib/prismaEnums';

export default function Validate(categories) {
  if (!categories.length) {
    return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
  } else if (!categories.some((v) => storeCategories.includes(v))) {
    return 'INVALID_SELECTION';
  }
  return false;
}
