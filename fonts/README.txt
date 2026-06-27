═══════════════════════════════════════════════════════════════
  NOOR FONT — DROP-IN INSTRUCTIONS
═══════════════════════════════════════════════════════════════

The brief specified the "Noor" font, but no Noor font file was
included in the project folder. The page is therefore wired so the
real Noor font activates AUTOMATICALLY the moment you add the files
here — no code changes required.

Until then, the page renders in "Tajawal", the closest premium,
free, geometric Arabic match (loaded from Google Fonts).

───────────────────────────────────────────────────────────────
HOW TO ACTIVATE THE REAL NOOR FONT
───────────────────────────────────────────────────────────────

1. Obtain your licensed Noor font files (Pascal Zoghbi / foundry).

2. Convert each weight to .woff2 (recommended) and/or .ttf.
   Free converter: https://www.fontsquirrel.com/tools/webfont-generator
   or  https://cloudconvert.com/ttf-to-woff2

3. Drop the files into THIS folder (/fonts) with these EXACT names:

       Noor-Regular.woff2   (and / or  Noor-Regular.ttf)
       Noor-Medium.woff2    (and / or  Noor-Medium.ttf)
       Noor-Bold.woff2      (and / or  Noor-Bold.ttf)

4. Open  assets/css/styles.css  and UNCOMMENT the Noor @font-face
   block near the top (remove the two lines:
       /* ---------- BEGIN NOOR (uncomment to enable) ----------
   and
       ----------- END NOOR ----------- */   ).

5. Refresh the page. Done — Noor now renders everywhere.

The font stack already lists "Noor" first in every rule, so it takes
precedence over the Tajawal fallback the instant the @font-face is
enabled. (The block ships commented out only so the browser console
stays clean while the font files are absent.)
═══════════════════════════════════════════════════════════════
