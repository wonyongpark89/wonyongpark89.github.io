# EDUC1033 lecture decks

Slide decks for EDUC1033, served with GitHub Pages.

| Week | Topic | Lecture | Seminar |
|---|---|---|---|
| 9 | The teaching profession under pressure | [slides](https://www.wonyongpark.com/teaching/educ1033/w9/lecture/) · [PDF](w9/EDUC1033-W9-Lecture-slides.pdf) | [slides](https://www.wonyongpark.com/teaching/educ1033/w9/seminar/) · [PDF](w9/EDUC1033-W9-Seminar-slides.pdf) |
| 10 | Health and safety education | [slides](https://www.wonyongpark.com/teaching/educ1033/w10/lecture/) · [PDF](w10/EDUC1033-W10-Lecture-slides.pdf) | [slides](https://www.wonyongpark.com/teaching/educ1033/w10/seminar/) · [PDF](w10/EDUC1033-W10-Seminar-slides.pdf) |

## Editing a deck

Each week has a lecture and a seminar deck. Sources live in `<week>/src/lecture.html` and
`<week>/src/seminar.html`; shared head, styles and script are in `<week>/src/_head.html` and
`_tail.html`, images in `src/img/` and icons in `src/icons/`. Build the self-contained decks
(images and icons inlined, slides numbered) into `<week>/lecture/` and `<week>/seminar/` with:

```
python tools/build.py w9            # both decks
python tools/build.py w9 seminar    # one deck
```

In the deck: arrow keys, Space or click to move; F full screen; O overview; S speaker notes.
