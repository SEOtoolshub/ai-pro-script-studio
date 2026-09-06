const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export async function huntProductMaster(keyword) {
  const response = await fetch(`${API_BASE_URL}/api/hunt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      keyword: keyword,
      target_price_band: 'auto',
      max_pages: 1,
    }),
  });

  if (!response.ok) {
    let errorMsg = 'Failed to generate product intelligence report';
    try {
      const err = await response.json();
      if (err.detail) errorMsg = err.detail;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  return await response.json();
}