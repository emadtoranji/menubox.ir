export default function Validate(phone) {
  if (!phone) {
    return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
  } else if (!/^[0-9]+$/.test(phone)) {
    return 'INVALID_INPUT';
  } else if (phone.length > 20) {
    return 'MAXIMUM_LENGTH_EXCEEDED';
  } else if (phone.length <= 7) {
    return 'MINIMUM_LENGTH_NOT_REACHED';
  }
  return false;
}
