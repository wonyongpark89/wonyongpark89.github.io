---
name: "Qualitative Coding Workbook"
description: "A course handbook for moving from transcript to theme."
colors:
  primary: "#243d34"
  accent: "#285b47"
  success: "#285b47"
  accent-hover: "#1f4b39"
  teacher: "#40546b"
  danger: "#a13432"
  bg: "#f2f4f0"
  surface: "#fff"
  ink: "#29362f"
  muted: "#626d65"
  border: "#d7ddd6"
  tint: "#e8eee6"
  stage-active: "#e2eadd"
  instruction-bg: "#edf2eb"
  instruction-ink: "#38513a"
  definition-bg: "#f4f5ef"
  field-bg: "#fbfcf9"
  reading-ink: "#29372f"
  code-sky: "hsla(200, 80%, 85%, 0.9)"
  code-leaf: "hsla(140, 75%, 85%, 0.9)"
  code-rose: "hsla(340, 80%, 88%, 0.9)"
  code-gold: "hsla(45, 90%, 85%, 0.9)"
  code-lilac: "hsla(280, 70%, 88%, 0.9)"
  code-apricot: "hsla(25, 85%, 85%, 0.9)"
  code-aqua: "hsla(180, 60%, 85%, 0.9)"
  code-coral: "hsla(10, 80%, 88%, 0.9)"
  code-citron: "hsla(60, 80%, 85%, 0.9)"
  code-periwinkle: "hsla(220, 70%, 88%, 0.9)"
typography:
  headline:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "35px"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-.035em"
  title:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "23px"
    fontWeight: 600
    letterSpacing: "-.025em"
  section:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "16px"
    fontWeight: 600
  task:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    fontWeight: 600
  body:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "14px"
    fontWeight: 400
  guidance:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "12px"
    fontWeight: 550
    lineHeight: 1.4
  speaker:
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: ".035em"
  reading:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 2.15
  extract:
    fontFamily: "Georgia, serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.8
rounded:
  annotation: "2px"
  container: "3px"
  control: "4px"
  dialog: "6px"
  number: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  control: "12px"
  flow: "14px"
  md: "16px"
  panel: "18px"
  lg: "20px"
  section: "24px"
  workspace: "28px"
  gutter: "32px"
  wide: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "9px 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
    textColor: "{colors.surface}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  button-secondary-hover:
    backgroundColor: "{colors.tint}"
  field-code:
    backgroundColor: "{colors.field-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
  card-workspace:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.container}"
  card-category:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.container}"
    padding: "18px"
  nav-activity-selected:
    backgroundColor: "{colors.tint}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
  nav-step-current:
    backgroundColor: "{colors.stage-active}"
    textColor: "{colors.primary}"
    padding: "16px 15px 14px"
  chip-code:
    rounded: "{rounded.container}"
    padding: "7px 10px"
  label-transcript-code:
    textColor: "{colors.surface}"
    rounded: "{rounded.annotation}"
    padding: "3px 6px"
  instruction-strip:
    backgroundColor: "{colors.instruction-bg}"
    textColor: "{colors.instruction-ink}"
    typography: "{typography.guidance}"
    padding: "10px 22px"
---

# Design System: Qualitative Coding Workbook

## Overview

**Creative North Star: "The Course Handbook"**

A university course handbook made into a working analysis surface. White reading sheets sit within a pale mineral-green workspace; quiet rules, compact controls, and explicit instructions make the learning sequence easy to locate. The interface is restrained and familiar, with course identity retained in the header.

System sans typography carries the product interface, while Georgia distinguishes transcript passages and original extracts. Grouped activity choices, numbered analysis steps, and the current-task line remain separate levels. The material is flat and text-led: no shipping raster imagery, gradients, or decorative illustrations.

**Key Characteristics:**

- White reading surfaces within a pale mineral-green frame.
- One system sans family for the interface; Georgia for source material.
- Activity, step, and task occupy distinct levels.
- Written state and next-action guidance accompany color.
- Fine borders, slight corners, and restrained feedback.

## Colors

Gray-green neutrals and mineral greens frame the work; multicolored annotations belong to the analysis itself. Frontmatter records source values. Semantic aliases such as accent and success intentionally share the same source color.

### Primary

- **Deep Course Green** (primary): selected modes, current-step number markers, tooltips, and gate feedback.
- **Working Green** (accent; success): submit, apply-code, and next-step actions, plus focus and caret feedback. The darker hover token reinforces the same action.
- **Mineral Green** (tint; stage-active): selected activities and current steps. Instruction surfaces use the quieter instruction-bg and instruction-ink pair.

### Secondary

- **Instructor Slate** (teacher): the instructor verification action.
- **Error Red** (danger): errors and destructive text controls.

### Tertiary

**Analysis annotations** use the ten source HSLA colors in palette order: Sky, Leaf, Rose, Gold, Lilac, Apricot, Aqua, Coral, Citron, and Periwinkle. These are categorical marks, not theme accents. Preserve their source HSLA strings and alpha. Transcript labels use darker same-hue backgrounds with white ink; drag chips and extract labels use pale marks with darker same-hue ink. Code text remains visible in every case.

### Neutral

- **Workbook Ground** (bg): the working frame behind the sheets.
- **White Paper** (surface): reading sheets, category panels, controls, and dialogs.
- **Gray-Green Ink** (ink; reading-ink): interface and transcript text respectively.
- **Quiet Ink** (muted): supporting instructions, metadata, and written state.
- **Soft Rule** (border): panel boundaries, rows, and dividers.
- **Reference Paper** (definition-bg): collapsible reference material.
- **Field Paper** (field-bg): the coding input surface.

**The Working Green Rule.** Use deep green for primary actions and selected controls; use pale green to locate the current place without competing with the transcript.

## Typography

**Interface Font:** system sans, as specified by the frontmatter stack.

**Reading Font:** Georgia, with Times New Roman and serif fallbacks for transcript prose.

**Character:** restrained product typography gives directions and controls a familiar voice. The wider serif reading rhythm marks source material as the center of the work. There is no decorative display face or monospaced label system.

### Hierarchy

- **Headline:** the name-entry product title. It reduces to 31px at the tablet breakpoint and 29px on small phones.
- **Title:** the current activity name; it reduces to 22px on tablet and mobile.
- **Section / Task:** analysis-section headings and current-task/sidebar headings. Step names use 13px semibold, reducing to 12px below the intermediate breakpoint.
- **Body:** ordinary interface content. Instructions primarily use guidance, with contextual line heights from 1.5 to 1.7.
- **Label:** compact controls. Primary actions use weight 600. Supporting state uses 11px and sentence case.
- **Speaker:** source speaker attribution; preserve real speaker content rather than inventing eyebrow text.
- **Reading:** transcript prose, capped at 72ch per paragraph. It becomes 16px below 1150px, then returns to 17px with line height 2 in narrower reading layouts.
- **Extract:** original extracts in category testing, distinguished from their sans-serif code labels.

**The Source Voice Rule.** Use Georgia for transcript prose and original extracts. Keep instructions, field values, labels, and controls in the system sans family.

## Layout

The desktop app is a viewport-height vertical shell. Header, activity navigation, activity heading, four-step route, and current-task line sit above the flexible workspace. These are different levels of wayfinding. The transcript takes the remaining width beside a 258px codebook/submission margin; the margin becomes 235px at 1150px. Transcript content and the margin scroll independently on desktop. Paragraphs are limited to 72ch.

The default outer gutter uses gutter spacing, expanding to wide at 1700px. It reduces to section at 1150px, lg at 800px, and md at 480px. Main desktop columns use workspace spacing; stage workspaces use section spacing. Category cards form two equal columns with flow spacing. Internal measures use control, md, panel, and section spacing rather than one padded-card recipe.

At 800px the page switches to natural vertical scrolling, steps become two columns, and categories become one column. Step descriptions disappear but names and written state remain. The transcript stacks above a two-column sidebar; at 480px that sidebar stacks. The coding field grows to 16px on mobile. The bottom coding bar wraps its label and entry into two rows. Workspace clearance tracks its measured height, with baseline allowances of 91px desktop and 130px mobile and safe-area padding on small phones.

The entry sheet is a two-column white/mineral-green spread capped at 970px. At 800px it becomes one column capped at 600px. Print presentation removes working chrome and lets content flow on white pages.

## Elevation & Depth

Ordinary content is flat. White paper, pale tonal strips, one-pixel borders, and spacing create hierarchy. The current step has an inset bottom rule rather than a lifted-card effect. The entry sheet has no shadow.

### Shadow Vocabulary

- **Access dialog:** `0 15px 45px #14241b33`, for instructor and in-class access overlays.
- **Code tooltip:** `0 5px 12px #17261d26`, for inspecting a code over the workspace.
- **Gate message:** the transient message retains `0 4px 12px rgba(0,0,0,0.2)`, with the course-green surface and control radius applied by the workbook stylesheet.
- **Current step:** `inset 0 -2px var(--accent)`, a location rule rather than elevation.

**The Flat Sheet Rule.** Reading and analysis containers use a white surface and fine boundary at rest. Reserve ambient shadows for overlays and transient feedback.

## Shapes

Sections are squared or gently rounded. Use container corners for workspace/category cards and chips, control corners for actions and fields, and annotation corners for inline code labels. Access dialogs have the larger dialog corner. Circular number markers belong to the learning sequence. Boundaries are generally one-pixel solid rules; category drop targets and locked number markers use dashed boundaries for a specific interaction state.

## Components

### Buttons

Compact and direct. Primary buttons use button-primary tokens, weight 600, and a 38px minimum height; next-step controls use a 34px minimum. Secondary buttons use the label role and a 36px minimum. Hover darkens primary green or tints secondary surfaces; secondary active state darkens the tint. Disabled stage/apply controls use muted gray-green surfaces, text, and a not-allowed cursor. The source has separate disabled stage-navigation and apply-code color values.

Focus is a two-pixel accent outline offset by three pixels. Standard button background, border, and text transitions run for 150ms. Reduced-motion preferences remove transitions. Submission and sync actions replace their text with progress/result feedback; retain the written status beside the action.

### Navigation

Activity choices are grouped under Practice and Worked examples, using compact transparent controls that tint when selected. Selected mode is a deep-green segment. Numbered steps form a ruled horizontal route with pale active background, dark current number, inset accent rule, and written state. Locked numbers have dashed borders. Narrow layouts use a two-by-two route; preserve state without relying on hue.

### Cards / Containers

White, flat sheets use a one-pixel Soft Rule boundary and container corners. Transcript cards have a compact ruled toolbar and spacious reading body. Category cards use panel padding with a name, drop target, and explanation. Theme sections use 22px padding. Read-only worked-example titles use 15px semibold with line height 1.5; explanations use 13px with line height 1.7. Both wrap while original hidden input values remain available to application logic.

### Inputs / Fields

White or Field Paper surfaces use quiet green-gray strokes, control corners, and accent carets. Coding fields use field-code tokens and 13px text, growing to 16px on mobile. Category fields use 13px text and 10px 11px padding; category names are semibold. Theme textareas use 14px text, line height 1.8, 13px 15px padding, a 120px minimum height, and vertical resizing. Focus uses the shared visible outline. Name and access dialogs retain visible labels and written validation.

### Chips / Code Labels

Marks carry the categorical source palette. Draggable pool chips use 12px text, a fine border, compact padding, and a grab cursor. Dragging reduces opacity to .45; valid drop targets change their pale background and border to green. Transcript labels use dark same-hue backgrounds with white text; extract labels use pale marks with dark text. Long code text wraps. These colors express data identity, not navigation state.

### Reference and Task Strips

The collapsible reference line keeps definitions alongside the current task without displacing transcript reading. Definitions use Reference Paper; the instruction below uses the instruction pair. Expanded definitions and instruction strips stay flat and ruled, using the guidance scale. Keep the specific task and next unlock condition visible above the workspace.

### Dialogs and Feedback

Access dialogs are centered white panels capped at 390px over a translucent dark-green veil, using dialog corners and the access shadow. Focus remains inside an open dialog; workbook content is inert, and focus returns on close. Name entry uses the larger handbook spread. Temporary gate feedback uses the deep-green overlay vocabulary above the coding bar.

The interface tour reuses the white overlay surface, dialog corners, deep-green primary action, and system sans. A non-modal panel sits beside a highlighted control where space permits, or above/below it on narrow screens. A functional dimmed spotlight identifies the current target. Steps stay brief, with written progress, Back, Next, and a persistent Skip tour action. The replay control belongs to the session tools. Do not require practice edits or change workbook data during the tour.

## Do's and Don'ts

### Do:

- **Do** distinguish grouped activity choices, numbered steps, and the current task.
- **Do** retain written Current step, Locked, and Available states and a specific next action.
- **Do** keep source passages spacious and category names and explanations able to wrap.
- **Do** pair analysis colors with code text; preserve the same code color across extracts and category views.
- **Do** preserve visible keyboard focus and honor reduced-motion preferences.

### Don't:

- **Don't** introduce gradients or decorative illustrations into this course-handbook world.
- **Don't** use annotation colors as a second navigation or decorative palette.
- **Don't** add elevated dashboard tiles to ordinary reading and analysis surfaces.
- **Don't** hide a worked-example explanation inside a single-line read-only field.
- **Don't** treat legacy export-window and instructor inline colors as a new visual direction.

**Not canonized:** legacy violet/slate colors and heavier uppercase styling remain in generated export windows and some instructor inline markup. They are existing drift outside the green workbook vocabulary, not rules for new surfaces. This pass records the shipped system without altering UI or export behavior.
