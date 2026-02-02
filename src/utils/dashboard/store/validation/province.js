export default function Validate(locations, country, province) {
  if (!province) {
    return 'HIGHLIGHTED_CANNOT_BE_EMPTY';
  } else if (
    !locations.find(
      (f) => f.countrySlug === country && f.provinceSlug === province,
    )
  ) {
    return 'INVALID_SELECTION';
  }
  return false;
}
