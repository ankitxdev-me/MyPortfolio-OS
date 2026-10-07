# 11_AI_PROMPTS.md

---

# Portfolio OS AI Prompt Library

| Field | Value |
|--------|--------|
| Project | Portfolio OS |
| Version | 1.0 |
| Status | Active |
| Purpose | Standardized prompt library for designing, developing, documenting, reviewing, testing, and maintaining Portfolio OS using AI assistants. |

---

# 1. Purpose

This document defines the official prompt standards for Portfolio OS.

Its goals are to

- Standardize AI usage
- Improve development consistency
- Reduce prompt duplication
- Increase output quality
- Preserve project architecture
- Accelerate development

Every AI-generated output should follow the standards defined in this document.

---

# 2. AI Development Philosophy

AI is treated as an engineering assistant, not an autonomous developer.

Responsibilities of AI

- Generate code
- Explain architecture
- Produce documentation
- Review implementations
- Suggest improvements
- Detect inconsistencies
- Generate tests

Responsibilities of the developer

- Make final decisions
- Verify correctness
- Maintain architecture
- Review security
- Validate business logic

Human review is mandatory before accepting AI-generated output.

---

# 3. Prompt Design Principles

Every prompt should be

- Clear
- Specific
- Context-aware
- Reproducible
- Architecture-driven

Avoid vague instructions such as

```
Build this page.
```

Prefer

```
Build the Projects page using Astro, React Islands where necessary, Tailwind CSS, and shadcn/ui. Follow the design system, ensure full responsiveness, WCAG AA accessibility, and use reusable components only.
```

---

# 4. Prompt Structure

Every development prompt should include

## Objective

What should be built?

---

## Context

Where does it fit in the project?

---

## Requirements

Functional requirements.

---

## Constraints

Technical limitations.

---

## Expected Output

What AI should return.

---

## Verification

Acceptance criteria.

---

# 5. Prompt Categories

Portfolio OS organizes prompts into the following categories.

| Category | Purpose |
|----------|---------|
| Planning | Project planning |
| UI | Interface generation |
| Components | Reusable components |
| Backend | API & services |
| Database | Schema & models |
| Documentation | Markdown generation |
| Testing | Test generation |
| Review | Code reviews |
| Refactoring | Code improvements |
| Debugging | Bug analysis |
| Deployment | Production readiness |

---

# 6. Global AI Rules

Every prompt implicitly requires the AI to

- Follow project architecture.
- Use TypeScript.
- Follow the design system.
- Maintain accessibility.
- Preserve responsiveness.
- Avoid unnecessary dependencies.
- Keep components reusable.
- Follow naming conventions.
- Respect documentation standards.

These rules should not need to be repeated in every prompt.

---

# 7. Project Context Template

Every implementation prompt should begin with project context.

Template

```
Project: Portfolio OS

Framework:
Astro

UI:
React Islands

Language:
TypeScript

Styling:
Tailwind CSS

Component Library:
shadcn/ui

Authentication:
Better Auth

Database:
MongoDB Atlas

ODM:
Mongoose

Storage:
Cloudinary

Deployment:
Vercel
```

This ensures the AI has consistent architectural context.

---

# 8. Documentation Prompt Template

Objective

Create project documentation.

Requirements

- Markdown format
- Clear hierarchy
- Consistent terminology
- Examples where useful
- Production-quality writing

Output

A complete documentation section ready for inclusion in the `/docs` directory.

---

# 9. UI Generation Prompt Template

Objective

Generate a user interface.

Requirements

- Astro page
- React Islands only when interactivity is required
- Tailwind CSS
- shadcn/ui components
- Responsive
- Accessible
- Clean component structure

Expected Output

- Folder structure
- Component breakdown
- Complete implementation
- Accessibility notes

---

# 10. Component Generation Prompt

Objective

Generate a reusable component.

Requirements

- Single responsibility
- Typed props
- Reusable
- Accessible
- Responsive
- Documented

Avoid embedding business logic directly into reusable UI components.

---

# 11. Layout Generation Prompt

Objective

Generate application layouts.

Requirements

- Shared layouts
- Navigation support
- Theme compatibility
- Responsive behavior
- Slot-based composition

Layouts should maximize reuse across pages.

---

# 12. Dashboard Prompt Template

Objective

Generate dashboard pages.

Requirements

- Sidebar integration
- Responsive layout
- Consistent spacing
- Empty states
- Loading states
- Error handling
- Reusable cards
- Modular architecture

Dashboard pages should follow the design system without introducing page-specific styling hacks.

---

# 13. Form Generation Prompt

Objective

Generate forms.

Requirements

- Validation
- Accessible labels
- Error messages
- Loading states
- Success feedback
- Reusable inputs

Forms should prioritize usability and accessibility.

---

# 14. API Generation Prompt

Objective

Generate an API endpoint.

Requirements

- Astro Server Endpoint
- Input validation
- Authentication
- Authorization
- Service layer
- Repository layer
- Standard JSON responses

Business logic should remain inside services.

---

# 15. Database Prompt Template

Objective

Generate database models.

Requirements

- Mongoose
- TypeScript
- Validation
- Indexes
- Relationships
- Reusable schemas

Every schema should include timestamps and follow naming conventions.

---

# End of Part 1

---

# 16. Service Generation Prompt

## Objective

Generate a service responsible for implementing business logic.

## Requirements

- TypeScript
- Single responsibility
- No UI dependencies
- No direct HTTP handling
- Repository pattern
- Strong typing
- Error handling
- Validation support

## Responsibilities

- Business rules
- Data transformation
- Repository coordination
- Permission checks

## Expected Output

- Service class
- Public methods
- Private helper methods
- Error handling strategy

---

# 17. Repository Generation Prompt

## Objective

Generate a repository responsible for database access.

## Requirements

- Mongoose
- Typed queries
- CRUD operations
- Aggregation support
- Pagination
- Index-aware queries

Repositories should never contain business logic.

Expected Output

- Repository class
- CRUD methods
- Query helpers
- Pagination helpers

---

# 18. CRUD Module Prompt

## Objective

Generate a complete CRUD module.

Requirements

Generate

- Schema
- Types
- Repository
- Service
- API Endpoints
- Validation
- Error handling

Follow project architecture exactly.

---

# 19. Authentication Prompt

## Objective

Implement authentication.

Requirements

- Better Auth
- Protected routes
- Session validation
- Login
- Logout
- Session middleware

Do not implement authorization inside authentication.

---

# 20. Authorization Prompt

## Objective

Implement permissions.

Requirements

Current Version

Administrator only.

Future

- Administrator
- Editor
- Viewer

Permission logic should remain centralized.

---

# 21. Search Prompt

## Objective

Implement global search.

Requirements

Search

- Projects
- Blogs
- Learning
- Journey

Current Strategy

MongoDB Queries

Future

Atlas Search

Include

- Pagination
- Ranking
- Empty states

---

# 22. Media Upload Prompt

## Objective

Implement image uploads.

Requirements

- Cloudinary
- Validation
- Progress feedback
- Secure upload
- Metadata storage
- Error handling

Reject invalid file types.

---

# 23. Project Module Prompt

## Objective

Generate the Projects module.

Requirements

Generate

- Public pages
- Dashboard CRUD
- APIs
- Database model
- Services
- Repository
- Markdown support
- Image support

Features

- Featured projects
- Categories
- Technologies
- Status
- Timeline

---

# 24. Blog Module Prompt

## Objective

Generate the Blog module.

Requirements

- Markdown
- Tiptap Editor
- Slugs
- Tags
- Categories
- SEO Metadata
- Featured Image
- Draft Support

Dashboard should manage all blog content.

---

# 25. Learning Module Prompt

## Objective

Generate the Learning module.

Requirements

Support

- Courses
- Technologies
- Certificates
- Notes
- Progress Tracking
- Categories
- Filtering

Display learning as a structured timeline.

---

# 26. Journey Module Prompt

## Objective

Generate the Journey timeline.

Requirements

Support

- Milestones
- Achievements
- Failures
- Lessons Learned
- Images
- Date Ordering

Timeline should be editable from the dashboard.

---

# 27. Academics Module Prompt

## Objective

Generate the Academics module.

Requirements

Support

- Degrees
- Institutions
- CGPA
- Semester History
- Achievements
- Timeline

Dashboard should manage all academic records.

---

# 28. Freelancing Module Prompt

## Objective

Generate the Freelancing module.

Requirements

Support

- Platforms
- Projects
- Clients
- Reviews
- Revenue Statistics
- Skills Used

Include dashboard analytics where appropriate.

---

# 29. Contact Module Prompt

## Objective

Generate the Contact module.

Requirements

Public

- Contact form
- Validation
- Success feedback

Dashboard

- Message list
- Search
- Filters
- Read status
- Delete

Protect APIs against spam.

---

# 30. Settings Module Prompt

## Objective

Generate the Settings module.

Requirements

Support

- Site Settings
- SEO Settings
- Social Links
- Homepage Content
- Analytics Configuration

Settings should be editable without code changes.

---

# 31. Dashboard CRUD Prompt

## Objective

Generate dashboard CRUD functionality.

Requirements

Every CRUD page should include

- List view
- Create
- Edit
- Delete
- Search
- Filters
- Pagination
- Confirmation dialogs
- Toast notifications
- Empty states
- Loading states

Use reusable components wherever possible.

---

# 32. API Review Prompt

## Objective

Review an API implementation.

Verify

✓ REST conventions

✓ Validation

✓ Authentication

✓ Authorization

✓ Error handling

✓ Response consistency

✓ Type safety

✓ Documentation

Return a detailed review with improvement suggestions.

---

# 33. Database Review Prompt

## Objective

Review database design.

Verify

✓ Collection design

✓ Relationships

✓ Indexes

✓ Validation

✓ Naming conventions

✓ Performance

✓ Scalability

Highlight risks and recommend improvements.

---

# 34. Architecture Review Prompt

## Objective

Review implementation against project architecture.

Verify

✓ Folder structure

✓ Layer separation

✓ Reusability

✓ Naming conventions

✓ Dependency direction

✓ Documentation alignment

Report every violation with recommended fixes.

---

# 35. Security Review Prompt

## Objective

Perform a security review.

Verify

✓ Input validation

✓ Authentication

✓ Authorization

✓ Secret handling

✓ Environment variables

✓ XSS protection

✓ CSRF protection (if applicable)

✓ File upload validation

✓ Error leakage

Provide a prioritized list of findings.

---

# End of Part 2

---

# 36. UI Review Prompt

## Objective

Review a completed user interface.

Verify

✓ Matches design system

✓ Responsive

✓ Consistent spacing

✓ Typography

✓ Colors

✓ Component reuse

✓ Loading states

✓ Empty states

✓ Error states

✓ Visual hierarchy

Report every inconsistency with suggested improvements.

---

# 37. Accessibility Review Prompt

## Objective

Perform an accessibility audit.

Verify

✓ Semantic HTML

✓ Keyboard navigation

✓ Focus management

✓ Color contrast

✓ Heading hierarchy

✓ ARIA usage

✓ Form labels

✓ Alt text

✓ Screen reader compatibility

Target

```
WCAG AA
```

Provide actionable recommendations for every issue found.

---

# 38. Performance Review Prompt

## Objective

Review application performance.

Evaluate

- Bundle size
- Hydration strategy
- Rendering approach
- Image optimization
- Lazy loading
- Network requests
- JavaScript usage
- Lighthouse metrics

Recommend optimizations prioritized by impact.

---

# 39. Refactoring Prompt

## Objective

Improve an existing implementation without changing behavior.

Requirements

- Preserve functionality
- Reduce complexity
- Improve readability
- Improve maintainability
- Remove duplication
- Improve type safety

Do not introduce unnecessary abstractions.

---

# 40. Bug Investigation Prompt

## Objective

Analyze a reported issue.

Include

- Root cause
- Reproduction steps
- Impact analysis
- Recommended fix
- Potential side effects
- Regression risks

Do not propose changes before identifying the root cause.

---

# 41. Unit Test Generation Prompt

## Objective

Generate unit tests.

Requirements

Cover

- Happy path
- Validation
- Error handling
- Edge cases
- Invalid input

Use

```
Vitest
```

Tests should be deterministic and independent.

---

# 42. Component Test Prompt

## Objective

Generate component tests.

Verify

- Rendering
- User interaction
- State updates
- Accessibility
- Error states
- Loading states

Preferred Tool

```
Testing Library
```

Focus on user behavior rather than implementation details.

---

# 43. End-to-End Test Prompt

## Objective

Generate E2E tests.

Cover

- Authentication
- Dashboard
- CRUD operations
- Navigation
- Search
- Contact form
- Responsive behavior

Preferred Tool

```
Playwright
```

Critical user journeys must always have E2E coverage.

---

# 44. Documentation Generation Prompt

## Objective

Generate project documentation.

Requirements

- Markdown
- Consistent terminology
- Examples where appropriate
- Production-ready formatting
- Cross-reference related documents

Documentation should remain synchronized with implementation.

---

# 45. Documentation Review Prompt

## Objective

Review project documentation.

Verify

✓ Accuracy

✓ Completeness

✓ Consistency

✓ Terminology

✓ Examples

✓ Formatting

✓ Internal references

Highlight missing or outdated information.

---

# 46. Sprint Planning Prompt

## Objective

Plan a development sprint.

Include

- Sprint goal
- Scope
- Deliverables
- Dependencies
- Risks
- Acceptance criteria
- Estimated tasks

Output should be actionable and aligned with the project roadmap.

---

# 47. Sprint Verification Prompt

## Objective

Verify completion of a sprint.

Review

✓ Requirements

✓ Documentation

✓ UI

✓ Backend

✓ APIs

✓ Database

✓ Testing

✓ Accessibility

✓ Performance

Provide

- Pass/Fail status
- Summary
- Missing items
- Recommended fixes

---

# 48. Release Readiness Prompt

## Objective

Determine whether the project is ready for release.

Verify

✓ All planned features complete

✓ Critical bugs resolved

✓ Documentation finalized

✓ Tests passing

✓ Performance acceptable

✓ Accessibility verified

✓ Security review completed

Return a release recommendation with any blockers.

---

# 49. Deployment Review Prompt

## Objective

Review deployment configuration.

Verify

- Environment variables
- Production build
- Security headers
- Caching
- Asset optimization
- Error handling
- Analytics
- Monitoring

Recommend improvements before production deployment.

---

# 50. Final Project Audit Prompt

## Objective

Perform a complete project audit.

Review

✓ Architecture

✓ Folder structure

✓ Code quality

✓ UI consistency

✓ Documentation

✓ APIs

✓ Database

✓ Security

✓ Accessibility

✓ Performance

✓ Testing

Assign an overall project health score and provide prioritized recommendations.

---

# 51. AI Output Quality Checklist

Every AI-generated response should satisfy the following.

## Technical

✓ Correct

✓ Complete

✓ Type-safe

✓ Production-ready

---

## Architecture

✓ Follows project structure

✓ Respects layer separation

✓ Reusable

✓ Consistent naming

---

## UI

✓ Responsive

✓ Accessible

✓ Matches design system

---

## Documentation

✓ Clear

✓ Accurate

✓ Properly formatted

---

## Security

✓ Validated inputs

✓ No exposed secrets

✓ Secure defaults

---

# 52. Prompt Versioning

Prompt templates should evolve alongside the project.

Version Format

```
v1.0

v1.1

v2.0
```

Record

- Changes
- Rationale
- Date
- Author (if applicable)

Maintain backward compatibility where practical.

---

# 53. Prompt Governance

Any modification to the official prompt library should include

1. Review the existing prompt.
2. Identify the improvement.
3. Update the template.
4. Validate with real project tasks.
5. Update documentation.
6. Increment the prompt version if the change is significant.

Prompt quality should improve over time through practical usage.

---

# 54. AI Usage Guidelines

AI should be used to

- Accelerate development
- Improve consistency
- Generate documentation
- Review code
- Identify issues
- Suggest improvements

AI should not replace

- Architectural decision-making
- Security reviews
- Final testing
- Human code review
- Product decisions

The developer remains responsible for all final decisions.

---

# 55. Continuous Improvement

After each completed sprint

- Review prompt effectiveness
- Identify repetitive instructions
- Simplify prompt templates
- Remove obsolete prompts
- Add new templates for recurring tasks

The prompt library should evolve with the project's needs.

---

# 56. Conclusion

This document establishes the official AI Development Framework for Portfolio OS.

It provides standardized prompt templates for

- Planning
- Architecture
- UI development
- Backend implementation
- Database design
- Documentation
- Testing
- Reviews
- Deployment
- Quality assurance

Using these templates ensures consistent, maintainable, and production-ready AI-assisted development throughout the lifecycle of Portfolio OS.

All future AI-assisted work should reference this document to maintain architectural integrity and development quality.

---

# End of 11_AI_PROMPTS.md