export default function Validate(tax) {
  if (tax?.enable) {
    if (!tax?.percent) {
      return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
    } else if (!/^[0-9]+$/.test(tax.percent)) {
      return 'INVALID_INPUT';
    } else if (tax.percent > 100) {
      return 'MAXIMUM_LENGTH_EXCEEDED';
    } else if (tax.percent < 0) {
      return 'MINIMUM_LENGTH_NOT_REACHED';
    }
  }
  return false;
}
