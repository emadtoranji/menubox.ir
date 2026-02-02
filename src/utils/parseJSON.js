export const parseJSON = (str) => {
  if (!str) return str;
  try {
    return typeof str === 'string' ? JSON.parse(str) : str;
  } catch {
    return str;
  }
};
