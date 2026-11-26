// Keep shared page addresses free of unnecessary referral tags.
const url = new URL(window.location.href);
let changed = false;
for (const key of [...new Set(url.searchParams.keys())]) {
  const name = key.toLowerCase();
  if (name === 'utm_source') {
    url.searchParams.delete(key);
    changed = true;
  } else if (name === 'source') {
    for (const value of url.searchParams.getAll(key)) {
      if (/^chatgpt(?:\.com)?$/i.test(value.trim())) {
        url.searchParams.delete(key, value);
        changed = true;
      }
    }
  }
}
if (changed) window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
