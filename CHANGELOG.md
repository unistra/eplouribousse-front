# Changelog

## Next release

## 1.0.7 - 12-02-2026

- 💬 Fix typos

## 1.0.6 - 09-02-2026

- 💬 Fix various typos and text issues
- 🚑️ Fix broken pagination on resources page + add related tests
- 🚨 Fix tsc & linters errors
- ⬆️ Upgrade dependencies to latest

## 1.0.5 - 28-01-2026

- 🐛 Prevent undefined state for improved segments select on segment update dialog, fixing the empty dialog
- 🐛 Fix the visibility of reordering buttons on segment table, in instruction 

## 1.0.4 - 21-01-2026

- 🩹 Remove unavailable archived projects filter (keep it for v2)
- 🐛 Deleting a segment now removes its associated anomalies from the store
- ✏️ Fix various typos

## 1.0.3 - 20-01-2026

- 🐛 When creating a project, deleting a collection in `library B` will no longer delete the collection in `library A`
- 🐛 Fix behavior of the segment update dialog
- 💬 Update how a collection's name is formatted to include detailed information
- 💄 Add `marked` package to render Markdown files to HTML, and style the output accordingly (related to legal notice)
- 👷 Enhance CI configuration with Sentry integration and improved Docker image tagging
- 📦 Dependencies updated

## 1.0.0 / 1.0.1 / 1.0.2 - 13-01-2026

- 🎉 Initial releases (various bug fixes and CI configuration 🤓)
