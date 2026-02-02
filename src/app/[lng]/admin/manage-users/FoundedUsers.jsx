'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export function FoundedUsers({ t, foundedUsers = [], setFoundedUsers }) {
  const [editingUserId, setEditingUserId] = useState(null);
  const [userEdits, setUserEdits] = useState({});
  const [saving, setSaving] = useState(false);

  if (!Array.isArray(foundedUsers) || !foundedUsers.length) return null;

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setUserEdits({ ...user, amountToChange: undefined });
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setUserEdits({});
  };

  const handleChange = (field, value) => {
    setUserEdits((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          update: userEdits,
        }),
      }).then((r) => r.json());

      if (res?.ok) {
        toast.success(
          t(`code-responses.${res?.message}`, 'Update Successfully'),
        );
        setFoundedUsers(res?.result?.newResult);
        setEditingUserId(null);
        setUserEdits({});
      } else {
        toast.error(
          t(`code-responses.${res?.message}`, res?.message) ||
            t('general.unknown-problem'),
        );
      }
      setSaving(false);
    } catch (e) {
      setSaving(false);
      toast.error(t(e?.message));
    }
  };

  const renderInput = (
    type,
    label,
    field,
    value,
    editable,
    idSuffix,
    extraClass = '',
  ) => (
    <div className='col' style={{ direction: 'ltr', textAlign: 'left' }}>
      <div className='form-floating mb-3'>
        <input
          type={type}
          className={`form-control ${extraClass} ${
            editable ? '' : 'opacity-75'
          }`}
          id={`${field}-${idSuffix}`}
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          readOnly={!editable}
        />
        <label htmlFor={`${field}-${idSuffix}`}>{label}</label>
      </div>
    </div>
  );

  const renderSelect = (
    label,
    field,
    value,
    optionsList,
    editable,
    idSuffix,
  ) => (
    <div className='col'>
      <div className='form-floating mb-3'>
        <select
          className={`form-select text-center ${editable ? '' : 'opacity-75'}`}
          id={`${field}-${idSuffix}`}
          value={value}
          onChange={(e) => handleChange(field, e.target.value)}
          disabled={!editable}
        >
          {optionsList.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <label htmlFor={`${field}-${idSuffix}`}>{label}</label>
      </div>
    </div>
  );

  return (
    <div className='container'>
      {foundedUsers.map((user, index) => {
        const isEditing = editingUserId === user.id;
        const data = isEditing ? userEdits : user;
        const locked = isEditing && saving;

        return (
          <div
            key={user?.id || index}
            className={`card rounded shadow-lg p-3 mb-5 ${
              locked ? 'opacity-50 pointer-events-none' : ''
            }`}
            disabled={locked}
          >
            <div className='row row-cols-1 row-cols-lg-2 row-cols-xxl-3 g-4 '>
              {renderInput(
                'text',
                t('manage-users.id', 'ID'),
                'id',
                data.id || '',
                false,
                user.id,
              )}
              {renderInput(
                'text',
                t('manage-users.username', 'Username'),
                'username',
                data.username || '',
                isEditing,
                user.id,
              )}
              {renderInput(
                'email',
                t('manage-users.email', 'Email'),
                'email',
                data.email,
                isEditing,
                user.id,
              )}
              {renderInput(
                'text',
                t('manage-users.balance', 'Balance'),
                'balance',
                data.balance,
                false,
                user.id,
                'bg-light',
              )}
              {isEditing &&
                renderInput(
                  'number',
                  t(
                    'manage-users.change-balance',
                    'Change Balance (will sum to Balance)',
                  ),
                  'amountToChange',
                  data.amountToChange,
                  true,
                  user.id,
                  Number(data.amountToChange) > 0
                    ? 'border-success text-success'
                    : Number(data.amountToChange) < 0
                      ? 'border-danger text-danger'
                      : '',
                )}
              {renderSelect(
                t('manage-users.accessibility', 'Accessibility'),
                'accessibility',
                data.accessibility,
                ['admin', 'developer', 'user', 'tester'],
                isEditing,
                user.id,
              )}
              {renderSelect(
                t('manage-users.status', 'Status'),
                'status',
                data.status,
                ['active', 'inactive', 'banned'],
                isEditing,
                user.id,
              )}
            </div>

            <div className='d-flex justify-content-center align-items-center row row-auto gap-3'>
              {!isEditing ? (
                <button
                  className='btn btn-outline-primary col-auto px-4'
                  onClick={() => handleEdit(user)}
                >
                  <i className='bi bi-pencil-square mx-1'></i>
                  {t('general.edit')}
                </button>
              ) : (
                <>
                  <button
                    className='btn btn-success col-auto px-4'
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <i className='bi bi-check-circle mx-1'></i>
                    {t('general.save')}
                  </button>
                  <button
                    className='btn btn-secondary col-auto px-4'
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <i className='bi bi-x-circle mx-1'></i>
                    {t('general.cancel')}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
