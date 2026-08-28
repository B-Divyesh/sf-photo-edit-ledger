# Sidecar Ledger visual thesis

## Direction: glacial minimal ceramics

Sidecar Ledger sits between a photographer's irreplaceable originals and an
uncertain tool boundary. Its visual language should feel like labeled ceramic
archive tiles laid on a cold worktable: quiet, tactile, exact, and resistant to
the visual noise of a photo editor. Rounded slab forms represent the image and
its sidecar as two related but separable objects. Fine registration marks and
ledger rules communicate inspection rather than decoration.

## Palette

The site is intentionally single-mode and explicitly paints every surface. A
dark theme would undermine the pale ceramic material metaphor; the CLI follows
the terminal theme rather than forcing ANSI color.

- `ice-25 #F7F9F7` — cold studio background
- `porcelain #EEF2EF` — raised fields and quiet panels
- `chalk #FFFFFF` — ceramic tile faces
- `graphite #17211E` — primary text; 15.7:1 on ice
- `slate #52615D` — secondary text; 6.5:1 on ice
- `moraine #315D54` — action accent; 7.0:1 on white
- `glacier #B9DCD6` — highlighted ceramic glaze; never used alone for text
- `lichen #276247` — portable/success
- `ochre #8A4F0F` — lossy/warning
- `oxide #9B3D32` — danger
- `hairline #CDD7D3` — dividers, paired with labels where meaningful

## Typography

`Azeret Mono` (self-hosted, OFL) supplies headings, labels, commands, and table
figures. Its engineered, slightly wide skeleton reads like a physical inventory
label. `Inter` (self-hosted, OFL) carries body copy and long explanations. Two
WOFF2 Latin subsets only, both `font-display: swap`; body text never falls below
16px.

Scale: 14px micro labels, 16px body, 20px section lead, 32px section heading,
clamped 48–72px hero. Reading measure is capped at 70 characters.

## Spacing and shape

An 8px base rhythm with 4px for optical adjustment. Sections use 72–120px
vertical space; controls are at least 44px high with 8px separation. Ceramic
tiles use asymmetrical `18px 18px 24px 16px` radii, restrained 1px edges, and a
short lower-right shadow. Most groupings rely on whitespace rather than cards.

## Interaction grammar

Primary actions fill with moraine. Secondary actions are underlined text or
porcelain buttons. The demo behaves like a physical ledger: selecting a route
updates one concise stamped verdict, then its field rows. Focus is a 3px glacier
halo plus a 2px graphite edge. Status always includes an icon or word, never
color alone.

## Motion

Only state changes move. On load, the paired ceramic tiles settle upward by
8px over 240ms; demo rows fade over 180ms when a route changes. No looping
motion. With `prefers-reduced-motion: reduce`, transforms and smooth scrolling
are removed and state changes are instant.

## Asset plan and provenance

`site/public/ceramic-sidecars.webp` is an original generated still-life:
paired ceramic archival plates, one photographic negative and one labeled
sidecar, connected by a graphite registration line on an icy worktable. It
clarifies the product's core relationship without pretending to be UI.

- Generator: `/opt/fleet/lib/gen-image.sh`, deployment `factory-image`
- License: original project asset generated for Sidecar Ledger
- Prompt: "Editorial product still life for a privacy-first photography CLI...
  [full prompt retained in the adjacent `.png.json` generation record]"
- Post-processing: local conversion to responsive WebP, target ≤300 KB
- Constraints: no brand marks, no readable text, no screens, no gradient,
  no people, ample negative space

All interface icons are hand-drawn inline SVG strokes and disclosed as
decorative where the adjacent label already carries meaning.

site/public/sidecar-ledger-card.jpg and site/public/apple-touch-icon.png are
local crops of the original generated ceramic still-life above. They provide
the required social card and touch icon without introducing another visual
language. No new model asset was generated.
