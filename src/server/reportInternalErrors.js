export function reportInternalErrors({
  type = 'info',
  section = '',
  message = '',
}) {
  console.log(`reportInternalErrors '${type}': `, section, message);
}
