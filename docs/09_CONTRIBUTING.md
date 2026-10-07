# 09_CONTRIBUTING.md

---

# Portfolio OS Developer Handbook

| Field | Value |
|--------|--------|
| Project | Portfolio OS |
| Version | 1.0 |
| Status | Active |
| Purpose | Define development standards, coding guidelines, Git workflow, documentation practices, testing requirements, and contribution rules for Portfolio OS. |

---

# 1. Purpose

This document defines the development standards for Portfolio OS.

Every contributor should follow these guidelines to maintain a consistent, scalable, and maintainable codebase.

---

# 2. Development Philosophy

Portfolio OS follows these principles:

- Documentation First
- UI First
- Clean Architecture
- Modular Development
- Reusable Components
- Type Safety
- Accessibility
- Performance
- Security
- Continuous Improvement

---

# 3. Technology Stack

## Frontend

- Astro
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Backend

- Astro API Endpoints
- Better Auth
- MongoDB Atlas
- Mongoose

## Storage

- Cloudinary

---

# 4. Project Structure

```

src/
components/
layouts/
pages/
lib/
services/
repositories/
middleware/
types/
utils/
styles/

```

Every folder has one responsibility.

---

# 5. Coding Standards

- Use TypeScript strict mode.
- Use meaningful names.
- Avoid abbreviations.
- Keep functions small.
- Keep components focused.
- Prefer composition over inheritance.
- Avoid duplicate code.

---

# 6. Naming Conventions

Components

```

ProjectCard.tsx

```

Pages

```

projects.astro

```

Hooks

```

useProjects.ts

```

Services

```

project.service.ts

```

Repositories

```

project.repository.ts

```

Types

```

project.types.ts

```

---

# 7. Folder Rules

Each feature owns its files.

Example

```

projects/
components/
services/
types/

```

Avoid mixing unrelated features.

---

# 8. Git Workflow

Main Branch

```

main

```

Development Branch

```

develop

```

Feature Branch

```

feature/project-page

```

Bug Fix

```

fix/navbar-mobile

```

Hotfix

```

hotfix/login

```

---

# 9. Commit Convention

Examples

```

feat(projects): add project detail page

fix(blog): markdown rendering

docs(api): update specification

style(ui): improve spacing

refactor(search): optimize filtering

test(api): add project tests

```

---

# 10. Pull Request Rules

Every PR should include

- Description
- Screenshots (if UI)
- Linked Issue
- Testing Summary
- Checklist

---

# 11. Code Review Checklist

Review

- Naming
- Readability
- Performance
- Security
- Accessibility
- Type Safety
- Documentation
- Error Handling

---

# 12. Component Guidelines

Components should

- Have one responsibility.
- Accept typed props.
- Avoid unnecessary state.
- Be reusable.
- Remain presentation-focused.

---

# 13. State Management

Prefer

- Local State
- Props
- Context only when needed

Avoid unnecessary global state.

---

# 14. Styling Standards

Use

- Tailwind CSS
- Design tokens
- Shared utility classes

Avoid inline styles unless necessary.

---

# 15. Accessibility

Every page should support

- Keyboard navigation
- Focus states
- ARIA labels
- Semantic HTML
- Sufficient color contrast

---

# 16. Performance Guidelines

Optimize

- Images
- Fonts
- JavaScript
- CSS
- API calls

Lazy load where appropriate.

---

# 17. Security

Never

- Expose secrets
- Trust client input
- Skip validation
- Store credentials in code

Always validate server-side.

---

# 18. Error Handling

Errors should

- Be user-friendly
- Be logged
- Avoid exposing internal details
- Use consistent responses

---

# 19. Testing Standards

Test

- Components
- Services
- APIs
- Forms
- Authentication
- Database operations

---

# 20. Documentation Standards

Every feature requires

- Purpose
- Usage
- API changes
- Database changes
- Examples

Documentation is part of development.

---

# 21. Branch Protection

The `main` branch should

- Require pull requests
- Require review
- Require passing checks
- Prevent force pushes

---

# 22. Dependency Management

Before adding a package

- Verify necessity
- Check maintenance
- Review security
- Prefer lightweight alternatives

---

# 23. Environment Variables

Secrets belong only in

```

.env

```

Never commit

```

.env.local

.env.production

```

Provide

```

.env.example

```

---

# 24. Release Workflow

Development

↓

Review

↓

Testing

↓

Merge

↓

Deploy Preview

↓

Production

---

# 25. Troubleshooting

When debugging

- Read logs
- Reproduce issue
- Isolate cause
- Write fix
- Add tests
- Update documentation

---

# 26. Best Practices

Always

- Write readable code
- Keep files small
- Reuse components
- Validate input
- Document changes
- Test before merging

---

# 27. Things to Avoid

Avoid

- Large components
- Duplicate logic
- Magic numbers
- Deep nesting
- Unused code
- Console logs in production

---

# 28. Definition of Done

A task is complete when

- Feature works
- Tests pass
- Documentation updated
- Review approved
- No critical issues remain

---

# 29. Contribution Checklist

Before submitting

✓ Code formatted

✓ Lint passes

✓ Tests pass

✓ Documentation updated

✓ Screenshots added (UI)

✓ PR created

---

# 30. Final Notes

Portfolio OS emphasizes quality over speed.

Every contribution should improve

- Maintainability
- Readability
- Performance
- Accessibility
- Security

Following these standards ensures the project remains scalable and maintainable as it evolves.

---

---

# 31. Repository Standards

The repository should remain clean, organized, and easy to navigate.

## Root Directory

The project root should contain only essential files.

Example

```
.
├── src/
├── public/
├── docs/
├── .github/
├── package.json
├── astro.config.mjs
├── tsconfig.json
├── README.md
└── LICENSE
```

Avoid placing temporary files or experiments in the root directory.

---

# 32. Directory Ownership

Every directory has a single responsibility.

| Directory | Responsibility |
|------------|----------------|
| src/components | Shared UI Components |
| src/layouts | Application Layouts |
| src/pages | Astro Pages |
| src/lib | Shared Libraries |
| src/services | Business Logic |
| src/repositories | Database Layer |
| src/types | Type Definitions |
| src/utils | Utility Functions |
| src/styles | Global Styles |
| docs | Project Documentation |
| public | Static Assets |

Business logic should never be placed inside pages.

---

# 33. Component Architecture

Every component should satisfy the following principles.

## Single Responsibility

A component should solve one problem only.

Bad

```
DashboardComponent
```

Contains

- Authentication
- Sidebar
- API Calls
- Forms
- Charts
- Settings

Good

```
Sidebar.tsx

Navigation.tsx

ProjectCard.tsx

BlogCard.tsx
```

---

## Composition

Prefer

```
DashboardLayout

├── Sidebar

├── Header

├── MainContent

└── Footer
```

Instead of creating one massive component.

---

## Reusability

If a component can be reused twice,
move it into the shared components directory.

---

# 34. Service Layer Standards

Services contain business logic only.

Example

```
ProjectService

BlogService

LearningService

MediaService
```

Responsibilities

- Validation
- Business Rules
- Data Transformation
- Repository Calls

Services should never know about UI components.

---

# 35. Repository Layer Standards

Repositories communicate with MongoDB.

Responsibilities

- CRUD Operations
- Queries
- Aggregations
- Index Usage

Repositories should never contain business rules.

---

# 36. API Standards

Every endpoint should

- Validate input
- Authenticate requests
- Call services
- Return standardized responses

Avoid placing business logic inside API routes.

---

# 37. TypeScript Guidelines

Enable

```
strict: true
```

Always

- Define interfaces
- Avoid any
- Prefer unknown over any
- Use enums carefully
- Use readonly where appropriate

Types belong inside

```
src/types
```

---

# 38. Error Handling Standards

Errors should be predictable.

Always

- Catch expected errors
- Log unexpected errors
- Return friendly messages
- Avoid leaking internal details

Example

Good

```
Project not found.
```

Bad

```
MongoServerError...
```

---

# 39. Logging Standards

Development

- Debug logs allowed.

Production

Log only

- Errors
- Warnings
- Important events

Never log

- Passwords
- Tokens
- Secrets
- Environment variables

---

# 40. Database Standards

Collections

- Lowercase
- Plural

Fields

- camelCase

Indexes

- Explicit
- Documented

Soft delete preferred.

Never duplicate data unnecessarily.

---

# 41. Validation Standards

Every request validates

- Required fields
- Length
- Type
- Format
- Business rules

Validation always occurs before database operations.

---

# 42. Documentation Rules

Every new feature requires updates to

- Requirements
- Blueprint
- API Specification
- Database Schema
- Roadmap

Documentation is never optional.

---

# 43. Issue Management

Every issue should contain

- Description
- Expected behavior
- Actual behavior
- Steps to reproduce
- Screenshots (if UI)
- Environment

Labels

Examples

```
bug

feature

documentation

enhancement

security

performance
```

---

# 44. Feature Development Workflow

Every feature follows

```
Issue

↓

Requirements

↓

Design

↓

Documentation

↓

Development

↓

Testing

↓

Review

↓

Merge

↓

Deployment
```

---

# 45. Branch Lifecycle

```
develop

        │

feature/project-page

        │

Pull Request

        │

Review

        │

Merge into develop

        │

Release

        │

Merge into main
```

Hotfixes branch directly from

```
main
```

---

# 46. Merge Requirements

A branch may be merged only if

✓ CI passes

✓ Documentation updated

✓ Review approved

✓ No merge conflicts

✓ Tests passing

✓ Build successful

---

# 47. Pull Request Template

Every Pull Request should answer

## Summary

What changed?

---

## Motivation

Why was this needed?

---

## Testing

How was it tested?

---

## Screenshots

Required for UI changes.

---

## Documentation

What documentation changed?

---

## Checklist

✓ Lint passes

✓ Tests pass

✓ Documentation updated

✓ Ready for review

---

# 48. Security Guidelines

Never

- Hardcode secrets
- Commit API keys
- Expose internal APIs
- Disable validation

Always

- Validate inputs
- Escape output
- Sanitize data
- Use HTTPS

---

# 49. Performance Standards

Target

- Lighthouse ≥95
- Small bundles
- Lazy loading
- Optimized images
- Efficient queries

Avoid

- Unnecessary renders
- Large dependencies
- Duplicate requests

---

# 50. Accessibility Standards

Every page should support

- Keyboard navigation
- Screen readers
- Proper heading hierarchy
- Alt text
- Focus indicators
- ARIA attributes where necessary

Accessibility is considered a required feature, not an enhancement.

---

# End of Part 2

---

# 51. Continuous Integration (CI)

Every change pushed to the repository should automatically trigger the CI pipeline.

## CI Responsibilities

- Install dependencies
- Type checking
- ESLint
- Build verification
- Unit tests
- Integration tests
- Check formatting

A Pull Request cannot be merged if the CI pipeline fails.

---

# 52. Continuous Deployment (CD)

Deployment follows an automated workflow.

```
Feature Branch
        │
        ▼
Pull Request
        │
        ▼
Code Review
        │
        ▼
Merge into Develop
        │
        ▼
Preview Deployment
        │
        ▼
Manual Verification
        │
        ▼
Merge into Main
        │
        ▼
Production Deployment
```

Production deployments should only occur from the `main` branch.

---

# 53. Release Management

Each release must include:

- Version number
- Release notes
- Bug fixes
- New features
- Breaking changes (if any)
- Migration notes (if required)

Release tags should follow Semantic Versioning.

Example

```
v1.0.0

v1.1.0

v1.2.3

v2.0.0
```

---

# 54. Semantic Versioning Policy

Portfolio OS follows Semantic Versioning.

## Major Version

Breaking changes.

Example

```
1.x.x → 2.0.0
```

---

## Minor Version

New features without breaking compatibility.

Example

```
1.1.0 → 1.2.0
```

---

## Patch Version

Bug fixes.

Example

```
1.2.0 → 1.2.1
```

---

# 55. Dependency Management Policy

Dependencies should be reviewed before installation.

Checklist

✓ Active maintenance

✓ Community adoption

✓ Security history

✓ Documentation quality

✓ Bundle size

✓ License compatibility

Avoid adding dependencies for functionality that can be implemented with existing project utilities.

---

# 56. Security Response Process

When a security issue is discovered:

1. Confirm the issue.
2. Assess severity.
3. Create a private fix.
4. Test the solution.
5. Deploy the patch.
6. Document the incident.
7. Update dependencies if required.

Critical vulnerabilities should be addressed before any feature work.

---

# 57. Backup & Recovery

The project should support regular backups.

Backup Strategy

- MongoDB database backups
- Cloudinary asset backups (where applicable)
- Documentation stored in Git
- Configuration stored in version control (excluding secrets)

Recovery should prioritize preserving user-generated content.

---

# 58. Code Ownership

Every major module should have a designated owner.

Example

| Module | Owner |
|--------|-------|
| Projects | Project Maintainer |
| Blog | Project Maintainer |
| Dashboard | Project Maintainer |
| Media | Project Maintainer |
| API | Project Maintainer |

Future contributors should update ownership as the team grows.

---

# 59. Architecture Decision Records (ADR)

Major architectural decisions should be documented as ADRs.

Each ADR should include:

- ID
- Title
- Status
- Context
- Decision
- Consequences
- Alternatives Considered

Example

```
ADR-001

Title:
Use Astro as the primary framework.

Status:
Accepted

Reason:
Performance, content-first architecture, and SEO.
```

---

# 60. Documentation Review Process

Documentation should be reviewed whenever:

- A feature is added.
- An API changes.
- A database schema changes.
- Architecture changes.
- Deployment process changes.

Review Checklist

✓ Accurate

✓ Up to date

✓ Consistent

✓ Examples verified

---

# 61. New Developer Onboarding

Before contributing, every developer should:

1. Clone the repository.
2. Install dependencies.
3. Configure environment variables.
4. Read project documentation.
5. Run the development server.
6. Verify the project builds successfully.
7. Review coding standards.
8. Review the Git workflow.

---

# 62. Daily Development Checklist

Before starting work:

✓ Pull latest changes

✓ Install updated dependencies

✓ Verify build

✓ Read assigned issue

✓ Confirm requirements

✓ Review related documentation

---

# 63. Pre-Commit Checklist

Before every commit:

✓ Code formatted

✓ ESLint passes

✓ Type checking passes

✓ Build succeeds

✓ Tests pass

✓ Documentation updated

✓ No debugging code remains

✓ No secrets committed

---

# 64. Pre-Pull Request Checklist

Before opening a Pull Request:

✓ Branch rebased

✓ Merge conflicts resolved

✓ Screenshots added (UI)

✓ Feature tested

✓ Documentation updated

✓ Commit messages cleaned

✓ CI passes locally (where possible)

---

# 65. Pre-Release Checklist

Before releasing a new version:

✓ All planned features completed

✓ All critical bugs resolved

✓ Documentation finalized

✓ Performance reviewed

✓ Accessibility reviewed

✓ Security review completed

✓ Release notes prepared

✓ Version updated

---

# 66. Coding Anti-Patterns

Avoid the following:

- God components
- God services
- Duplicate business logic
- Circular dependencies
- Hardcoded configuration
- Deeply nested conditionals
- Long parameter lists
- Global mutable state
- Unused dependencies
- Dead code

Refactor whenever these patterns appear.

---

# 67. Project Terminology

| Term | Meaning |
|------|---------|
| Feature | A user-facing capability |
| Module | A major section of the application |
| Component | A reusable UI element |
| Service | Business logic layer |
| Repository | Database access layer |
| API Route | HTTP endpoint |
| ADR | Architecture Decision Record |
| Sprint | A planned development iteration |
| Milestone | A significant project goal |

Using consistent terminology improves communication and documentation.

---

# 68. Contribution Principles

Every contribution should strive to improve:

- Readability
- Maintainability
- Performance
- Accessibility
- Security
- Documentation
- Testability
- Scalability

Quality takes priority over speed.

---

# 69. Final Developer Checklist

Before considering any task complete:

## Code

✓ Clean

✓ Readable

✓ Reusable

✓ Typed

---

## UI

✓ Responsive

✓ Accessible

✓ Consistent

---

## Backend

✓ Validated

✓ Secure

✓ Tested

---

## Documentation

✓ Updated

✓ Reviewed

---

## Git

✓ Clean history

✓ Meaningful commits

✓ Pull Request approved

---

## Deployment

✓ CI Passed

✓ Build Passed

✓ Release Ready

---

# 70. Conclusion

This document establishes the engineering standards for Portfolio OS.

It defines:

- Development workflow
- Repository organization
- Coding standards
- Git conventions
- Review process
- Security practices
- Testing requirements
- Release workflow
- Documentation standards
- Long-term maintenance

Every contributor is expected to follow these guidelines to ensure the project remains consistent, maintainable, scalable, and production-ready.

This document should evolve alongside the project and be updated whenever development practices change.

---

# End of 09_CONTRIBUTING.md