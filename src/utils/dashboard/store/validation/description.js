export default function Validate(description) {
  if (!description) {
    return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
  } else if (description.length > 200) {
    return 'MAXIMUM_LENGTH_EXCEEDED';
  } else if (description.length <= 1) {
    return 'MINIMUM_LENGTH_NOT_REACHED';
  } else if (/[^\p{L}\p{N}\p{Emoji}\s]/gu.test(description)) {
    return 'INVALID_INPUT';
  }
  return false;
}
