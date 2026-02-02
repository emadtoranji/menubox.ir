function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidQualityEmail(email) {
  const allowedDomains = [
    'gmail.com',
    'outlook.com',
    'hotmail.com',
    'yahoo.com',
    'icloud.com',
    'live.com',
  ];

  if (!isValidEmail(email)) return false;
  const domain = email.split('@')[1].toLowerCase();
  return allowedDomains.includes(domain);
}

export const normalizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';

  // remove spaces
  email = email.trim();

  // lowercase
  email = email.toLowerCase();

  // export address local and domain
  const [local, domain] = email.split('@');
  if (!local || !domain) return ''; // invalid email
  if (typeof local !== 'string' || typeof domain !== 'string') return '';

  let normalizedLocal = local;
  let normalizedDomain = domain;

  // Gmail
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // remove subaddress
    normalizedLocal = normalizedLocal.split('+')[0];
    // remove dots
    normalizedLocal = normalizedLocal.replace(/\./g, '');
    // googlemail.com -> gmail.com
    normalizedDomain = 'gmail.com';
  }

  return `${normalizedLocal}@${normalizedDomain}`;
};
