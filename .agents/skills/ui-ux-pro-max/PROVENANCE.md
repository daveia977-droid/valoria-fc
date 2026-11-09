# UI UX Pro Max — provenance

- Official repository: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- npm package: `ui-ux-pro-max-cli@2.15.0` (MIT).
- Package integrity: `sha512-D0J/C40xrzzi5si6ZLtRGbEE5v3QjL7d4wJNnasmP3yfDSrGiuqVCdwQiqCNnIkbqOuVoA/uonR2o1WKXh3urw==`.
- Installed 2026-11-09 using the documented `uipro init --ai codex --offline` in a temporary staging directory, then copying only the generated UI UX Pro Max skill here. Bundled companion skills were not added to this project.
- CLI installed under `/tmp/valoria-uipro-cli` rather than the unwritable global npm prefix. No site dependency or lockfile was changed. Python 3 was already installed.
- Searches use bundled data and Python standard library locally, without a network service or API key.
- The VALORIA FC approved visual references, existing typefaces/palette, native HTML/CSS/JavaScript architecture and user instructions take precedence over dataset suggestions. No Tailwind, React, paid API, Magic MCP or 21st.dev was installed.

## Applied to VALORIA FC phase C/D

The existing mockup is the visual authority; no new design-system palette or typeface was generated. Focused local searches run successfully against `ux-guidelines.csv`:

- `tabs keyboard selected` → Keyboard Navigation (Web): visible focus and logical operable order.
- `chip collection reflow` → Chip Collection Reflow / Text Reflow and Spacing: preserve complete selection labels on narrow viewports and enlarged text.
- `normal text color contrast` → Color Contrast: normal text at least 4.5:1; evaluate against the actual composed dark background.
- `rapid state animation interrupted` → Cancellable State Transitions: replace/cancel old animation and set the semantic final selection immediately.
- `screen reader semantic hierarchy` → Heading Hierarchy / Screen Reader: semantic markup and meaningful reading order for the organization tree.

The skill supplies guidance, not an automated contrast certificate. Verify the actual prototype with browser screenshots, keyboard/touch interactions, reduced-motion and accessibility checks before handoff. No runtime/library addition follows from these searches.
