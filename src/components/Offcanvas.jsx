'use client';

import { useEffect } from 'react';

export function OffcanvasButton({
  showCanvas = false,
  setShowCanvas = undefined,
  btnTitle = 'Offcanvas',
  btnClass = 'btn-primary',
}) {
  useEffect(() => {
    if (showCanvas) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showCanvas]);

  return (
    <button
      className={`btn ${btnClass}`}
      type='button'
      onClick={() => setShowCanvas(!showCanvas)}
    >
      {btnTitle}
    </button>
  );
}

export function OffcanvasWrapper({
  title,
  children,
  showCanvas = false,
  setShowCanvas = undefined,
  zIndex = 5000,
}) {
  if (!showCanvas) return null;

  return (
    <div
      style={{ zIndex }}
      className='fixed inset-0 bg-white flex flex-col overflow-y-auto pb-12'
    >
      <div className='container flex items-center justify-between border-b-2 border-muted py-3'>
        <h1>{title}</h1>
        <button
          type='button'
          className='btn'
          onClick={() => setShowCanvas(false)}
        >
          <i className='bi bi-x-lg text-black text-2xl'></i>
        </button>
      </div>

      <div className='container py-4'>{children}</div>
    </div>
  );
}
