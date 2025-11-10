export function objectToQueryParams(obj: Record<string, any>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item != null) params.append(key, String(item));
      });
    } else {
      params.append(key, String(value));
    }
  }

  return params.toString();
}