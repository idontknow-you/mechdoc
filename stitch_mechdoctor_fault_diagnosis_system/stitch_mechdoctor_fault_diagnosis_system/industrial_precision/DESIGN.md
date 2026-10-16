---
name: Industrial Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#4d556b'
  on-tertiary: '#ffffff'
  tertiary-container: '#656d84'
  on-tertiary-container: '#eef0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an uncompromising, technical aesthetic built for mission-critical mechanical diagnostics, supervisory control, and condition monitoring. The target audience encompasses reliability engineers, field technicians, maintenance supervisors, and plant directors who require high data density without cognitive overload. 

The aesthetic is grounded in **Technical Precision Minimalism**—a modern industrial dashboard paradigm that prioritizes clarity, telemetry scanability, and structural confidence:
- **Zero Decorative Noise:** Gradient mesh flourishes, drop-shadow theatrics, and non-semantic color accents are strictly prohibited. Every visual element conveys state, structure, or metric verification.
- **Instrument-Grade Hierarchy:** Micro-typography, monospaced telemetry values, and integrated metric units (°C, RPM, mm/s, bar) give the interface the tactile authority of dedicated physical diagnostic hardware while maintaining the fluid speed of modern web architecture.
- **Semantic Rigor:** Accents are deployed exclusively for operational triage: critical machine stoppages, caution boundaries, and calibrated baseline states.

## Colors

The system uses an engineered, light-mode-default surface architecture engineered for visibility in high-ambient lighting (such as plant floor tablets) and clean presentation projectors.

### Base Structural Palette
- **Canvas Base:** `#F8FAFC` (Slate 50) delivers an eye-strain-reducing foundation.
- **Surface Elevation:** `#FFFFFF` (Crisp White) delineates active telemetry cards, toolbars, and inspection modules.
- **Surface Muted:** `#F1F5F9` (Slate 100) separates secondary metadata, table headers, and inactive slot wells.
- **Structural Outlines:** `#E2E8F0` (Slate 200) for standard technical containment borders; `#CBD5E1` (Slate 300) for active inputs, dividers, and selected cell boundaries.
- **Primary Typography:** `#0F172A` (Slate 900) delivers high-contrast legibility for primary telemetry values and critical readings.
- **Secondary Typography:** `#1E293B` (Slate 800) and `#64748B` (Slate 500) provide structural metadata and technical labels.

### Functional Brand & Action
- **Primary System Cobalt:** `#2563EB` serves as the dominant focus and interactive trigger color, reinforced by `#1E3A8A` for hover and pressed states.

### Strictly Semantic Operational Palette
No status color may be used decoratively:
- **Emergency / Lockout-Tagout / Critical:** `#DC2626` (Red 600) with `#FEE2E2` (Red 100) background tint. Reserved exclusively for high-voltage hazards, bearing seizures, safety trips, and emergency interlocks.
- **Warning / Operational Caution / Medium Confidence:** `#D97706` (Amber 600) with `#FEF3C7` (Amber 100) background tint. Applied to threshold deviations, vibrational harmonics out of baseline, and unverified AI inferences.
- **Nominal / Connected / Optimal Baseline:** `#059669` (Emerald 600) with `#D1FAE5` (Emerald 100) background tint. Applied to active sensor streams, nominal tolerances, and verified runtime links.

## Typography

The typographic system utilizes a bi-system layout pairing **Inter** for all narrative, structure, and tabular scanning with **JetBrains Mono** for all sensor telemetry, operational readouts, system tags, and inline engineering units.

- **Inter (Primary):** Selected for its neutral glyph structure, exceptional micro-legibility at 12–14px, and tabular numerical balancing.
- **JetBrains Mono (Telemetry & Badges):** Applied to real-time variables, hex error addresses, model backends (e.g., `GEMINI-1.5-PRO`, `GROQ-LLAMA3-70B`, `RULE-ENG-v4`), timestamp strings, and units of measure.
- **Inline Engineering Units:** All units (°C, Hz, RPM, mm/s RMS, bar, kVA) must be set in `label-sm` or `label-md` with regular/medium weight, tinted to `#64748B`, positioned with a non-breaking space adjacent to their numerical value.

## Layout & Spacing

The system is configured around an 8-point baseline subgrid with a 4-point micro-step for compact data densities.

### Grid Architecture
- **Desktop (≥ 1280px):** 12-column fluid grid, `1.5rem` (24px) margins, `1rem` (16px) gutters. Maximizes density for telemetry arrays, multi-axis spectrograms, and dual-pane fault trees.
- **Tablet / Rugged Toughbook (768px – 1279px):** 8-column layout with `1rem` gutters. Collapses secondary diagnostic inspectors into sliding off-canvas drawers.
- **Mobile Handheld (Field Tech) (< 768px):** 4-column layout with `1rem` margins and `0.75rem` gutters. Critical fault states, alert triggers, and telemetry readouts reflow into single-column vertical cards.

### Layout Principles
- Dense, data-first horizontal bands anchor real-time operational status across the top of screens.
- Telemetry panels avoid fluid vertical heights; cards lock to fixed vertical rhythm increments (`space-xl` increments) to ensure visual coherence across split diagnostic tiles.

## Elevation & Depth

This design system deliberately minimizes shadow-based elevation, relying instead on **low-contrast technical outlines** and **tonal planar shifts** to guarantee visual fidelity on low-contrast industrial monitors.

- **Zero Ambient Shadows:** Blurred, atmospheric drop shadows are eliminated. Surface separation is achieved strictly through `1px solid #E2E8F0` borders.
- **Surface Elevation Hierarchy:**
  - **Level 0 (Canvas):** `#F8FAFC` background.
  - **Level 1 (Telemetry & Data Cards):** Flat `#FFFFFF` surface enclosed by a `1px solid #E2E8F0` border.
  - **Level 2 (Active Focus & Modal Wells):** `#FFFFFF` with a crisp technical boundary shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)`.
  - **Level 3 (Diagnostic Overlays & Drawers):** High-density `#FFFFFF` plane isolated with a `1px solid #CBD5E1` border and a directional shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.1)`.
- **Active State Depth:** Toggled, selected, or live sensor panes drop their background from `#FFFFFF` to `#F1F5F9` and increase their perimeter border stroke to `#2563EB`.

## Shapes

The design system uses a constrained **Soft (0.25rem / 4px)** geometric profile, projecting calibrated, physical apparatus engineering rather than consumer soft-app patterns.

- **Standard Elements (4px):** Form controls, buttons, diagnostic cards, table row groupings, and inspection panels default to a crisp `0.25rem` radius.
- **Large Outer Containers (8px / `rounded-lg`):** Dedicated main application window borders and global diagnostic modal dialogues use `0.5rem`.
- **Badges & Pipeline Indicators (9999px / Full Pill):** Engine badges (`Gemini AI`, `Groq Fallback`, `Rule-based Engine`) and semantic health status pills use fully rounded pills to differentiate status tokens from interactive card containers.

## Components

### Buttons
- **Primary:** Solid `#2563EB` fill, white `#FFFFFF` text, `0.25rem` radius, `0.5rem 1rem` padding. Hover: `#1E3A8A`. Focus: `0 0 0 2px #FFFFFF, 0 0 0 4px #2563EB`.
- **Secondary / Action Outlined:** Transparent fill, `1px solid #CBD5E1`, text `#1E293B`. Hover: `#F1F5F9` surface with `#0F172A` text.
- **Destructive / Emergency Stop:** Solid `#DC2626` background, `#FFFFFF` text, uppercase tracking. Focus ring: `#DC2626`.

### Badges & Diagnostic Pipeline Indicators
- Structured in full pill shapes with a fixed height of `20px` or `24px`, padding `0.125rem 0.5rem`.
- **Engine Badges:**
  - *Gemini AI:* `#EFF6FF` background, `#1D4ED8` text, `1px solid #BFDBFE` border, leading icon.
  - *Groq Fallback:* `#FFF7ED` background, `#C2410C` text, `1px solid #FFEDD5` border.
  - *Rule-based Engine:* `#F1F5F9` background, `#334155` text, `1px solid #E2E8F0` border.
- **Health Indicators:** Contain a pulsing or solid `6px` status dot:
  - *Normal:* `#D1FAE5` background, `#047857` text, dot `#059669`.
  - *Caution:* `#FEF3C7` background, `#B45309` text, dot `#D97706`.
  - *Critical Hazard:* `#FEE2E2` background, `#B91C1C` text, dot `#DC2626`.

### Inputs with Integrated Inline Units
- Container: `1px solid #CBD5E1` border, `#FFFFFF` background, `0.25rem` radius, height `36px`.
- Layout: Structured split container. The editable input field occupies the left side; a right-anchored suffix well (`#F8FAFC` background with a left internal border `1px solid #E2E8F0`) locks the telemetry unit (`°C`, `mm/s RMS`, `RPM`, `bar`) in `JetBrains Mono`, `12px`, `#64748B`.
- Focus State: Border color `#2563EB`, with an inner stroke preventing element size jumping.

### Telemetry & Industrial Data Cards
- Container: `#FFFFFF` fill, `1px solid #E2E8F0` border, `0.25rem` radius, padding `1rem`.
- Structure:
  - Card Header: Label in `12px Inter medium`, `#64748B`, with right-aligned semantic status dot or engine badge.
  - Core Readout: Monospaced numerical value in `24px JetBrains Mono bold`, `#0F172A`, immediately adjacent to a `12px` engineering unit.
  - Delta / Confidence: Inline delta pill indicating tolerance boundaries (e.g., `±0.04 mm/s` in `#059669` or `+14.2% OVER PEAK` in `#DC2626`).

### Checkboxes & Radios
- Size: `16px × 16px`, square with `2px` radius for checkboxes; circular for radios.
- Borders: `1.5px solid #94A3B8`. Checked state: `#2563EB` fill with crisp white icon.

### Data Tables & Event Logs
- Row Height: Compact `36px` default, `44px` expanded.
- Headers: `#F1F5F9` background, `11px JetBrains Mono`, uppercase, `#475569`, border bottom `1px solid #CBD5E1`.
- Row Zebra: Alternating `#FFFFFF` and `#F8FAFC` rows with a hover highlight of `#F1F5F9`. Critical error rows adopt a permanent `#FEF2F2` tint with a `2px solid #DC2626` left indicator border.