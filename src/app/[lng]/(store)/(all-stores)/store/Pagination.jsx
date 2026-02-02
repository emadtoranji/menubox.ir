import Link from 'next/link';

export function Pagination({ current_page, total_pages, lng, slug, search }) {
  const range = 2;

  const pages = [];
  for (
    let i = Math.max(1, current_page - range);
    i <= Math.min(total_pages, current_page + range);
    i++
  ) {
    pages.push(i);
  }

  const baseHref = `/${lng}/store`;
  const queryParams = new URLSearchParams();
  if (slug) queryParams.set('slug', slug);
  if (search) queryParams.set('search', search);
  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}&`
    : '?';

  return (
    <div className='container my-5'>
      <nav aria-label='Pagination'>
        <ul className='pagination pagination-sm justify-content-center align-items-center gap-1 fs-5 fs-lg-6'>
          <li className={`page-item ${current_page === 1 ? 'disabled' : ''}`}>
            <Link
              className='page-link rounded-pill px-3 mx-1 fw-bolder'
              href={`${baseHref}${queryString}page=${current_page - 1}`}
            >
              ‹
            </Link>
          </li>

          {current_page > range + 1 && (
            <>
              <li className='page-item'>
                <Link
                  className='page-link rounded-circle px-3'
                  href={`${baseHref}${queryString}page=1`}
                >
                  1
                </Link>
              </li>
              <li className='page-item disabled'>
                <span className='page-link'>…</span>
              </li>
            </>
          )}

          {pages.map((p) => (
            <li
              key={p}
              className={`page-item ${p === current_page ? 'active' : ''}`}
            >
              {p === current_page ? (
                <span className='page-link btn-active rounded-circle fw-semibold'>
                  {p}
                </span>
              ) : (
                <Link
                  className='page-link rounded-circle px-3'
                  href={`${baseHref}${queryString}page=${p}`}
                >
                  {p}
                </Link>
              )}
            </li>
          ))}

          {current_page < total_pages - range && (
            <>
              <li className='page-item disabled'>
                <span className='page-link'>…</span>
              </li>
              <li className='page-item'>
                <Link
                  className='page-link rounded-circle px-3'
                  href={`${baseHref}${queryString}page=${total_pages}`}
                >
                  {total_pages}
                </Link>
              </li>
            </>
          )}

          <li
            className={`page-item ${
              current_page === total_pages ? 'disabled' : ''
            }`}
          >
            <Link
              className='page-link rounded-pill px-3 mx-1 fw-bolder'
              href={`${baseHref}${queryString}page=${current_page + 1}`}
            >
              ›
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
