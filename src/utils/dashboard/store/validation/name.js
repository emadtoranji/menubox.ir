export default function Validate(name) {
  if (!name) {
    return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
  } else if (name.length > 32) {
    return 'MAXIMUM_LENGTH_EXCEEDED';
  } else if (name.length <= 1) {
    return 'MINIMUM_LENGTH_NOT_REACHED';
  } else if (/[^\p{L}\p{N}\p{Emoji}\s]/gu.test(name)) {
    return 'INVALID_INPUT';
  }
  return false;
}
