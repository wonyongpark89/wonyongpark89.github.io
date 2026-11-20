# Teaching and Talks archive maintenance

Canonical lists: `/teaching/` and `/talks/`.

Keep these lists unlisted from the main website navigation. Open them by typing their URLs directly. Cross-links between the two lists remain within the archive pages.

The user chose a password gate for the lists only. Direct HTML/PDF URLs, source files and public Git history are public. The shared password is checked locally using the SHA-256 digest in `assets/data/archives.json`; it is not sent to a server. Unlocking is remembered per archive in the current browser tab. The Lock archive button clears that state.

## Add or update materials

1. Put teaching files under `teaching/` or talk files under `talks/`. Keep each application's CSS, JavaScript and other supporting files together.
2. Add an entry to `assets/data/archives.json`. List only formats that exist.
3. Run `python tools/build_archives.py`. Use `python tools/build_archives.py --check` to verify the generated indexes and file targets.
4. Commit the material, catalogue and generated indexes together.

To change the shared password, update `password_hash` in both catalogue records with the SHA-256 digest of the new value, then rebuild. The digest is part of the session key, so changing it invalidates old unlock state.

## Authoring sources

EDUC1033's authoring files and build tool are in `teaching/educ1033/`. From that directory, run `python tools/build.py w9` or `python tools/build.py w10` as before. The qualitative-analysis workbook and its existing Apps Script integration are in `teaching/qual-analysis/`. Preserve storage keys and the API contract; do not send test student submissions to the production service.

The Chungnam deck's canonical publication files are `talks/chungnam/index.html` and `talks/chungnam/chungnam-slides.pdf`. Future lecture edits belong there, rather than in the legacy `chungnam/index.html` redirect.

## Compatibility

The old HTML routes for Chungnam, EDUC3028, the two coding tools and the theory note redirect to their new canonical locations while preserving queries and slide/section hashes. EDUC1033 course/week index pages redirect to the corresponding section of the protected Teaching list. Its lecture and seminar routes redirect directly to the moved decks.

`chungnam/chungnam-slides.pdf` remains as a compatibility copy because GitHub Pages cannot issue a native per-file HTTP redirect for a static PDF. The old EDUC1033 PDF URLs likewise remain available. Titanic's project website and original downloads stay in place; the three speaker presentation PDFs are copied into this archive unchanged.

The standalone EDUC1033 and qual-analysis repositories retain their history and migration notices. Their old website entry points redirect to this repository.
