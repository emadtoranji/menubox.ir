export default function Validate(locations, country) {
  if (!country) {
    return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
  } else if (!locations.find((f) => f.countrySlug === country)) {
    return 'INVALID_SELECTION';
  }
  return false;
}
