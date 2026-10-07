# Portfolio OS — Development & Architecture Rules

## 1. NEVER Use Demo / Dummy Data
- **Zero hardcoding**: Do NOT create hardcoded mockup arrays, fake articles, or dummy data in the code or components.
- **Database-driven**: All content (projects, blogs, learning, milestones, etc.) must come directly from MongoDB database models/services.
- **If new data is needed**: Run direct queries/scripts to store it in the database and fetch it dynamically for the site.
- **Dynamic deletion/addition**: When a record is deleted or added in the database, the site must reflect this change immediately without being blocked or overridden by any fallback constants.

## 2. Screenshot References Are Strictly for Mobile Styles & UI Structure
- **Do NOT copy text content from reference screenshots**: The titles, dates, excerpts, or images in reference mockups are examples for styling and layout only. Never replace real database data with screenshot text.
- **Phone vs. Desktop separation**: Mobile UI reference designs (such as mobile horizontal split cards, stacked single buttons, mobile nav) apply **ONLY to mobile screens (`< 768px` / `max-md:`)**.
- **Preserve Desktop Layouts**: Desktop view (`md:` and above) must maintain its rich, multi-column desktop layout (desktop grids, multi-column hero sections, timeline widgets, sidebars). Do NOT stretch mobile layouts across large desktop viewports.

## 3. Preservation of Existing Features & Sections
- Never remove existing rich sections (e.g., project timeline widgets, system architecture docs, challenges, metrics) when optimizing for mobile. Responsive design means adapting the layout per breakpoint, not destroying existing sections or content.
