// Build a URL string from a path template + params + query
export function pathTo(path, params = {}, query = {}) {
  if (typeof path !== "string") {
    throw new TypeError(`path must be a string, got ${typeof path}`);
  }

  const compiled = path.replace(/:([A-Za-z_]\w*)/g, (_, name) => {
    if (params[name] == null) throw new Error(`Missing :${name}`);
    return encodeURIComponent(String(params[name]));
  });

  const qs = new URLSearchParams(
    Object.entries(query).filter(([, v]) => v != null) // skip null/undefined
  ).toString();

  return qs ? `${compiled}?${qs}` : compiled;
}
