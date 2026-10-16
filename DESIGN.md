---
name: Sovereign Blue
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf1'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e4efff'
  surface-container-high: '#daeaff'
  surface-container-highest: '#d4e4f9'
  on-surface: '#0d1d2c'
  on-surface-variant: '#434652'
  inverse-surface: '#233242'
  inverse-on-surface: '#e9f1ff'
  outline: '#737783'
  outline-variant: '#c3c6d4'
  surface-tint: '#2d5bb3'
  primary: '#002b6b'
  on-primary: '#ffffff'
  primary-container: '#004098'
  on-primary-container: '#91b1ff'
  inverse-primary: '#b0c6ff'
  secondary: '#425f8d'
  on-secondary: '#ffffff'
  secondary-container: '#adcafe'
  on-secondary-container: '#385582'
  tertiary: '#3e2b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#5b4000'
  on-tertiary-container: '#e0a92f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b0c6ff'
  on-primary-fixed: '#001945'
  on-primary-fixed-variant: '#04429a'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#abc7fc'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#294773'
  tertiary-fixed: '#ffdea5'
  tertiary-fixed-dim: '#f7bd43'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#f8f9ff'
  on-background: '#0d1d2c'
  surface-variant: '#d4e4f9'
typography:
  headline-xl:
    fontFamily: IBM Plex Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: IBM Plex Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: IBM Plex Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 30px
  headline-md:
    fontFamily: IBM Plex Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: IBM Plex Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: IBM Plex Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: IBM Plex Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: IBM Plex Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-numeric:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: IBM Plex Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an authoritative, institutional, and highly structured digital presence inspired by state-level financial commodity exchanges. Tailored for market participants, institutional traders, data analysts, and regulatory bodies, the interface conveys absolute security, fiscal weight, and operational precision.

Drawing primarily from **Corporate / Modern** principles with disciplined touches of **Financial Minimalism**, the aesthetic prioritizes clear quantitative hierarchies, structural legibility, and high-density data visualization over decorative flair. Deep maritime blues and royal hues project stability and governance, while pure white working planes and cool slate-tinted canvas areas keep complex financial instruments parsing cleanly under intensive daily use.

## Colors

The color system delivers strict regulatory authority and immediate functional clarity:

- **Primary (`#004098`)**: The dominant institutional royal blue. Applied to primary brand headers, key calls-to-action, active state indicators, and major market index highlights.
- **Secondary (`#002752`)**: Deep navy blue serving as the structural anchor. Deployed across universal master navigation bars, enterprise footers, table section headers, and dense data containers.
- **Tertiary (`#C69214`)**: Refined financial gold/brass accent. Reserved strictly for market notices, VIP/member tier indicators, active contract flags, and critical focus states.
- **Neutral (`#1B2A3A`)**: Deep charcoal-slate used for primary typography, crisp metrics, and borders, avoiding harsh black while maximizing readability.
- **Background Tiers**: The base canvas operates on an ultra-light cool grayish-blue (`#F4F7FA`), layered beneath clean white (`#FFFFFF`) card and table panels, with secondary utility dividers in soft blue-gray (`#DCE4EC`).
- **Semantic Market Status**: Chinese domestic exchange green (`#00875A` for downward trends or standard status) and red (`#D32F2F` for upward movement or alert conditions) maintain domain-specific financial compliance.

## Typography

The typography couples the engineering discipline of **IBM Plex Sans** with the monospace precision of **JetBrains Mono**:

- **Headings & Body Text**: IBM Plex Sans offers clear geometric forms and robust vertical metrics, critical for regulatory disclosures, structured tabular headers, and multi-column article layouts.
- **Financial & Market Data**: JetBrains Mono serves all numerical figures, commodity symbols, transaction settlement values, percentages, and trade volumes to guarantee uniform vertical alignment across compact order books and tabular spreads.
- **Scale Hierarchy**: Headlines scale down predictably on mobile environments to prevent line wrap on complex commodity contract names. Letter spacing is subtly tightened across display sizes and expanded on all-caps micro labels for institutional sobriety.

## Layout & Spacing

The layout model is governed by a high-density **Fixed Grid** spanning an institutional standard container of 1200px (expanding up to 1440px on widescreen workstations):

- **Grid Architecture**: 12-column grid system with 24px (`gutter-lg`) spacing between major structural units on desktop, collapsing to 16px (`gutter`) on viewports under 1024px.
- **Rhythm**: Spacing follows a compact 4px baseline module optimized for dense information architecture. Margins scale from 16px (`margin`) on mobile screens up to 48px (`margin-lg`) on ultra-wide desktop monitors.
- **Screen Adaptations**:
  - **Desktop (≥1200px)**: Multi-column analytical layouts featuring persistent side rails for contract navigation, announcements, and primary order tables side-by-side.
  - **Tablet (768px – 1199px)**: Sidebars tuck into tabbed switchers or drawers; table systems lock horizontal scrolling with freeze-frame headers.
  - **Mobile (<768px)**: Stacked single-column layouts with dense touch targets adhering to a 44px minimum hit region while retaining compact 8px internal component padding.

## Elevation & Depth

To preserve the institutional legitimacy and paper-like reliability expected of a national exchange, depth is constructed via **low-contrast outlines and subtle tonal layering**, strictly avoiding heavy atmospheric drop shadows:

- **Surface Tiers**: Base canvas surfaces rest at `#F4F7FA`. Active workspace panels and cards ascend to solid `#FFFFFF`. Top-level navigation and sticky transaction bars sit at `#002752` with zero elevation blur.
- **Outlines & Dividers**: Structured through 1px borders colored `#DCE4EC` on light backgrounds and `#1B3B66` on dark navy modules. Panels maintain separation via high-contrast boundaries rather than blur radii.
- **Contextual Elevation**: Transient surfaces such as autocomplete menus, filter popovers, and regulatory modal dialogs use a calibrated ambient shadow: `0 4px 16px rgba(0, 39, 82, 0.08)`, tinted directly with the deep navy palette.

## Shapes

The design system utilizes **Soft (`1`)** geometry:
- Standard elements (buttons, text inputs, table wrappers, notice containers) feature `0.25rem` (4px) corner radii.
- Large modal dialogs, data summary cards, and multi-tier structural widgets use `0.5rem` (8px).
- Pill shapes are rejected entirely in favor of rectilinear forms that reflect precision, institutional permanence, and optimal space conservation inside compact data grids.

## Components

### Buttons
- **Primary**: Solid `#004098` with crisp white typography, 4px border radius, and 10px 18px padding. Hover state shifts down to `#00337A`; active/pressed shifts to `#002752`.
- **Secondary / Outline**: 1px solid `#004098` on transparent or pure white fill, with `#004098` text. Hover shifts background to `#F0F4FA`.
- **Tertiary / Action (Gold)**: Reserved for high-priority alerts, settlement highlights, or member actions. Fill `#C69214` with `#FFFFFF` text.

### Data Tables & Quotation Matrices
- Alternating row styling using alternating `#FFFFFF` and `#F8FAFC`.
- Header bars utilize `#002752` with `#FFFFFF` medium-weight text or `#EEF3F8` with `#004098` bold text.
- Cells carry vertical divider borders (`1px solid #E8EEF5`) for unambiguous reading across multi-variable commodity quote feeds.
- Monospace figures (`JetBrains Mono`) right-align with consistent decimal placement.

### Input Fields & Selectors
- Background: `#FFFFFF`, border: `1px solid #CCD8E4`, radius: `4px`, internal padding: `8px 12px`.
- Focus state: `1px solid #004098` with an additional `2px` focus ring tinted `#004098` at 20% opacity.
- Disabled state: `#EEF2F6` fill with `#8B9DAE` muted typography.

### Chips & Commodity Badges
- Compact rectangular badges (`4px` radius) with `2px 8px` padding.
- Contract Status: Agriculture, Energy, and Metals symbols styled with soft navy background (`#EBF1F8`) and `#004098` text.
- Market Movement Tags: Upward trend tags utilize pale red tint (`#FDE8E8`) with `#D32F2F` text; downward trend tags utilize pale green tint (`#E6F4EA`) with `#00875A` text.

### Cards & Analytical Panels
- White container (`#FFFFFF`) bound by `1px solid #DCE4EC`.
- Card headers incorporate a 3px vertical accent bar in `#004098` adjacent to the section title, providing instant section scannability.

### Checkboxes & Radio Buttons
- 16px square/circle boxes with `1px solid #A2B6CC`.
- Checked state: Solid `#004098` fill containing a pure white check mark icon.
- Focus outlines match standard institutional keyboard navigation rings.