# 1in56million.org

A single, self-contained static website. All HTML, CSS, and JavaScript are inlined in `index.html` (~1.6 MB). There is no build step, package manager, dependency install, lint, or test suite.

## Cursor Cloud specific instructions

- **Controversial content — ask before changing (site owner's standing instruction):** Before adding or altering any substantive factual or messaging content that could be considered controversial — e.g. claims about the Law of Return, the Noahide movement, India–Israel relations, British-Israelism, Anusim/Sephardic citizenship, or similar mission-area claims — do NOT commit it. Draft the change and ask the site owner to approve it first. Purely structural, non-controversial changes (SEO tags, accessibility, `llms.txt`/`robots.txt`/`sitemap.xml`, share buttons, UI-string localization, bug fixes) may proceed normally.
- Static site, no dependencies to install. Python 3 and Node are preinstalled; nothing is needed to develop or run it.
- Run locally with a static file server from the repo root: `python3 -m http.server 8000`, then open `http://localhost:8000/`.
- The entry file is `index.html`.
- The page uses client-side i18n: language buttons re-render `data-i18n` text in place without a page reload.
- "Building" just means opening the static file in a browser; there is no lint or automated test tooling.
