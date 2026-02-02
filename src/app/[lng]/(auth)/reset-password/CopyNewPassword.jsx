'use client';
import { useCopyToClipboard } from '@utils/useCopyToClipboard';
export default function CopyNewPassword({ newPassword }) {
  const makeCopyToClipboard = useCopyToClipboard();
  if (!newPassword) return null;

  return (
    <div className='text-center w-100 '>
      <button
        className='btn btn-dark p-4 d-flex align-items-center justift-content-center mx-auto gap-2'
        onClick={() => makeCopyToClipboard(newPassword)}
      >
        <span className=''>{newPassword}</span>
        <i className='bi bi-copy fs-4'></i>
      </button>
    </div>
  );
}
