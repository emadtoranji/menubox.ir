'use client';

import { replaceInvalidSearchInput } from '@utils/replaceInvalidSearchInput';
import { useState } from 'react';

export function SearchForm({ t, fetchUsers }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSetQuery = (text = undefined) => {
    if (typeof text !== 'string') {
      setSearchQuery('');
    } else {
      setSearchQuery(replaceInvalidSearchInput(text));
    }
  };

  return (
    <div className='container col-lg-8 col-xxl-6'>
      <div className='d-flex border border-1 border-dark text-bg-light p-1 m-0 rounded-pill'>
        <input
          type='text'
          className=' text-bg-light form-control rounded-pill border-0 text-center'
          placeholder={t('general.search-placeholder')}
          value={searchQuery}
          onChange={(e) => handleSetQuery(e.target.value)}
        />

        <button
          type='button'
          className={`btn rounded-0 border-0 text-dark ${
            searchQuery.length ? '' : 'opacity-50'
          }`}
          onClick={handleSetQuery}
          disabled={!searchQuery.length}
        >
          <span className='visually-hidden'>Make Search Box Empty</span>
          <i className='bi bi-arrow-repeat text-dark'></i>
        </button>
        <button
          type='submit'
          onClick={() => fetchUsers(searchQuery)}
          className={`btn rounded-0 border-0 text-dark ${
            searchQuery.length ? '' : 'opacity-50'
          }`}
          disabled={!searchQuery.length}
        >
          <span className='visually-hidden'>Submit Search</span>
          <i className='bi bi-search'></i>
        </button>
      </div>
    </div>
  );
}
