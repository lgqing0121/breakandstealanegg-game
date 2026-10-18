# Break and Steal an Egg Wiki

Independent, four-language Roblox guide website. Built with Node.js and static HTML/CSS/JavaScript; no package installation is required.

## Start locally

Requires Node.js 22 or newer. From this project folder:

```powershell
npm run build
npm run dev
```

Open http://127.0.0.1:4173/en/. The server listens only on this computer. Stop it with Ctrl+C.

## Checks

```powershell
npm test
npm run build
npm run validate
```

Tests use a local-mode build without canonical URLs. Run the normal build after tests to restore the configured production metadata.

## Content and maintenance

- `content/en.json`, `pt-br.json`, `es.json`, `id.json`: localized home UI and independent article content.
- `content/articles.mjs`: shared page registry and source links.
- `content/keyword-map.json`: all 28 researched keywords mapped to relevant pages, with evidence labels. Unverified terms are not automatically published as articles.
- `content/source-home.json`, `source-modules.json`: snapshots imported from the user's research.
- `src/templates.mjs`: complete static page templates and structured data.
- `src/styles.css`: responsive cream/gold design and dark theme.
- `src/client.mjs`, `search.mjs`, `theme.js`: progressive client interactions.
- `public/assets/`: downloaded official artwork and the supplied favicon assets.
- `scripts/`: build, preview, content preparation, asset preparation, and output validation.
- `dist/`: generated deployable website, 52 localized pages plus a root page and 404.

To edit copy, update the locale JSON files directly. `python scripts/prepare-content.py` regenerates those files from the hand-authored multilingual content in that script and therefore replaces direct JSON edits. Source Markdown files remain untouched. `python scripts/prepare-assets.py` imports source snapshots and downloads missing artwork; existing images are retained.

Research review date: **October 17, 2026**. The displayed 118.8K online players and 124.8M+ visits are historical snapshots, not a live feed. Update the dated copy and statistics together when new official data is available. No active redeem code has been verified; do not replace this status without an exact developer source and a current-game check.

## Deploy

Upload the contents of `dist/` to a static host that supports directory index pages and a custom `404.html`. The source project uses a Sites manifest at `.openai/hosting.json`; the current site is private by default. Creation of a project alone is not proof of a live deployment.

The real site origin is in `site.config.json`. Override it with an environment variable when changing hosts:

```powershell
$env:SITE_URL = 'https://your-actual-domain.example'
npm run build
npm run validate
```

Use your actual deployed domain in place of the example. The origin controls canonical, hreflang, Open Graph and sitemap URLs. The preview server's unknown routes return HTTP 404. Configure the same behavior on your host.

## External requests

Artwork is served locally. Fonts currently load from Google Fonts with system-font fallback. The YouTube privacy-enhanced iframe is only created after a click. Search downloads a local JSON index, and theme preferences use browser localStorage. There is no analytics integration, sign-in, database or payment form.

See `docs/verification.md` for executed checks and limitations.
