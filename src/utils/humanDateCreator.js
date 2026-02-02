import { TimeZone } from '@utils/globalSettings';

export function humanDateCreator(
  value,
  locale = 'fa-IR',
  timeZoneVisible = true,
  timeVisible = true
) {
  if (!value) return '-';

  const dt = new Date(value);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TimeZone,
    ...(timeVisible && {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    ...(timeZoneVisible && { timeZoneName: 'shortGeneric' }),
    hour12: false,
  };

  return dt.toLocaleString(locale, options);
}
