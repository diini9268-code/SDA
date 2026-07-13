# Homepage Design QA

## Source Visual Truth

- Article reference: `C:\Users\Owner\Pictures\Screenshots\Screenshot 2026-07-13 134914.png` at 1896 x 850.
- Program reference: `C:\Users\Owner\Pictures\Screenshots\Screenshot 2026-07-13 134930.png` at 1885 x 810.
- Hero, principles, leadership, membership CTA, and footer references: screenshots attached in the user request.
- Intentional content constraint: the implementation retains SSDU's real product name, public repository data, and supported routes rather than reproducing unsupported SDA sample content.

## Implementation Evidence

- Desktop hero: `C:\Users\Owner\AppData\Local\Temp\sda-home-polish-audit\production-desktop-hero.png`, 1896 x 850, top-of-page state.
- Desktop articles: `C:\Users\Owner\AppData\Local\Temp\sda-home-polish-audit\production-desktop-articles.png`, 1896 x 850, empty public-data state.
- Desktop programs: `C:\Users\Owner\AppData\Local\Temp\sda-home-polish-audit\production-desktop-programs.png`, 1885 x 810, empty public-data state.
- Tablet hero: `C:\Users\Owner\AppData\Local\Temp\sda-home-polish-audit\production-tablet-hero.png`, 1024 x 900.
- Mobile menu and CTA: `production-mobile-menu.png` and `production-mobile-cta.png` in the same audit directory, 390 x 844.
- Keyboard focus: `production-keyboard-focus.png` in the same audit directory, 1280 x 800.
- Chrome console errors checked across all captured states: 0.
- Layout metrics: desktop 1896/1896, tablet 1024/1024, and mobile 390/390 for `innerWidth/documentElement.scrollWidth`; no horizontal overflow.

## Full-View Comparison

- Typography: Source Serif 4 and Inter are self-hosted through `next/font`; display wrapping, weight, line height, and button text now follow the reference proportions. The desktop hero uses the intended three display lines.
- Spacing and layout: desktop content begins near x=105, the hero uses an approximately 840/800 split, statistic tiles remain 2 x 2, and card grids switch from one to two to three columns at mobile/tablet/desktop breakpoints.
- Colors and tokens: navy, cyan, pale-blue surfaces, borders, overlays, and status colors match the reference family with accessible contrast.
- Image quality: local optimized raster assets are sharp and correctly cropped. The membership image is an intentional closest-available subject variation from the reference.
- Copy and content: headings follow the design while counts, posts, programs, and leaders come only from existing public repositories. Empty states replace design sample cards when those repositories return no rows.

## Focused Comparison

- Article reference and implementation were opened together. Header geometry, x=105 content gutter, heading/button alignment, and the y-position of the content region match; populated card imagery cannot be compared in the current empty backend state.
- Program reference and implementation were opened together. Eyebrow, single-line desktop heading, supporting copy, content gutter, and CTA alignment match; sample program cards were not injected.
- Hero desktop/tablet/mobile captures were inspected together. The former 1024 px collision and clipped CTA are gone, and the 390 px layout keeps all controls and text inside the viewport.
- Mobile menu open state was captured. Links have 44 px minimum targets, the panel stays inside the viewport, and Home exposes `aria-current="page"`.

## Comparison History

1. Initial audit found P1 tablet header/hero overlap and P2 desktop gutter, hero wrapping, early three-column breakpoints, permanent mobile navigation, masked overflow, incomplete focus/hover states, and unsupported Login/membership links.
2. First fix moved full navigation and split hero to `xl`, widened the content frame, introduced a one-row accessible mobile menu, removed overflow masking, added focus and reduced-motion behavior, and routed conversion links to the existing contact workflow.
3. First post-fix evidence showed no overflow but found P2 vertical drift in hero line rhythm and anchored article/program sections.
4. Second fix adjusted hero line height and vertical alignment, reduced section anchor offsets to the actual 80/90 px header height, and tightened article/program top spacing.
5. Second post-fix evidence showed no actionable P0/P1/P2 visual or responsive defect.
6. Production-mode recapture confirmed the same layout without the Next.js development indicator, with zero console errors and no horizontal overflow.

## Findings

- P0: none.
- P1: none.
- P2: none in the latest browser pass.
- P3: populated article/program/leader card states could not be visually captured because the connected public repositories currently return no rows.
- P3: the membership CTA uses the existing local speaker asset rather than the exact subject in the design reference.

## Primary Interactions Tested

- Transparent-to-white fixed header transition.
- Mobile navigation open state and viewport containment.
- Join and membership CTAs route to the supported contact workflow.
- Keyboard Tab exposes the skip link with a 3 px solid cyan focus outline.
- Reduced-motion emulation reports `animation-name: none` and near-zero transition duration.
- The hero heading exposes the complete accessible name, Home exposes `aria-current="page"`, and Join SSDU resolves to `/contact`.

## Result

final result: passed
