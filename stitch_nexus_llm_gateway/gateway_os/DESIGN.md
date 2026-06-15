---
name: Gateway OS
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c2cab0'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8c947c'
  outline-variant: '#424936'
  surface-tint: '#98da27'
  primary: '#ccff80'
  on-primary: '#213600'
  primary-container: '#a3e635'
  on-primary-container: '#416400'
  inverse-primary: '#446900'
  secondary: '#5de6ff'
  on-secondary: '#00363e'
  secondary-container: '#00cbe6'
  on-secondary-container: '#00515d'
  tertiary: '#f8eaff'
  on-tertiary: '#490080'
  tertiary-container: '#e5c7ff'
  on-tertiary-container: '#7f24ce'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b2f746'
  primary-fixed-dim: '#98da27'
  on-primary-fixed: '#121f00'
  on-primary-fixed-variant: '#334f00'
  secondary-fixed: '#a2eeff'
  secondary-fixed-dim: '#2fd9f4'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5a'
  tertiary-fixed: '#f0dbff'
  tertiary-fixed-dim: '#ddb7ff'
  on-tertiary-fixed: '#2c0051'
  on-tertiary-fixed-variant: '#6900b3'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  technical-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-xs:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The design system is a premium retro-futuristic interface inspired by high-end hardware aesthetics and technical precision. It moves away from loud, saturated "cyberpunk" tropes in favor of a sophisticated "Nothing-style" philosophy—utilizing dot-matrix textures, geometric clarity, and intentional use of negative space.

The target audience consists of technical professionals and enthusiasts who value high-performance tools with a distinct, tactile personality. The visual style is a blend of **Minimalism** and **Glassmorphism**, characterized by a near-black canvas, semi-transparent utility panels, and surgical applications of light to guide focus. The emotional response should be one of "controlled power" and "advanced clarity."

## Colors

The palette is anchored in a deep-space monochromatic base to ensure maximum contrast for functional accents.

- **Base Layer:** A near-black `#0a0a0a` provides the foundation, minimizing eye strain and emphasizing depth.
- **Surface Layer:** Panels use `#121212` with varying levels of opacity to create a tiered glass effect.
- **Functional Accents:** 
  - **Primary (Lime):** Used for critical actions, active states, and focus indicators.
  - **Secondary (Cyan):** Used for technical data visualizations and secondary interactive elements.
  - **Tertiary (Purple):** Reserved for subtle decorative accents or special system notifications.
- **Borders & Grids:** A cool-toned slate `#1e293b` keeps structural elements visible but unobtrusive.

## Typography

The system utilizes **Space Grotesk** as its primary voice, offering a futuristic yet legible geometric structure. For long-form technical data and dense interfaces, **Inter** provides high-clarity utility.

**Dot-Matrix Influence:** While "DotGothic16" is specified for hero accents and badges, it should be used sparingly—only for non-essential display text like section tags or status pills—to maintain professional legibility.

**Hierarchy Rules:**
- Large display titles use tight letter spacing for a "machined" look.
- Labels and micro-copy are frequently uppercased with generous tracking to emulate technical readouts.
- All body text should adhere to a high-contrast ratio against the dark background.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop (12-column) and a **Fluid Grid** for mobile (4-column). The spacing rhythm is based on a 4px technical scale, ensuring all components align to a modular structure reminiscent of a circuit board or hardware chassis.

**Breakpoints:**
- **Mobile:** 0 - 599px (Margins: 16px, Gutters: 12px)
- **Tablet:** 600px - 1023px (Margins: 24px, Gutters: 16px)
- **Desktop:** 1024px+ (Max-width: 1440px, Margins: Auto, Gutters: 24px)

Use **md (16px)** for standard padding within cards and **lg (24px)** for section spacing to maintain the "airy" feel of premium minimalism.

## Elevation & Depth

Depth is conveyed through **Glassmorphism** and **Tonal Layering** rather than traditional shadows. 

- **Surface 0 (Base):** `#0a0a0a` flat background.
- **Surface 1 (Panels):** `#121212` with a 0.5px border of `#1e293b`.
- **Surface 2 (Floating Modals):** Semi-transparent `#121212` (80% opacity) with a `12px` background blur.
- **Interaction (Hover):** Elements do not "lift" via shadows; instead, they emit a subtle **inner glow** or a faint outer bloom using the primary color (`#a3e635`) at 15% opacity. 

A "dotted" background pattern (1px dots every 16px) is used on the Base layer to reinforce the hardware-OS aesthetic.

## Shapes

The shape language is "Soft-Technical." Elements use a consistent **0.25rem (4px)** radius for standard components, providing a precise, manufactured feel. High-level containers like main panels may use **0.5rem (8px)**, but never higher. 

Interactive elements like buttons and chips should remain strictly rectangular or slightly softened—avoiding pill shapes or high-radius circles to maintain the professional, retro-futurist vibe.

## Components

### Buttons
- **Default:** Ghost style with a 1px border (`#1e293b`) and Secondary Text.
- **Hover:** Border changes to Primary (`#a3e635`), background fills with Primary at 10% opacity, and a subtle 4px bloom effect.
- **Active:** Solid Primary fill with Black text.

### Cards
- **Structure:** 1px border (`#1e293b`), no background fill unless on a secondary surface.
- **Hover:** Border color shifts to Primary (`#a3e635`) and an extremely faint green outer glow appears.

### Status Pills
- **Style:** Small, rectangular chips with a 2px radius. 
- **Typography:** Use the accent "Dot-Matrix" style for labels.
- **Background:** Subtle tinted background (Primary, Secondary, or Accent at 10% opacity).
- **Animation:** For "Live" statuses, a 4px dot with a "ping" (expanding circle) animation is placed to the left of the label.

### Input Fields
- **Style:** Underlined or fully boxed with a thin 1px border.
- **Focus State:** Border transitions to Primary (`#a3e635`) with a slight inner glow.
- **Typography:** Uses **Inter** for technical data entry.

### Panels
- **Style:** Large containers using the Surface 2 glassmorphism rules. 
- **Motion:** Pan-in from the right or bottom with a 300ms ease-out and a subtle opacity fade.