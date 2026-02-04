'use client';

export function freeSpanComponent({ t, additionalClass = 'text-success' }) {
  return <span className={`${additionalClass}`}>{t('free')}</span>;
}
