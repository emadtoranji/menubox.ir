'use client';

import { useMemo, useState } from 'react';
import { useT } from '@i18n/client';
import { isValidQualityEmail } from '@utils/validationEmail';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ResetForm({ hasAccess, currentLang = undefined }) {
  const router = useRouter();
  if (hasAccess) {
    router.push(`/${currentLang}/dashboard`);
  }

  const { t } = useT('reset-password');
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (!isValidQualityEmail(email)) {
      toast.error(t(`code-responses.INVALID_INPUT`));
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          language: currentLang,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (data.ok) {
        toast.success(
          t(`code-responses.${data?.message}`, '') || 'Check Email',
        );
      } else {
        toast.error(
          t(`code-responses.${data?.message}`, '') ||
            t(`general.unknown-problem`),
        );
      }
    } catch {
      toast.error(t(`general.unknown-problem`));
    }
  };

  const emailValid = useMemo(() => {
    if (!email) return null;
    return isValidQualityEmail(email);
  }, [email]);

  return (
    <form onSubmit={handleReset} className='container-fluid'>
      <h1 className='mx-auto'>{t('form.title')}</h1>

      <h6 className='mt-3 px-1 text-primary'>{t('form.description')}</h6>

      <div className='mt-3'>
        <input
          name='email'
          style={{ direction: 'ltr', textAlign: 'left' }}
          type='email'
          value={email}
          className={`form-control ${
            emailValid === null
              ? 'border-secondary'
              : emailValid
                ? 'border-success'
                : 'border-danger'
          } w-100`}
          onChange={(e) => setEmail(e.target.value)}
          placeholder=''
          required
        />
      </div>
      <div className='d-flex justify-content-center mt-3 w-100'>
        <button
          className='btn btn-success px-3'
          disabled={!emailValid}
          type='submit'
        >
          {t('form.button-title')}
        </button>
      </div>
    </form>
  );
}
