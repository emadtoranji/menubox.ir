export const DAYS = [0, 1, 2, 3, 4, 5, 6];

export function isValidTime(value) {
  if (value === null) return true;
  if (typeof value !== 'string') return false;
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export function validateDay(day) {
  const errors = {};

  if (!DAYS.includes(day.dayOfWeek)) {
    errors.dayOfWeek = true;
    return errors;
  }

  if (typeof day.isClosed !== 'boolean') errors.isClosed = true;
  if (typeof day.is24Hours !== 'boolean') errors.is24Hours = true;

  if (day.isClosed) {
    return Object.keys(errors).length ? errors : null;
  }

  if (day.is24Hours) {
    if (day.openTime !== null) errors.openTime = true;
    if (day.closeTime !== null) errors.closeTime = true;
    return Object.keys(errors).length ? errors : null;
  }

  if (!isValidTime(day.openTime)) errors.openTime = true;
  if (!isValidTime(day.closeTime)) errors.closeTime = true;

  if (
    isValidTime(day.openTime) &&
    isValidTime(day.closeTime) &&
    day.openTime >= day.closeTime
  ) {
    errors.openTime = true;
    errors.closeTime = true;
  }

  return Object.keys(errors).length ? errors : null;
}

export function validateWorkingHours(list) {
  if (!Array.isArray(list)) return { general: true };
  if (list.length !== 7) return { general: true };

  const days = list.map((d) => d.dayOfWeek);
  if (new Set(days).size !== 7) return { general: true };

  const errors = {};

  list.forEach((day, index) => {
    const dayErrors = validateDay(day);
    if (dayErrors) errors[index] = dayErrors;
  });

  return Object.keys(errors).length ? errors : null;
}
