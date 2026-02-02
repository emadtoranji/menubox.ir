'use client';

import { useT } from '@i18n/client';
import toast from 'react-hot-toast';

export const useCopyToClipboard = () => {
  const { t } = useT();

  const makeCopyToClipboard = async (
    textToCopy,
    { successText, errorText, emptyText } = {},
  ) => {
    if (!textToCopy) {
      toast.error(emptyText || t('copy.nothing-to-copy'));
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(successText || t('copy.copied-to-clipboard'));
    } catch {
      toast.error(errorText || t('copy.error-while-copying-to-clipboard'));
    }
  };

  return makeCopyToClipboard;
};
