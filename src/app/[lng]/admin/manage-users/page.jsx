'use client';

import { useState } from 'react';
import { useT } from '@i18n/client';
import Spinner from '@components/Spinner';
import { SearchForm } from './SearchBox';
import { FoundedUsers } from './FoundedUsers';
import toast from 'react-hot-toast';

export default function AdminUserManager() {
  const { t } = useT('admin');

  const [foundedUsers, setFoundedUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchUsers = async (query = null) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/search-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
        }),
      }).then((r) => r.json());

      if (res?.ok) {
        setFoundedUsers(res.result);
      } else
        toast.error(
          t(`code-responses.${res?.message}`, res?.message) ||
            t('general.unknown-problem')
        );
    } catch (e) {
      toast.error(t(e?.message, e?.message) || t('general.unknown-problem'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='container'>
      <SearchForm t={t} fetchUsers={fetchUsers} />

      <div className='mt-5'>
        {loading ? (
          <Spinner />
        ) : (
          <FoundedUsers
            t={t}
            foundedUsers={foundedUsers}
            setFoundedUsers={setFoundedUsers}
          />
        )}
      </div>
    </section>
  );
}
