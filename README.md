# ASC 2026 Navigator — an offline Android companion for the Applied Superconductivity Conference

Pittsburgh · September 6–11, 2026 · David L. Lawrence Convention Center

This repository contains a complete, self-contained conference app built from the public ASC 2026
technical program: **222 sessions, ~1,400 presentations with full abstracts, 4,200 authors,
1,100 institutions and 41 countries.** Nothing is left out of the technical program; vendor
booths and exhibitor content are deliberately omitted.

## Install on your phone

1. Download **[`apk/ASC2026-Navigator.apk`](apk/ASC2026-Navigator.apk)** on the phone
   (open this repository in the phone browser, tap the file, then *Download*).
2. Open the downloaded file. Android asks to allow installs from your browser — allow it once.
3. Tap *Install*. The app is called **ASC 2026** and works fully offline.

The APK is a universal build (no native code), so it runs on any Android phone with Android 8.0
or newer, regardless of manufacturer or chipset. It has no network permissions beyond opening
external links (DOI, Google Scholar, Wikipedia) in your browser.

You can also open `app/dist/asc2026-navigator.html` in any browser: it is the identical app
bundled into a single file.

## What it does

| Tab | What you get |
|---|---|
| **Now** | Live view on Eastern time: what is happening now in every room, what starts next and in how many minutes, today's items of your own plan. A *time simulator* lets you preview any moment of the week. |
| **Program** | Day → time block → parallel sessions, colour-coded by area (Electronics, Large Scale, Materials, Joint, Plenary), filterable by area and format (oral, poster, special, plenary). Every session shows room and level; every talk its exact time or poster board. |
| **Search** | Instant full-text search across titles, abstracts, authors, institutions and session names (typically under 10 ms), with day / format / area filters, plus 60 curated domain keywords (REBCO, Nb3Sn, TES, SNSPD, no-insulation coils, quench, fusion magnets, …). |
| **People** | All 4,200 authors and moderators, ranked by prominence or alphabetically. A person page shows affiliation, country, biography (plenary speakers), approximate number of papers in *IEEE Transactions on Applied Superconductivity* with recent titles and DOI links, every talk they present or co-author with time and room ("where to find them"), sessions they moderate, frequent co-authors and a photo where a public one exists. |
| **Explore** | Topic map (squarified treemap of areas → subfields), *Who to meet* (most published TASC authors with their next slot), institutions and industry rankings, countries with donut breakdown, room schematic of the convention centre with what is live in each room, an interactive co-authorship network of the 90 most connected authors, and program statistics. |
| **My Plan** | Star any talk or session. The **Schedule Builder** takes your interests (subfields, keywords, followed people, areas), scores every talk, picks the best session in each parallel time slot, shows runner-up alternatives, assembles poster walks by board number, flags conflicts and exports an `.ics` calendar file. |

## Data sources

* Session and presentation program, abstracts and author lists: the public ASC 2026 EventPilot
  web planner (`eppro01.ativ.me`, project ASC2026), snapshot taken September 8, 2026.
* Topical area / subfield taxonomy: *Subfields at a Glance* spreadsheet from appliedsuperconductivity.org.
* Session moderators: *Session Moderator assignments* spreadsheet from appliedsuperconductivity.org.
* Plenary speaker biographies, abstracts and photos: appliedsuperconductivity.org/asc2026/plenary.
* IEEE TASC publication counts and recent papers: Crossref REST API (journal ISSN 1051-8223),
  counted only where the family name and given name of an author record match. Counts for very
  common names may still include namesakes and are labelled as approximate in the app.
* Additional portrait photos: Wikipedia / Wikimedia Commons, only when a Wikipedia article for
  that exact name exists and describes a physicist or engineer; each photo links to its source.

## Repository layout

```
app/www/        the web app (index.html, app.js, style.css, data.js)
app/data.json   the normalized dataset (sessions, presentations, people, institutions, …)
app/dist/       single-file bundle of the app
android/        Gradle project: a thin WebView shell around app/www
apk/            the built, signed APK
tools/          scraping, dataset build and enrichment scripts (Python 3)
tests/e2e.mjs   Playwright end-to-end test of every screen and feature
```

### Rebuilding

```bash
python3 tools/scrape_planner.py agenda speakers media   # raw planner tables → scratch/data/*.json
python3 tools/build_dataset.py                          # → build/data.json
python3 tools/enrich_crossref.py && python3 tools/enrich_crossref_exact.py && python3 tools/enrich_wiki.py
python3 tools/make_datajs.py                            # → app/www/data.js
node tests/e2e.mjs                                      # functional tests in headless Chromium
cd android && gradle assembleRelease                    # → app/build/outputs/apk/release/app-release.apk
```

The Android build needs the Android SDK (platform 35, build-tools 35) and JDK 17+; put the SDK
path in `android/local.properties` (`sdk.dir=…`). The signing keystore in `android/keystore/`
is included so that updated builds install over the previous version.
