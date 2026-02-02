export default function Validate(address) {
  if (!address) {
    return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
  } else if (address.length > 200) {
    return 'MAXIMUM_LENGTH_EXCEEDED';
  } else if (address.length <= 5) {
    return 'MINIMUM_LENGTH_NOT_REACHED';
  }
  return false;
}
