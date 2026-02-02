export async function requestSubmit({ data, storeId }) {
  try {
    const bodyData = {
      id: data.id,
      storeId,
      category: data.category,
      title: data.title,
      description: data.description,
      price: data.price,
      discountPercent: data.discountPercent,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable,
      isActive: data.isActive,
      options: data.options,
    };
    const itemRes = await fetch('/api/dashboard/store/store-item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    });

    return await itemRes.json();
  } catch {
    return { ok: false, status: 500, message: 'UNKNOWN_PROBLEM' };
  }
}

export async function requestDeleteItem({ storeId }) {
  try {
    const res = await fetch('/api/dashboard/store/store-item', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId }),
    });
    return await res.json();
  } catch {
    return { ok: false, status: 500, message: 'UNKNOWN_PROBLEM' };
  }
}
