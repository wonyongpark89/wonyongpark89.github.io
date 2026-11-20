# Wonyong Park's website and presentation archives

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors to Wonyong Park's academic website, students and workshop audiences accessing teaching materials, and Wonyong Park maintaining those materials.

## Product Purpose

Keep the existing academic website and provide two organised archives, Teaching and Talks, with HTML and PDF links for the formats that actually exist.

## Operating Context

The website is published from this repository to GitHub Pages at www.wonyongpark.com. The archives are plain static HTML, CSS and JavaScript within the existing site.

## Capabilities and Constraints

- The user requested separate `/teaching/` and `/talks/` archive lists with a shared password.
- Keep both archives unlisted in the main website navigation; the user accesses them by typing their URLs directly.
- The user explicitly chose password protection for the lists only. File URLs, repository contents and history remain public; this is a convenience gate rather than confidential storage.
- Include EDUC1033, EDUC3028, the qualitative-analysis workbook, the two qualitative-coding tools, the theory-in-PER teaching note, the Chungnam talk and the three Titanic workshop/ASE presentation PDFs.
- Migrate EDUC1033 and qual-analysis into this repository and redirect their old website URLs.
- Leave the project websites, classroom lesson packs, conference website and RSTE social-media carousels in place.
- Preserve deck content, interactive behaviour, PDF bytes, workbook storage keys and the Apps Script contract. Do not submit test data to the production workbook service.
- Retain compatibility copies of PDFs whose old URLs have already been shared.

## Brand Commitments

Inherit the existing Wonyong Park website's identity and navigation conventions. The archive extension does not rebrand the site or restyle the archived decks and tools.

## Product Principles

- Group materials by course or date, and make each available format easy to find.
- Keep old shared links useful during the migration.
- Describe the actual level of access control accurately.
- Keep future additions in one catalogue, with a repeatable static build.
