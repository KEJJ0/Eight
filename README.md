# آيت — EIGHT · Landing Page

A premium, fully responsive, **skeuomorphic** landing page for **آيت (EIGHT)**, a Saudi
marketing & photography agency. Built in clean, dependency‑free **HTML / CSS / JavaScript**
(no build step) — just open it.

---

## 🚀 Run it

- **Quickest:** double‑click `index.html`.
- **Recommended (so fonts/map/video load exactly as in production):** serve the folder:
  ```bash
  # any static server works, e.g.
  python -m http.server 8000
  # then open http://localhost:8000
  ```

---

## 📁 Structure

```
index.html                 ← all markup (RTL Arabic)
assets/
  css/styles.css           ← design system + every component
  js/main.js               ← counters, reveals, nav, video, form, smooth‑scroll
  img/                      ← logo variants, favicons, brand pattern
fonts/                     ← drop Noor font files here (see fonts/README.txt)
favicon.ico
Guidelines/                ← original brand assets you provided (untouched)
```

---

## 🎨 Brand system (from your Guidelines)

| Token        | Value      | Use                          |
|--------------|------------|------------------------------|
| White        | `#FFFFFF`  | surfaces, text on dark       |
| Sage         | `#A2AFA6`  | accents, numerals, pattern   |
| Slate‑green  | `#6A7974`  | primary, dark sections, CTAs |

Colours were sampled directly from `Guidelines/Colors.jpeg`. The logo, the brand’s
signature “8” mark (favicon), and the decorative wave‑and‑dot band are all derived
from your assets. The whole palette is held in CSS variables at the top of `styles.css`.

---

## ⚠️ Three things to know (please read)

### 1) The “Noor” font was **not** in the project folder
No Noor font file was included, so the page currently renders in **Tajawal** — the closest
free, premium, geometric Arabic match. Activating the real Noor takes ~30 seconds and
**no code rewrite**: see **`fonts/README.txt`** (drop the files in `fonts/`, then uncomment
one block in `styles.css`). “Noor” is already first in every font stack, so it takes over
instantly.

### 2) Videos
**Our Work** shows six real films from your channel **@EIGHT8STUDIO8** (the agency promo +
five wedding films). To change them, edit the `VIDEOS` array at the top of
**`assets/js/main.js`** — each `id` is the part of a YouTube URL after `watch?v=`.

**Hero background** is the clip on its own (your Snapchat teaser — `assets/video/hero-bg.webm`
+ `.mp4`, muted + looping, with only a light neutral scrim for text legibility). To replace
it, swap those two files (keep the names) and regenerate `assets/img/hero-poster.jpg`.

### 3) The contact form submits via **WhatsApp** (no server needed)
On submit it validates, then opens WhatsApp (`wa.me/966500250214`) pre‑filled with the
enquiry. To change the number or wire it to email/a backend instead, see the `initForm`
function in `main.js` (the WhatsApp number is the `WHATS` constant).

---

## ✨ What’s included

- **Hero** — muted auto‑looping background video (EIGHT’s teaser) with mouse‑parallax depth, plus a moving keyword ribbon below.
- **About (من نحن)** — the exact brand introduction and the “لماذا آيت؟” reasons (icons sit cleanly above each title).
- **Our Numbers (أرقامنا تتحدث)** — 3 counters (الصور / مقاطع الفيديو / أعمال) with a smooth
  count‑up animation and a `+`. Edit the targets via `data-target` in `index.html`.
- **Services (خدماتنا)** — the 7 services as perfectly equal skeuomorphic cards.
- **Our Work (أعمالنا)** — on desktop the section **pins and the films scroll horizontally**
  (the signature moment); on smaller screens it’s a vertical gallery. Each card is a
  click‑to‑play YouTube facade (loads the real iframe only on click).
- **Contact** — skeuomorphic form + an embedded Google Map of your exact location
  (حفر الباطن – حي المصيف).
- **Footer** — brand block (logo + socials) · **روابط سريعة** quick‑links nav · contact column. WhatsApp · Snapchat · TikTok · Instagram only.

## ♿ Quality

- Fully responsive (verified at 390 / 768 / 1440 px) with a mobile overlay menu.
- Respects `prefers-reduced-motion`. Keyboard accessible, focus styles, ARIA labels,
  semantic landmarks, AA‑contrast text.
- **Motion:** GSAP + ScrollTrigger choreography (cinematic hero intro, staggered scroll
  reveals, parallax, a word‑by‑word intro scrub, magnetic buttons, the pinned work gallery,
  a seamless infinite marquee) with **Lenis** smooth scrolling. All self‑hosted in
  `assets/js/vendor/` — no CDN, works offline. Gracefully falls back to CSS reveals and
  fully disables under `prefers-reduced-motion`.
- Works in all modern browsers (Chrome, Edge, Safari, Firefox).
