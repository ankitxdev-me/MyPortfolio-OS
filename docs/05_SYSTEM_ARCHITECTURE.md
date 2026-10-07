# 05_SYSTEM_ARCHITECTURE.md

---

# Portfolio OS System Architecture

| Field | Value |
|--------|--------|
| Project | Portfolio OS |
| Version | 1.0 |
| Status | Planning |
| Purpose | Define the complete software architecture, module organization, rendering strategy, data flow, authentication, and deployment architecture for Portfolio OS. |

---

# 1. Architecture Goals

The architecture should satisfy the following goals.

- Simplicity
- Scalability
- Maintainability
- Performance
- Type Safety
- SEO
- Security
- Reusability

The architecture should remain understandable even as the application grows.

---

# 2. High-Level Architecture

Portfolio OS consists of a single application.

```
                Portfolio OS
                      │
      ┌───────────────┴───────────────┐
      │                               │
 Public Website                 Dashboard (CMS)
      │                               │
      └───────────────┬───────────────┘
                      │
             Astro Server Endpoints
                      │
             Business Service Layer
                      │
              Database Layer
          ┌───────────┴───────────┐
          │                       │
      MongoDB Atlas         Cloudinary
```

There are **no separate frontend and backend deployments**.

Everything exists inside one application.

---

# 3. Technology Stack

## Frontend

- Astro
- React (Islands)
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## Backend

- Astro Server Endpoints
- TypeScript

---

## Authentication

- Better Auth

---

## Database

- MongoDB Atlas

---

## Media Storage

- Cloudinary

---

## Rich Text

- Tiptap Editor
- Markdown Output

---

## Deployment

- Vercel
- Cloudflare Pages (Future Support)

---

# 4. Architectural Principles

## Single Application

Only one deployable application exists.

---

## Server First

Render as much as possible on the server.

---

## Islands Architecture

React is only used where interactivity is required.

Examples

- Dashboard
- Forms
- Rich Editor
- Charts
- Search
- Filters

Static pages remain pure Astro.

---

## Separation of Concerns

Every layer has one responsibility.

```
Presentation

↓

Business Logic

↓

Data Access

↓

Storage
```

---

# 5. Folder Architecture

```
src/

├── components/
│
├── layouts/
│
├── pages/
│
├── content/
│
├── services/
│
├── repositories/
│
├── lib/
│
├── middleware/
│
├── hooks/
│
├── utils/
│
├── types/
│
├── config/
│
├── constants/
│
├── styles/
│
└── assets/
```

Each directory has a single responsibility.

---

# 6. Module Architecture

Every feature module follows the same structure.

```
Project

UI

↓

Business Logic

↓

Repository

↓

Database
```

The same architecture applies to

- Blog
- Learning
- Journey
- Academics
- Freelancing

---

# 7. Rendering Strategy

Portfolio OS uses hybrid rendering.

## Static Rendering

- Homepage
- Blog
- Projects
- Learning

---

## Server Rendering

Dashboard

Authentication

Forms

Search Results

---

## Client Rendering

React Islands

Examples

Editor

Charts

Filters

Search

Media Upload

---

# 8. Routing Architecture

Public Routes

```
/

projects

projects/[slug]

blog

blog/[slug]

learning

journey

academics

freelancing

contact
```

---

Dashboard Routes

```
/dashboard

/dashboard/projects

/dashboard/blogs

/dashboard/learning

/dashboard/journey

/dashboard/academics

/dashboard/freelancing

/dashboard/media

/dashboard/settings
```

---

# 9. Authentication Flow

Visitor

↓

Public Website

↓

No Authentication Required

Administrator

↓

Login

↓

Better Auth

↓

Session Validation

↓

Dashboard

Protected routes require authentication.

---

# 10. Authorization

Role

Administrator

Permissions

Full Content Management

Version 1 supports a single administrator.

Future versions may introduce additional roles.

---

# 11. Data Flow

```
Dashboard

↓

Validation

↓

Service Layer

↓

Repository

↓

MongoDB

↓

Response

↓

UI Update
```

Business logic must never exist inside UI components.

---

# 12. Service Layer

Purpose

Centralize business logic.

Responsibilities

Validation

Transformation

Business Rules

Permissions

Error Handling

Services never access UI directly.

---

# 13. Repository Layer

Purpose

Abstract database operations.

Responsibilities

Create

Read

Update

Delete

Search

Repositories communicate only with MongoDB.

---

# 14. Media Architecture

All uploaded media is stored in Cloudinary.

MongoDB stores only metadata.

```
Upload

↓

Cloudinary

↓

Image URL

↓

MongoDB

↓

Public Website
```

No binary media is stored in MongoDB.

---

# 15. Content Pipeline

```
Dashboard

↓

Tiptap

↓

Markdown

↓

Service Layer

↓

MongoDB

↓

Astro Renderer

↓

HTML
```

Markdown is the canonical content format.

---

# 16. Search Architecture

Version 1

Database search

Version 2

Dedicated search indexing if required.

---

# 17. Error Handling

Three levels

UI Errors

↓

Service Errors

↓

Infrastructure Errors

Each level provides meaningful feedback.

---

# 18. Logging Strategy

Development

Detailed logging

Production

Warnings

Errors

Audit events for administrative actions.

Sensitive information must never be logged.

---

# 19. Security Principles

Authentication required for dashboard.

Input validation on all server endpoints.

Output encoding.

CSRF protection where applicable.

Secure HTTP headers.

Rate limiting for administrative endpoints.

Environment variables for secrets.

---

# 20. Configuration

Configuration must never be hardcoded.

Examples

Database

Cloudinary

Authentication

Analytics

SEO

Configuration is environment-driven.

---

# 21. Performance Strategy

Static generation where possible.

Lazy loading for media.

Image optimization.

Minimal JavaScript.

Code splitting.

Component reuse.

---

# 22. Scalability

Architecture should support future expansion.

Potential additions

- Newsletter
- Analytics
- AI Assistant
- Search Engine
- Multiple Administrators
- API Integrations

Expansion should not require restructuring the application.

---

# 23. Deployment Architecture

```
GitHub

↓

Vercel

↓

Astro Application

↓

MongoDB Atlas

↓

Cloudinary
```

Deployment remains a single pipeline.

---

# 24. Development Rules

Business logic never belongs inside UI.

Database access never belongs inside pages.

Repositories never know about UI.

Services never render HTML.

Pages never access MongoDB directly.

Every feature follows the same architecture.

---

# 25. Quality Checklist

Every feature must satisfy

✓ Type Safety

✓ Reusable Components

✓ Error Handling

✓ Validation

✓ Documentation

✓ Security

✓ Performance

✓ Accessibility

✓ Testability

---

# 26. Dependencies

Depends On

- 00_PRODUCT_REQUIREMENTS.md
- 01_PROJECT_DECISIONS.md
- 02_MASTER_BLUEPRINT.md
- 03_UI_ROADMAP.md
- 04_DESIGN_SYSTEM.md

Next Document

06_DATABASE_SCHEMA.md

---


# 27. Dependency Rules

Portfolio OS follows strict dependency rules.

Allowed Dependencies

```
Pages
    ↓
Layouts
    ↓
Components
    ↓
Services
    ↓
Repositories
    ↓
Database
```

Forbidden Dependencies

❌ Pages → Database

❌ Components → Database

❌ Components → Repository

❌ Layouts → Repository

❌ Pages → MongoDB

❌ UI → Business Logic

Architecture must always flow downward.

Circular dependencies are prohibited.

-----
# 28. Request Lifecycle

Every request follows the same lifecycle.

```
Browser

↓

Astro Route

↓

Middleware

↓

Authentication

↓

Validation

↓

Business Service

↓

Repository

↓

MongoDB

↓

Response Formatter

↓

Browser
```

No step should be skipped.

-------

# 29. Error Response Standard

Successful Response

```
Success

↓

Data

↓

Metadata

↓

Message
```

Error Response

```
Error

↓

Status Code

↓

Error Code

↓

Message

↓

Details
```

Every endpoint follows the same response format.

-----
# 30. Environment Variables

All configuration values are loaded from environment variables.

Examples

Database

Authentication

Cloudinary

Analytics

Email Service

Site URL

Application Secrets

No secrets may be committed to version control.

A `.env.example` file must document every required variable.


-----

# 31. Caching Strategy

Caching Strategy

Browser Cache

↓

CDN Cache

↓

Astro Static Pages

↓

Database Queries (Future)

Version 1 keeps caching simple.

Future versions may introduce application-level caching where justified.

------
# 32. File Organization Rules

Every file should have a single responsibility.

Rules

- One component per file
- One service per file
- One repository per file
- One type per file where practical
- Avoid files that grow excessively large

Shared logic belongs in shared modules.

Feature-specific logic stays inside the feature.

------


# 33. Architecture Decision Records

Major architectural decisions are recorded here.

| ADR | Decision | Reason |
|------|----------|--------|
| ADR-001 | Astro | Better SEO and simplified architecture |
| ADR-002 | React Islands | Minimize client-side JavaScript |
| ADR-003 | MongoDB Atlas | Flexible content model |
| ADR-004 | Cloudinary | Optimized media delivery |
| ADR-005 | Better Auth | Unified authentication |
| ADR-006 | Markdown Content | Portable and version-friendly |
| ADR-007 | Single Deployment | Reduced operational complexity |

Future architectural changes should be documented as new ADR entries rather than replacing existing decisions.



-----

# 34. Scalability Roadmap

Version 1

- Single Administrator
- Astro Server Endpoints
- MongoDB Atlas
- Cloudinary

Version 2

- Multiple Administrators
- Newsletter
- Full-text Search
- Analytics Dashboard
- API Integrations

Version 3

- Team Collaboration
- Plugin System
- AI Assistant
- Public API

The architecture should support these enhancements without requiring a complete redesign.


----

# 35. System Sequence Diagram

Publishing a Blog

```
Administrator

↓

Dashboard

↓

Blog Editor

↓

Validation

↓

Blog Service

↓

Blog Repository

↓

MongoDB

↓

Success Response

↓

Dashboard Refresh

↓

Public Website
```

Uploading an Image

```
Dashboard

↓

Cloudinary

↓

Image URL

↓

MongoDB

↓

Markdown Content

↓

Public Website
```

Viewing a Project

```
Visitor

↓

Astro Page

↓

Project Service

↓

MongoDB

↓

Rendered HTML

↓

Browser
```
# End of Document