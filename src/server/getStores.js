import { BaseUrlAddress } from '@utils/globalSettings';

export async function getStores({
  slug = undefined,
  search = undefined,
  page = undefined,
}) {
  try {
    const res = await fetch(BaseUrlAddress + 'api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: slug ? slug : undefined,
        page: page ? page : undefined,
        search: search ? search : undefined,
      }),
    });

    return await res.json();
  } catch (e) {
    return { ok: false, message: e?.message || '' };
  }
}
