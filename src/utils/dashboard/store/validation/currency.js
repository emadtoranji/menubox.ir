import { storeCurrencies } from '@lib/prismaEnums';

export default function Validate(currency) {
  if (!currency) {
    return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
  } else if (!storeCurrencies.includes(currency)) {
    return 'INVALID_SELECTION';
  }
  return false;
}
