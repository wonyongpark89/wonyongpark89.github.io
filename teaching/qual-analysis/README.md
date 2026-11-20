# Qualitative Coding Workbook

A static teaching workbook for EDUC6530 Data Analysis for Educational Research at Southampton Education School.

## Preview locally

With Node.js installed, run:

```sh
node scripts/preview.cjs
```

Open `http://127.0.0.1:4173/`. No build or package installation is needed. The regular preview uses the existing live Apps Script integration when you submit work or verify access.

## Check workbook functionality

```sh
node scripts/preview.cjs --test
```

Open `http://127.0.0.1:4174/__tests__`. The page runs the complete coding-to-theme workflow and reports each check. All authentication and submission requests are mocked. Test progress uses this separate local origin and does not reach the live service.

Checks cover the first-entry tour, skip/replay and per-student dismissal, code creation/removal and exact extracts, saved progress, stage gates, failed and confirmed submissions, category placement and refinement, theme writing, printing/export content, all three worked examples, class access, and instructor review/comparison.

## Files

- `index.html`: teaching content and existing analysis, storage, and submission behavior.
- `workbook.css`: responsive course handbook design.
- `workbook.js`: presentation, accessible dialogs, and analysis-step wayfinding.
- `tour.js`: optional first-entry interface tour with contextual replay.
- `apps-script/Code.gs`: existing server integration.
- `PRODUCT.md`, `DESIGN.md`, `.impeccable/`: product context and design guidance.

The deployed page needs `index.html`, `workbook.css`, `workbook.js`, and `tour.js` together. Existing storage keys and the Apps Script API contract are retained. The tour appears after name entry, remembers completion or dismissal for that name on this device, and can be replayed from **Interface tour**. It never adds codes or submits data.
