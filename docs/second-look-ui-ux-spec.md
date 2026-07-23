# Second Look — UI/UX Design Specification

Target: AI coding agent implementing a production frontend (React + Tailwind CSS). Every value below is final — implement as specified, do not substitute defaults.

---

## 1. Design Thesis

**Product name used throughout this spec: "Second Look."** The name is the concept: a dermatoscope gives a clinician a magnified second look at a mole; this app gives anyone that same second look before they decide whether to see a doctor. The entire visual language is built from that one idea — a circular, lens-like frame that recurs everywhere a lesion or a result appears — instead of a generic dashboard aesthetic bolted onto a medical topic.

**The page's single job (Home/Detection):** get a photo of a lesion in front of the model in one motion, and hand back a result the person can actually read and act on, without either scaring them or letting them over-trust it.

**Why not the obvious healthcare-SaaS default:** the default output for "healthcare app" right now is sky-blue (#3B82F6-ish) + Inter + white cards + rounded-xl + a green/red badge. It is not wrong, it is just anonymous — it would look the same for a scheduling app, a billing portal, or a therapy app. Second Look needs one identity a user remembers after they close the tab. The choices below deliberately move off that default on every axis (color, type, the result component itself) while keeping the *restraint* a health product requires — no gradients-as-decoration, no illustration mascots, no playful bounce animations.

---

## 2. Design Tokens

### 2.1 Color — "Clinical Warmth" palette

Six named colors, used with strict roles. Do not introduce additional hues.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#16211F` | Primary text. Near-black with a faint green undertone (ties to teal family) instead of pure `#000` — softer, less harsh under long reading, better for older users' eyes. |
| `--paper` | `#FAF8F4` | App background. Warm off-white, not stark `#FFFFFF` — reduces the "clinical/sterile" cold that pure white produces, without tipping into the cream-parchment-editorial look. |
| `--surface` | `#FFFFFF` | Card/panel background — sits one step brighter than `--paper` so cards read as physical objects lifted off the page. |
| `--teal` | `#0B6E63` | Brand primary. A deep, desaturated teal — deliberately *not* the ubiquitous medical sky-blue. Reads as calm and clinical-adjacent without being generic. Used for primary actions, active nav, links, the confidence ring's high-confidence arc. |
| `--teal-dark` | `#084F47` | Hover/active state of `--teal`. |
| `--ochre` | `#B8791E` | Sole warm accent. Used only for: the advisory/disclaimer band, "uncertain confidence" semantic state, and small highlight badges. Never used decoratively. |
| `--moss` | `#2E7D4F` | Semantic "lower concern" state (e.g., benign-leaning prediction, low-risk self-exam answer). |
| `--brick` | `#B23B3B` | Semantic "flagged / see a doctor" state. Deliberately a muted brick, not a saturated alarm red — a positive-but-serious result should read as "act on this calmly," not "emergency." |
| `--hairline` | `#E4E0D6` | Borders, dividers, input outlines. |
| `--ink-muted` | `#5B6A67` | Secondary text, captions, timestamps. |

Contrast requirements: `--ink` on `--paper`/`--surface` and white text on `--teal`/`--brick`/`--moss` must each verify at ≥4.5:1 (body text) and ≥3:1 (large text/icons) against WCAG 2.1 AA. Run an automated contrast check after implementation and adjust luminance of `--ochre` text pairings specifically (amber-on-white text needs a darker foreground; use `--ink` for text inside ochre-tinted surfaces, never white-on-ochre for body copy).

Do not implement dark mode for v1 — out of scope, adds risk without a stated need. Do set `<meta name="theme-color" content="#FAF8F4">` and `color-scheme: light` on `<html>` so form controls and scrollbars render correctly.

### 2.2 Typography

Three roles, three typefaces — all free (Google Fonts), no licensing cost:

- **Display — "Fraunces"** (variable font, optical size axis on). Used only for: the H1 on each page, the hero confidence number inside the ring, and section headers on the Education page. Weight 520 for headers, 600 for the confidence numeral. A warm, slightly humanist serif with soft terminals — it signals "considered and credible" the way a well-typeset clinical report does, without going full slab-serif textbook. Restrict its use to these spots only; overusing a display face flattens its impact.
- **Body/UI — "Public Sans"** (weights 400/500/600). This is the deliberate substitute for Inter. Public Sans was built by the U.S. Web Design System specifically for accessible, legible public-facing government and civic services — extensively tested for readability at small sizes and by users with low vision. That provenance is the actual justification for a healthcare tool used by non-technical and older users: it is a face built for exactly this audience, not a stylistic default.
- **Utility/Data — "IBM Plex Mono"** (weight 500). Used only for: confidence percentages, timestamps, and any tabular numeral in History. Monospaced figures let a user scan a column of past confidence scores and compare them at a glance — a real functional reason, not decoration.

Type scale (base 18px, not 16px — deliberately larger base body size given the older-user requirement):

| Token | Size / Line height | Use |
|---|---|---|
| `--text-display` | 40px/1.1, Fraunces 560 | Page H1 |
| `--text-h2` | 26px/1.25, Fraunces 520 | Section headers |
| `--text-h3` | 20px/1.3, Public Sans 600 | Card titles |
| `--text-body` | 18px/1.6, Public Sans 400 | Body copy |
| `--text-body-sm` | 15px/1.5, Public Sans 400 | Captions, helper text |
| `--text-data` | 15px/1.4, IBM Plex Mono 500, `font-variant-numeric: tabular-nums` | Timestamps, percentages in lists |
| `--text-ring` | 56px/1, Fraunces 600, tabular-nums | The confidence number inside the ring |

Rules: use real ellipsis `…` not `...`; curly quotes; `text-wrap: balance` on all H1/H2 to prevent orphaned words; non-breaking space between numerals and units (`92&nbsp;%`, `2.4&nbsp;MB`).

### 2.3 Spacing, radius, elevation

- Base grid: 8px. All padding/margin/gap values are multiples of 8 (4px allowed only for icon-to-label gaps).
- Radius: `--radius-sm: 8px` (inputs, chips), `--radius-md: 14px` (cards, buttons), `--radius-full` (the lens frame, avatar-style thumbnails, the confidence ring itself). Deliberately not the very-rounded 24px "bubbly" look and not 0 (sharp/broadsheet) — 14px reads as serious-but-approachable.
- Elevation: shadows are warm-tinted, never pure black, and very low opacity — cards should look gently lifted off `--paper`, not floating.
  ```css
  --shadow-card: 0 1px 2px rgba(22, 33, 31, 0.04), 0 4px 12px rgba(22, 33, 31, 0.06);
  --shadow-raised: 0 2px 4px rgba(22, 33, 31, 0.06), 0 12px 24px rgba(22, 33, 31, 0.10);
  ```

### 2.4 Motion

- Durations: 120ms micro (hover/press), 220ms standard (panel/card transitions), 600ms for the confidence-ring fill sweep (the one deliberate "orchestrated moment" in the app — see §7).
- Animate only `transform` and `opacity` (compositor-friendly). Never `transition: all`.
- Wrap every animation in `@media (prefers-reduced-motion: reduce)`: ring fill becomes an instant fill with no sweep, upload spinner becomes a static "Analyzing…" label with a slow opacity pulse instead of rotation, page transitions become instant.
- Every animation must be interruptible — a user closing the result card mid-sweep should not be blocked by the animation finishing first.

---

## 3. Iconography & Imagery

- Icon set: **Lucide** (open source, MIT license, consistent 2px stroke) — no icon should ever stand alone without a text label in primary navigation; icon-only buttons elsewhere (e.g., a small "×" clear button) require `aria-label`.
- No emoji anywhere in the interface. No illustrated mascot or cartoon character — this is the single biggest thing that makes a health tool feel like a student project rather than a credible product. Any illustration (e.g., on the self-exam guide) should be simple line-art in `--teal`/`--ink-muted`, matching icon stroke weight, never full-color clipart.
- Photography: none of stock "doctor smiling at camera" imagery. The only photographic content in the product is the user's own uploaded lesion photo.

---

## 4. Navigation & Layout System

Four sections only: **Detect · Learn · History · Find Care** (mapped to Home/Detection, Education, History, Find Doctor). Always show icon + label together in nav — never icon-only — this is a direct accessibility decision for older/non-technical users who benefit from redundant coding (icon *and* word), not a stylistic default.

- **Desktop (≥1024px):** fixed left sidebar, 88px collapsed rail with icon+micro-label, expandable to 240px with full label on hover/focus or a pin toggle. Logo/wordmark top, four nav items, account/settings pinned to bottom.
- **Tablet (641–1023px):** sidebar collapses permanently to the 88px icon+micro-label rail (no hover-expand, since hover is unreliable on touch tablets) — labels stay visible in micro form (11px caps) rather than disappearing entirely.
- **Mobile (≤640px):** bottom tab bar, fixed, 4 equal-width targets, each a minimum 56px tall hit area (exceeds the 44px minimum) with icon above 11px label. This is the single navigation pattern most usable one-handed for a demographic that may include older or less technical users — bottom reach beats a hamburger menu that hides destinations behind a tap.

Grid: 12-column, max content width 1120px, centered, 24px side gutter on mobile / 40px tablet / 64px desktop. Cards in History/Find Care use a responsive grid: 1 column mobile, 2 columns tablet, 3 columns desktop, `min-w-0` on all flex/grid children so long lesion labels or doctor names truncate instead of breaking layout.

Skip-to-content link, visually hidden until focused, as the first focusable element on every page.

---

## 5. Page Specifications

### 5.1 Detect (Home) — all states

```
┌─ Sidebar ─┬──────────────────────────────────────────────┐
│  (nav)    │  H1: "Check a spot"                           │
│           │  sub: one calm sentence setting expectation    │
│           │                                                │
│           │  ┌──────────────────────────────────────┐     │
│           │  │                                        │     │
│           │  │      [ dashed lens-shaped dropzone ]   │     │
│           │  │      camera/upload icon, centered      │     │
│           │  │      "Drag a photo here, or"           │     │
│           │  │      [ Choose Photo ] (button)         │     │
│           │  │      caption: accepted formats + size  │     │
│           │  │                                        │     │
│           │  └──────────────────────────────────────┘     │
│           │  Advisory band (always visible, ochre-tint):  │
│           │  "This tool supports — it does not replace —  │
│           │   a dermatologist's diagnosis."               │
└───────────┴──────────────────────────────────────────────┘
```

**State: empty (default).** Dropzone is a rounded-rect (`--radius-md`) with a circular "lens" cutout illustration at its center (a simple ring + crosshair line-icon, echoing a dermatoscope viewfinder — this is the signature motif introduced early) rather than a generic cloud-upload glyph. 2px dashed `--hairline` border. Helper caption below: "JPG or PNG, up to 10 MB. Use good lighting and fill the frame with the spot." — specific and actionable, not just "upload an image."

**State: drag-over.** Border becomes solid `--teal`, background tints to `--teal` at 4% opacity, the lens icon scales to 1.04 (120ms) — a small, real piece of feedback, not a bounce animation.

**State: file selected / preview.** Dropzone is replaced by the uploaded photo, masked into a large circular "lens" frame (this is the payoff of the dropzone's own shape — same frame, now showing the real photo). Below it: filename + size (Plex Mono, small), a secondary "Replace Photo" text button, and a primary "Analyze Photo" button. Client-side validation before enabling Analyze: file type, minimum resolution, file size — inline error replaces the caption in `--brick` if a check fails (see §8), focus moves to the error message.

**State: analyzing.** The lens frame border becomes an animated radial sweep in `--teal` (the ring's fill animation running in "indeterminate" mode — same component as the result ring, just without a settled value yet, which keeps the motion meaningful rather than a generic spinner). Text under it: "Analyzing…". `aria-live="polite"` region announces "Analyzing photo" once, and later "Analysis complete" — not on every animation frame. Analyze button is disabled and shows the same label as the section ("Analyzing…"), not swapped for a different word, per the resend/submit-state consistency rule. No page navigation is blocked; user can still leave.

**State: result.** Two-column on desktop (photo left, result right), stacked on mobile:
- Left: the same circular lens frame, now with a thin `--hairline` ring around it (calm, no drama).
- Right: the **Confidence Ring** component (§7) with the prediction label as a colored chip above it (`--moss` / `--ochre` / `--brick` per predicted class) and the confidence percentage inside the ring in `--text-ring`.
- Directly under the ring: the **Advisory Band** (§8) — non-negotiable, appears on every result, not just first-time.
- Below that: a short, plain-language one-paragraph explanation of what the label means (not a clinical definition dump — one sentence, e.g. what this pattern often indicates and what a reasonable next step is).
- Two actions at the bottom: primary "Find a Dermatologist Near Me" (routes to Find Care, pre-filtered by specialty if the result suggests it) and secondary "New Scan" (clears state immediately — this is *not* wrapped in a confirmation dialog, because the result is already persisted to History the moment it's produced, so nothing is actually lost by clearing; confirmation dialogs are reserved for genuinely destructive, unrecoverable actions per §9).

**State: error.** Three distinct error sub-states, each with a specific fix, inline where the dropzone/result would be — never a generic "Something went wrong":
1. *Bad file* ("This doesn't look like a photo. Try a JPG or PNG.") — dropzone stays, error text in `--brick` beneath it, focus moves there.
2. *Image quality* ("This photo is too blurry or too small to analyze. Retake it in better light, closer to the spot.") — same treatment, phrased as an instruction.
3. *Model/network failure* ("We couldn't complete the analysis. Your photo hasn't been lost — try again.") with a "Retry" button that resubmits the same photo without requiring re-upload.

### 5.2 Learn (Education)

Single scrollable page, table-of-contents rail on desktop (sticky, left of content) that becomes a horizontal scrollable chip row on mobile. Sections as accordions, one open at a time by default on mobile to avoid a wall of text; all can be open simultaneously on desktop:

1. Warning Signs — the ABCDE method. **This is the one place numbered/lettered markers are actually justified** (A-Asymmetry, B-Border, C-Color, D-Diameter, E-Evolving is a real, named clinical sequence people are taught) — render as five compact cards in a row (wraps to 2-col tablet, 1-col mobile), each with a simple line-icon illustrating the concept (e.g., a split circle for Asymmetry) plus one sentence.
2. Self-Examination Guide — a step-by-step sequence (this is also a genuine ordered process — numbering is correct here too), each step a simple body-position line illustration + instruction. Optional interactive element: a checklist the user can tick through (state held in memory only, not persisted) so it feels like a guided routine rather than a wall of text.
3. Risk Factors — plain bullet list, no illustration needed (not a sequence, so no numbering).
4. Prevention — plain bullet list.
5. When to See a Doctor — ends with a persistent inline CTA to Find Care.

### 5.3 History

Header row: page title + a lightweight filter (All / Flagged / Benign-leaning) as a segmented control, not a dropdown — fewer taps, and the options are visible at a glance which matters for users less comfortable with UI conventions.

Each past scan is a card: small circular lens thumbnail (48px, same frame motif) on the left, prediction chip + confidence (Plex Mono) stacked beside it, relative timestamp on the right ("3 days ago", with the absolute date/time available on hover/focus via native `title` and via `Intl.DateTimeFormat` — never a hardcoded date string). Entire card is a single `<button>`/`<Link>` (not a `<div onClick>`) opening the read-only result view (same layout as §5.1's result state, minus the Analyze/New Scan actions, plus a "Delete this scan" text action).

**Deleting a history entry is genuinely destructive and irreversible — this one *does* require a confirmation dialog** ("Delete this scan? This can't be undone." / Cancel / Delete), unlike clearing the live Detect screen above. State this distinction explicitly in code comments so the agent doesn't over- or under-apply confirmation modals.

Empty state (no scans yet): centered lens icon, "No scans yet", one line encouraging their first check, primary button back to Detect. If the list exceeds ~50 entries, virtualize it.

### 5.4 Find Care

Search input (type of care / zip or "use my location" button) at top. Results as a list (not exclusively a map — map is a secondary/optional toggle, since a scrollable list is more reliably accessible than requiring map-pin taps). Each result: practice name, specialty tag, distance, phone (as a real `tel:` link) and "Get Directions" (opens native maps). Location-permission-denied empty state explains exactly what to do (re-enable location in browser settings, or search by zip instead) rather than a dead end. A single-line disclaimer under the search bar: "These listings are informational and not a referral or endorsement."

---

## 6. Component Hierarchy (React)

```
<App>
 ├── <AppShell>
 │    ├── <SidebarNav />            (desktop/tablet)
 │    ├── <BottomTabBar />          (mobile, same routes)
 │    └── <main> {page outlet} </main>
 │
 ├── <DetectPage>
 │    ├── <UploadDropzone state="empty|dragging|preview|analyzing|error" />
 │    ├── <LensFrame src? >          — shared circular image mask, also used in History
 │    ├── <ResultPanel>
 │    │    ├── <PredictionChip variant="lower-concern|uncertain|flagged" />
 │    │    ├── <ConfidenceRing value={0-100} state="indeterminate|settled" />
 │    │    ├── <AdvisoryBand />      — shared, also rendered in History detail view
 │    │    └── <ResultActions />
 │    └── <InlineError variant="file|quality|network" />
 │
 ├── <LearnPage>
 │    ├── <TocRail /> / <TocChipRow />
 │    ├── <ABCDEGrid />              — 5 <WarningSignCard />
 │    ├── <SelfExamSteps />          — ordered <StepCard />
 │    └── <Accordion> ×N sections
 │
 ├── <HistoryPage>
 │    ├── <FilterSegmentedControl />
 │    ├── <ScanCard /> ×N            — uses <LensFrame> + <PredictionChip>
 │    ├── <EmptyState />
 │    └── <ConfirmDialog />          — delete only
 │
 └── <FindCarePage>
      ├── <SearchBar />
      ├── <ResultsList> / <MapToggleView>
      ├── <DoctorCard />
      └── <LocationDeniedEmptyState />
```

Shared primitives: `<Button variant="primary|secondary|text">`, `<Chip>`, `<Card>`, `<AdvisoryBand>`, `<ConfirmDialog>`, `<Toast>` (for non-blocking confirmations like a saved/copied action, `aria-live="polite"`).

---

## 7. Signature Component — The Confidence Ring

This is the one deliberately memorable element in the product; everything else stays quiet around it.

- SVG, two concentric strokes on a `viewBox="0 0 200 200"` circle: a full `--hairline` track stroke, and a foreground arc stroke that fills clockwise from 12 o'clock to `value%` of the circumference.
- Foreground arc color = the semantic color of the predicted class (`--moss`/`--ochre`/`--brick`), stroke width 10px, `stroke-linecap="round"`.
- Center: the percentage in `--text-ring` (Fraunces 600, tabular-nums), with a short label beneath in `--text-body-sm`/`--ink-muted` (e.g., "confidence").
- Settle animation: on first render of a real value, the arc animates via `stroke-dashoffset` from 0% to `value%` over 600ms with an ease-out curve — the one orchestrated motion moment in the app. Respect `prefers-reduced-motion`: render the final state immediately, no animation.
- Indeterminate mode (used during analysis, §5.1): the arc is a fixed 25%-length segment that rotates continuously via `transform: rotate()` on a wrapping `<g>` (set `transform-box: fill-box; transform-origin: center` per SVG animation guidance) at 900ms/rotation, `animation-iteration-count: infinite`, paused entirely under reduced motion in favor of a static pulsing opacity on the "Analyzing…" text label instead.
- Accessibility: the SVG itself is `aria-hidden="true"`; the actual information ("87 percent confidence, lower concern") is conveyed via an adjacent visually-hidden text node so screen reader users get the number/meaning without parsing a graphic.
- Reused at 3 sizes via a `size` prop: `lg` (200px, Detect result), `md` (96px, History detail), `sm` (48px, History list thumbnail badge — shown as a thin ring overlay on the corner of the lens thumbnail rather than its own full component at that size).

---

## 8. Responsible-AI Disclosure Pattern — The Advisory Band

A single reusable component, not a one-off footnote, so its presence can be enforced everywhere a prediction is shown:

- Full-width band, `--ochre` at 10% background tint, `--ochre` 1px top border, `--ink` text (never white-on-ochre — contrast), a small "info" Lucide icon at the left (not a warning triangle — this is a standing disclaimer, not an alarm).
- Copy (fixed, do not let this be dismissed permanently — it's not a cookie banner): "This result is a screening aid based on an image, not a medical diagnosis. See a dermatologist to confirm any result, especially if the spot has changed recently."
- Rendered directly under every ConfidenceRing instance: Detect result state, History detail view. Never collapsible, never behind a "learn more" toggle — it must be read at the same moment as the number.
- For a `flagged` (`--brick`) prediction specifically, the band's first sentence is replaced with a slightly more direct variant ("This pattern is worth having a dermatologist look at soon.") while keeping the same visual treatment — calm and specific, not a red alert banner. Do not restyle this state to a full alarm-red block; consistency of tone across confidence levels is itself part of building trust — a design that visually panics on a flagged result undermines the credibility of the calm result it showed five minutes earlier.

---

## 9. Confirmation & Destructive-Action Rules

Only two destructive actions exist in this product, and they are handled differently on purpose:

| Action | Reversible? | Treatment |
|---|---|---|
| "New Scan" on Detect | Yes — prior result is already saved in History | Immediate, no dialog |
| "Delete this scan" in History | No | `<ConfirmDialog>` required, Cancel focused by default, destructive button labeled "Delete" not "OK" |

Never show a confirmation dialog for a non-destructive action (it trains users to click through dialogs without reading them) and never skip one for the truly irreversible delete.

---

## 10. Accessibility Requirements (WCAG 2.1 AA baseline)

Implement all of the following; treat this as a checklist an automated review will run against:

- Semantic HTML first: `<button>` for the Analyze/New Scan/nav actions, `<a>`/`<Link>` for navigation — never a `<div onClick>` standing in for either.
- Every icon-only control (clear-file ×, delete icon on a scan card if iconified) has `aria-label`; purely decorative icons (the lens motif, nav icons that sit beside visible text) get `aria-hidden="true"`.
- Full keyboard operability: dropzone is focusable and its file picker is triggerable via Enter/Space; Accordion headers are `<button>`s with `aria-expanded`; ConfirmDialog traps focus and returns it to the triggering element on close.
- Visible focus ring on every interactive element via `:focus-visible` (never `:focus`, never `outline: none` without a replacement) — a 2px `--teal` ring with 2px offset.
- `aria-live="polite"` regions for: analysis start/finish, inline validation errors, toast confirmations. Do not wrap constantly-changing content (like a live-updating timer) in `aria-live`.
- Hierarchical headings on every page starting at a single `<h1>`; skip-to-content link as first tab stop.
- Form inputs (the Find Care search field) get a real `<label>` (visually hidden if the placeholder communicates purpose), correct `type`/`inputmode` (e.g. zip code as `inputmode="numeric"`), `autocomplete` set appropriately, and are never blocked from paste.
- All images have `alt`: the user's own uploaded lesion photo gets a neutral functional alt ("Uploaded photo of the examined skin area"), not a diagnostic description; purely decorative illustrations get `alt=""`.
- Explicit `width`/`height` on the `<img>` used inside `<LensFrame>` to avoid layout shift.
- Text containers (doctor names, prediction labels) use `truncate`/`line-clamp` with `min-w-0` on their flex/grid parents so long content can't break card layouts.
- Minimum tap target 44×44px everywhere (56px on the mobile tab bar specifically, per §4).
- `prefers-reduced-motion` respected everywhere motion is used (§2.4, §7).

---

## 11. Tailwind Configuration (drop-in)

```js
// tailwind.config.js — theme.extend
{
  colors: {
    ink: '#16211F',
    'ink-muted': '#5B6A67',
    paper: '#FAF8F4',
    surface: '#FFFFFF',
    teal: { DEFAULT: '#0B6E63', dark: '#084F47' },
    ochre: '#B8791E',
    moss: '#2E7D4F',
    brick: '#B23B3B',
    hairline: '#E4E0D6',
  },
  fontFamily: {
    display: ['Fraunces', 'ui-serif', 'serif'],
    sans: ['"Public Sans"', 'ui-sans-serif', 'system-ui'],
    mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
  },
  borderRadius: {
    sm: '8px',
    md: '14px',
  },
  boxShadow: {
    card: '0 1px 2px rgba(22,33,31,0.04), 0 4px 12px rgba(22,33,31,0.06)',
    raised: '0 2px 4px rgba(22,33,31,0.06), 0 12px 24px rgba(22,33,31,0.10)',
  },
}
```

Fonts: load Fraunces, Public Sans, and IBM Plex Mono via Google Fonts (`<link rel="preconnect">` to `fonts.gstatic.com`, `font-display: swap`) — all free, no license cost, satisfying the no-premium-tools constraint. Lucide via `lucide-react`, also free/open source. No paid UI kit is required to build any component above; shadcn/ui may optionally be used as a free, copy-in-code base for `<Button>`/`<Dialog>` primitives if it speeds implementation, since it has no license fee — but every visual value must still follow the tokens in §2, not shadcn's defaults.

---

## 12. What Was Deliberately Avoided

- Sky-blue (#3B82F6-family) primary — the single most common "healthcare app" default; replaced with a deep teal.
- Inter as the body face — replaced with Public Sans, chosen for a stated, subject-relevant reason (accessibility provenance), not arbitrarily.
- A generic cloud-upload icon — replaced with the lens/dermatoscope motif that then recurs through Confidence Ring, thumbnails, and loading state, giving the app one signature instead of a library of unrelated icons.
- Saturated alarm-red for negative results — replaced with a muted brick, matched by a disclaimer band whose tone stays constant across all result severities, because a design that panics visually on one result undermines trust in every other result.
- A one-off disclaimer sentence in small print — replaced with a first-class, non-dismissible, reusable component enforced at the same visual weight as the result itself.
