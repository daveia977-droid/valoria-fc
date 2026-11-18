/* VALORIA FC UI icons: one restrained 18px line system. No runtime dependency. */
const paths = Object.freeze({
  'arrow-up-right': '<path d="M7 17 17 7M8 7h9v9"/>',
  'arrow-down': '<path d="M12 4v16m-7-7 7 7 7-7"/>',
  'arrow-left': '<path d="M19 12H5m7 7-7-7 7-7"/>',
  'arrow-right': '<path d="M5 12h14m-7-7 7 7-7 7"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
  'x': '<path d="M18 6 6 18M6 6l12 12"/>',
  'check': '<path d="m5 12 4 4L19 6"/>',
  'pause': '<path d="M8 5v14M16 5v14"/>',
  'play': '<path d="m8 5 11 7-11 7z"/>'
});
export function uiIcon(name) {
  if (!Object.hasOwn(paths, name)) return '';
  return '<svg class="ui-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + paths[name] + '</svg>';
}
