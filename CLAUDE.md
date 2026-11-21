# Working in this repository

This repository publishes www.wonyongpark.com through GitHub Pages from `main`.

## Publishing changes

When the user asks for changes, make them live: commit the work, push it to `main`
(fast-forward when possible), then check the live page until the change appears and
report the URL. Do not stop at a feature branch or ask before merging.

## EDUC1033 slide decks

- Edit sources in `teaching/educ1033/<week>/src/`, never the built `lecture/` or
  `seminar/` HTML.
- Rebuild from `teaching/educ1033/` with `python tools/build.py <week>`.
- Regenerate the matching PDF (`<week>/EDUC1033-W<n>-Lecture-slides.pdf` or
  `-Seminar-slides.pdf`) whenever a deck changes, by printing the built HTML at
  1280 × 720 px with backgrounds.
- `src/_head.html` is shared by the lecture and seminar decks. Check both when you
  change it.
