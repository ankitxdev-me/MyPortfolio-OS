# 04_DESIGN_SYSTEM.md

---

# Portfolio OS Design System

| Field | Value |
|--------|--------|
| Project | Portfolio OS |
| Version | 1.0 |
| Status | Planning |
| Purpose | Define the visual language, design principles, reusable components, interaction patterns, and accessibility standards for Portfolio OS. |

---

# 1. Design Philosophy

Portfolio OS is not designed as a traditional portfolio website.

It should feel like a premium software product.

The design should communicate:

- Professionalism
- Engineering Quality
- Simplicity
- Confidence
- Long-Term Maintainability

Every page should look like it belongs to the same product ecosystem.

---

# 2. Design Principles

## Simplicity

Remove unnecessary visual noise.

---

## Consistency

The same interaction should always produce the same result.

---

## Hierarchy

Guide the user's attention using spacing, typography, and contrast instead of decoration.

---

## Accessibility

Design for everyone.

Accessibility is a requirement, not an enhancement.

---

## Performance

Avoid heavy effects that reduce responsiveness.

---

## Scalability

Every component should support future expansion without redesign.

---

# 3. Visual Identity

## Style

Modern SaaS

Minimal

Premium

Dark First

Developer Focused

---

## Brand Personality

Professional

Technical

Clean

Confident

Reliable

---

# 4. Color System

## Primary Accent

Orange

Purpose

- Primary CTA
- Links
- Highlights
- Active Navigation

---

## Background Levels

Level 1

Application Background

---

Level 2

Surface

---

Level 3

Cards

---

Level 4

Hover

---

## Semantic Colors

Success

Warning

Danger

Info

Neutral

Semantic colors must never replace the primary brand color.

---

# 5. Typography

Only one font family should be used across the application.

Hierarchy

Display

Heading 1

Heading 2

Heading 3

Heading 4

Body Large

Body

Small

Caption

Code

---

## Typography Rules

Maximum readability

Consistent spacing

Avoid excessive font weights

Avoid decorative fonts

---

# 6. Spacing System

Use a consistent spacing scale.

Spacing must be predictable.

Never use arbitrary spacing values.

Applications

Page Padding

Section Gap

Card Padding

Grid Gap

Button Padding

Input Padding

---

# 7. Layout System

Maximum Content Width

Container

Section

Grid

Sidebar

Dashboard Layout

Public Layout

---

Responsive Layouts

Mobile

Tablet

Laptop

Desktop

Ultra-wide

---

# 8. Border Radius

Small

Medium

Large

Extra Large

Full

Every component must use predefined radius values.

---

# 9. Shadows

Small

Medium

Large

Focus Shadow

Avoid excessive shadow usage.

---

# 10. Icons

Use a single icon library.

Icons should:

- Match line thickness
- Be visually balanced
- Never mix icon styles

---

# 11. Buttons

Variants

Primary

Secondary

Outline

Ghost

Icon

Danger

Sizes

Small

Medium

Large

States

Default

Hover

Active

Focus

Disabled

Loading

---

# 12. Inputs

Supported Components

Text Input

Textarea

Select

Checkbox

Radio

Switch

Date Picker

File Upload

Search

Password

All inputs follow identical spacing and interaction rules.

---

# 13. Cards

Supported Cards

Project Card

Blog Card

Learning Card

Journey Card

Statistics Card

Feature Card

Every card shares

Border Radius

Spacing

Typography

Hover Animation

---

# 14. Navigation

Desktop Navigation

Mobile Navigation

Sidebar

Breadcrumb

Pagination

Tabs

Dropdown

All navigation components must behave consistently.

---

# 15. Tables

Dashboard tables must support

Sorting

Filtering

Searching

Pagination

Responsive Overflow

---

# 16. Modals

Confirmation

Delete

Preview

Image Viewer

Form Dialog

Rules

No nested modals

Escape closes modal

Focus trap required

---

# 17. Notifications

Toast

Alert

Banner

Empty State

Error State

Success State

Loading State

Skeleton

---

# 18. Forms

Forms should provide

Immediate validation

Clear error messages

Required field indicators

Keyboard accessibility

Loading feedback

---

# 19. Motion System

Motion should support usability.

Never animate purely for decoration.

Supported Motion

Fade

Slide

Scale

Expand

Collapse

Drawer

Modal

Hover

Loading

---

## Motion Rules

Duration should remain short.

Avoid distracting animations.

Animations should never block interaction.

---

# 20. Images

Images should support

Lazy Loading

Responsive Sizes

Fallback

Placeholder

Consistent Aspect Ratio

---

# 21. Code Blocks

Support

Syntax Highlighting

Copy Button

Filename

Line Numbers (Optional)

Horizontal Scroll

---

# 22. Markdown Content

Markdown Renderer must support

Headings

Lists

Tables

Images

Code

Blockquotes

Links

Callouts

Embeds

---

# 23. Charts

Charts should remain minimal.

Supported

Line

Bar

Area

Pie

Progress

Examples

Learning Progress

CGPA

Project Progress

---

# 24. Accessibility Standards

Every page must satisfy

Keyboard Navigation

Screen Reader Support

Semantic HTML

ARIA Labels

Color Contrast

Focus Visibility

Reduced Motion Support

---

# 25. Responsive Design Rules

Breakpoints

Mobile

Tablet

Laptop

Desktop

Ultra-wide

Every component must support all breakpoints.

---

# 26. Reusable Components

UI-001 Navigation

UI-002 Hero

UI-003 Project Card

UI-004 Blog Card

UI-005 Learning Card

UI-006 Timeline

UI-007 Gallery

UI-008 Statistics Card

UI-009 CTA Section

UI-010 Markdown Viewer

UI-011 Search

UI-012 Filter

UI-013 Tag

UI-014 Badge

UI-015 Pagination

UI-016 Breadcrumb

UI-017 Modal

UI-018 Toast

UI-019 Empty State

UI-020 Loading Skeleton

Component IDs must remain stable across project versions.

---

# 27. Design Quality Checklist

Every screen must satisfy

✓ Consistent spacing

✓ Typography hierarchy

✓ Responsive layout

✓ Accessibility

✓ Animation quality

✓ Visual consistency

✓ Performance

✓ Dark mode support

✓ Component reuse

---

# 28. Future Design Enhancements

Version 2+

Light Theme

Custom Themes

Reduced Motion Preferences

Advanced Charts

Glassmorphism Experiments

Micro-interactions

AI Personalization

---

# 29. Dependencies

Depends On

00_PRODUCT_REQUIREMENTS.md

01_PROJECT_DECISIONS.md

02_MASTER_BLUEPRINT.md

03_UI_ROADMAP.md

Next Document

05_SYSTEM_ARCHITECTURE.md

---

---

# 4.1 Design Tokens

Design Tokens are the single source of truth for all visual values.

No component should contain hardcoded design values.

Design Tokens are mapped directly to the Tailwind theme configuration.

---

## Color Tokens

Primary

```
color.primary
color.primary.hover
color.primary.active
```

Background

```
color.background
color.surface
color.card
color.overlay
```

Text

```
color.text.primary
color.text.secondary
color.text.muted
```

Border

```
color.border.default
color.border.hover
color.border.focus
```

Status

```
color.success
color.warning
color.danger
color.info
```

---

## Typography Tokens

```
font.display
font.heading
font.body
font.code
```

---

## Font Size Tokens

```
text.display
text.h1
text.h2
text.h3
text.h4
text.body-lg
text.body
text.small
text.caption
```

---

## Spacing Tokens

```
space.1
space.2
space.3
space.4
space.5
space.6
space.8
space.10
space.12
space.16
space.20
space.24
```

---

## Radius Tokens

```
radius.sm
radius.md
radius.lg
radius.xl
radius.full
```

---

## Shadow Tokens

```
shadow.sm
shadow.md
shadow.lg
shadow.focus
```

---

## Motion Tokens

```
duration.fast

duration.normal

duration.slow

ease.standard

ease.emphasized
```

---

# 13.1 Component Anatomy

Every reusable component has a documented internal structure.

---

## Hero Component

```
Background

↓

Badge

↓

Heading

↓

Subtitle

↓

CTA Buttons

↓

Statistics

↓

Social Links
```

---

## Project Card

```
Thumbnail

↓

Status Badge

↓

Title

↓

Description

↓

Technology Chips

↓

Progress

↓

CTA
```

---

## Blog Card

```
Cover Image

↓

Category

↓

Title

↓

Description

↓

Reading Time

↓

Published Date

↓

CTA
```

---

## Learning Card

```
Category

↓

Progress

↓

Resources

↓

Related Project

↓

CTA
```

---

## Timeline Entry

```
Date

↓

Status

↓

Title

↓

Description

↓

Images

↓

Resources

↓

Related Blog
```

---

## Statistics Card

```
Icon

↓

Value

↓

Label

↓

Trend Indicator
```

---

## Gallery Item

```
Preview

↓

Caption

↓

Expand Action
```

---

## Contact Form

```
Name

↓

Email

↓

Subject

↓

Message

↓

Submit Button
```

---

# 13.2 Interaction States Matrix

Every interactive component supports predefined states.

| Component | Default | Hover | Focus | Active | Disabled | Loading |
|------------|---------|--------|--------|---------|----------|----------|
| Button | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Input | ✓ | ✓ | ✓ | — | ✓ | — |
| Card | ✓ | ✓ | — | — | — | — |
| Dropdown | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Modal | ✓ | — | ✓ | — | — | — |
| Tabs | ✓ | ✓ | ✓ | ✓ | — | — |
| Sidebar Item | ✓ | ✓ | ✓ | ✓ | — | — |
| Pagination | ✓ | ✓ | ✓ | ✓ | ✓ | — |

---

## Interaction Rules

Hover should indicate interactivity.

Focus must always remain visible.

Loading must disable repeated actions.

Disabled elements should remain readable.

Animations must never delay interaction.

---

# 24.1 Component Accessibility Requirements

Accessibility requirements are defined per reusable component.

---

## Navigation

Requirements

- Keyboard Navigation
- Visible Focus Indicator
- ARIA Labels
- Semantic Navigation Element
- Skip to Content Link

---

## Buttons

Requirements

- Minimum touch target
- Accessible labels
- Focus outline
- Keyboard activation

---

## Forms

Requirements

- Labels associated with inputs
- Validation messages
- Required field indicators
- Keyboard navigation
- Autofill support

---

## Cards

Requirements

- Semantic heading hierarchy
- Logical reading order
- Keyboard support when clickable

---

## Modal

Requirements

- Focus Trap
- Escape closes dialog
- Restore focus on close
- Screen reader announcement

---

## Tables

Requirements

- Column headers
- Sort announcements
- Responsive scrolling
- Keyboard navigation

---

## Timeline

Requirements

- Chronological reading order
- Semantic date elements
- Screen-reader-friendly labels

---

## Charts

Requirements

- Text summary
- Accessible legends
- High contrast
- Keyboard accessibility where interactive

---

## Images

Requirements

- Meaningful alt text
- Decorative images marked appropriately
- Lazy loading
- Responsive sizing

---

## Markdown Content

Requirements

- Proper heading hierarchy
- Accessible code blocks
- Link descriptions
- Table accessibility 

-----

# 31. Design Review Checklist

Every new screen must pass the following review.

## Visual

✓ Correct spacing

✓ Typography hierarchy

✓ Color consistency

✓ Icon consistency

✓ Alignment

✓ Grid compliance

---

## Interaction

✓ Hover states

✓ Focus states

✓ Loading states

✓ Empty states

✓ Error states

---

## Responsive

✓ Mobile

✓ Tablet

✓ Laptop

✓ Desktop

✓ Ultra-wide

---

## Accessibility

✓ Keyboard navigation

✓ Screen reader compatibility

✓ Color contrast

✓ Focus visibility

✓ Semantic HTML

---

## Performance

✓ Optimized images

✓ No layout shifts

✓ Minimal animation cost

✓ Reusable components

---

A screen cannot be marked as complete until every checklist item passes review.


---

# 4.1 Design Tokens

Design Tokens are the single source of truth for all visual values.

No component should contain hardcoded design values.

Design Tokens are mapped directly to the Tailwind theme configuration.

---

## Color Tokens

Primary

```
color.primary
color.primary.hover
color.primary.active
```

Background

```
color.background
color.surface
color.card
color.overlay
```

Text

```
color.text.primary
color.text.secondary
color.text.muted
```

Border

```
color.border.default
color.border.hover
color.border.focus
```

Status

```
color.success
color.warning
color.danger
color.info
```

---

## Typography Tokens

```
font.display
font.heading
font.body
font.code
```

---

## Font Size Tokens

```
text.display
text.h1
text.h2
text.h3
text.h4
text.body-lg
text.body
text.small
text.caption
```

---

## Spacing Tokens

```
space.1
space.2
space.3
space.4
space.5
space.6
space.8
space.10
space.12
space.16
space.20
space.24
```

---

## Radius Tokens

```
radius.sm
radius.md
radius.lg
radius.xl
radius.full
```

---

## Shadow Tokens

```
shadow.sm
shadow.md
shadow.lg
shadow.focus
```

---

## Motion Tokens

```
duration.fast

duration.normal

duration.slow

ease.standard

ease.emphasized
```

---

# 13.1 Component Anatomy

Every reusable component has a documented internal structure.

---

## Hero Component

```
Background

↓

Badge

↓

Heading

↓

Subtitle

↓

CTA Buttons

↓

Statistics

↓

Social Links
```

---

## Project Card

```
Thumbnail

↓

Status Badge

↓

Title

↓

Description

↓

Technology Chips

↓

Progress

↓

CTA
```

---

## Blog Card

```
Cover Image

↓

Category

↓

Title

↓

Description

↓

Reading Time

↓

Published Date

↓

CTA
```

---

## Learning Card

```
Category

↓

Progress

↓

Resources

↓

Related Project

↓

CTA
```

---

## Timeline Entry

```
Date

↓

Status

↓

Title

↓

Description

↓

Images

↓

Resources

↓

Related Blog
```

---

## Statistics Card

```
Icon

↓

Value

↓

Label

↓

Trend Indicator
```

---

## Gallery Item

```
Preview

↓

Caption

↓

Expand Action
```

---

## Contact Form

```
Name

↓

Email

↓

Subject

↓

Message

↓

Submit Button
```

---

# 13.2 Interaction States Matrix

Every interactive component supports predefined states.

| Component | Default | Hover | Focus | Active | Disabled | Loading |
|------------|---------|--------|--------|---------|----------|----------|
| Button | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Input | ✓ | ✓ | ✓ | — | ✓ | — |
| Card | ✓ | ✓ | — | — | — | — |
| Dropdown | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| Modal | ✓ | — | ✓ | — | — | — |
| Tabs | ✓ | ✓ | ✓ | ✓ | — | — |
| Sidebar Item | ✓ | ✓ | ✓ | ✓ | — | — |
| Pagination | ✓ | ✓ | ✓ | ✓ | ✓ | — |

---

## Interaction Rules

Hover should indicate interactivity.

Focus must always remain visible.

Loading must disable repeated actions.

Disabled elements should remain readable.

Animations must never delay interaction.

---

# 24.1 Component Accessibility Requirements

Accessibility requirements are defined per reusable component.

---

## Navigation

Requirements

- Keyboard Navigation
- Visible Focus Indicator
- ARIA Labels
- Semantic Navigation Element
- Skip to Content Link

---

## Buttons

Requirements

- Minimum touch target
- Accessible labels
- Focus outline
- Keyboard activation

---

## Forms

Requirements

- Labels associated with inputs
- Validation messages
- Required field indicators
- Keyboard navigation
- Autofill support

---

## Cards

Requirements

- Semantic heading hierarchy
- Logical reading order
- Keyboard support when clickable

---

## Modal

Requirements

- Focus Trap
- Escape closes dialog
- Restore focus on close
- Screen reader announcement

---

## Tables

Requirements

- Column headers
- Sort announcements
- Responsive scrolling
- Keyboard navigation

---

## Timeline

Requirements

- Chronological reading order
- Semantic date elements
- Screen-reader-friendly labels

---

## Charts

Requirements

- Text summary
- Accessible legends
- High contrast
- Keyboard accessibility where interactive

---

## Images

Requirements

- Meaningful alt text
- Decorative images marked appropriately
- Lazy loading
- Responsive sizing

---

## Markdown Content

Requirements

- Proper heading hierarchy
- Accessible code blocks
- Link descriptions
- Table accessibility

# End of Document
