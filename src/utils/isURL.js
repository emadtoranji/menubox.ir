export function isURL(value) {
  try {
    if (typeof value !== 'string') return false;

    const v = value.trim().toLowerCase();

    if (!v) return false;

    if (/^(https?:\/\/|ftp:\/\/|www\.)/.test(v)) return true;

    const domainLike = /^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(v);
    const hasPathOrPort = /[\/:?#[\]@!$&'()*+,;=]/.test(v);

    if (domainLike && hasPathOrPort) return true;

    return false;
  } catch {
    return false;
  }
}
