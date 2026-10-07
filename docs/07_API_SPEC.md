# 07_API_SPEC.md

---

# Portfolio OS API Specification

| Field | Value |
|--------|--------|
| Project | Portfolio OS |
| Version | 1.0 |
| Status | Planning |
| Purpose | Define every API endpoint, request/response contract, authentication, validation, security, and communication standard for Portfolio OS. |

---

# 1. API Philosophy

Portfolio OS uses APIs as the communication layer between the frontend and backend.

Although the project uses Astro Server Endpoints instead of a standalone backend framework, every endpoint is documented as a REST API.

Benefits

- Clear separation of concerns
- Consistent request handling
- Easier maintenance
- Easier testing
- Future API expansion
- Better documentation

The frontend should never communicate directly with the database.

---

# 2. API Design Principles

Every endpoint must follow these principles.

## Simplicity

Each endpoint performs one responsibility only.

---

## Consistency

All endpoints follow identical conventions.

Request format

Response format

Error format

Authentication

Validation

---

## Predictability

The same action should always produce the same type of response.

---

## Security

Authentication is mandatory for protected resources.

Input validation is required before business logic.

---

## Scalability

New endpoints should integrate without breaking existing clients.

---

# 3. API Standards

## Base URL

```
/api
```

Examples

```
/api/projects

/api/blogs

/api/media

/api/contact
```

---

## Content Type

Every request and response uses

```
application/json
```

File uploads use

```
multipart/form-data
```

---

## Character Encoding

UTF-8

---

## Time Format

ISO 8601

Example

```
2026-07-25T15:30:00Z
```

---

## Slugs

All slugs

- lowercase
- unique
- URL-safe

Example

```
portfolio-os

telegram-admin-api
```

---

# 4. API Versioning

Current Version

```
v1
```

Version 1 does not expose versioned URLs.

Future versions may use

```
/api/v2/
```

Breaking changes require a new version.

---

# 5. Authentication

Public APIs

No authentication required.

Dashboard APIs

Authentication required.

Authentication Provider

```
Better Auth
```

Session validation occurs before endpoint execution.

---

# 6. Authorization

Version 1 supports one administrator.

Protected endpoints require

Authenticated Administrator

Public visitors have read-only access.

Future roles

- Administrator
- Editor
- Viewer

---

# 7. Request Lifecycle

Every request follows the same flow.

```
Browser

↓

Astro API Route

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

No layer may be skipped.

---

# 8. API Layer Responsibilities

## API Route

Responsibilities

Receive request

Validate method

Call service

Return response

---

## Service Layer

Responsibilities

Business rules

Validation

Transformation

Permissions

---

## Repository Layer

Responsibilities

Database operations

CRUD

Queries

Indexes

---

## Database

Persistent storage only.

Business logic must never exist here.

---

# 9. HTTP Methods

GET

Retrieve resources.

---

POST

Create resources.

---

PATCH

Update existing resources.

---

DELETE

Archive resources.

Version 1 uses soft delete.

---

# 10. Response Standard

Every successful request follows the same structure.

```json
{
  "success": true,
  "message": "Project created successfully.",
  "data": {},
  "meta": {}
}
```

---

Fields

success

Boolean

---

message

Human-readable message.

---

data

Primary response payload.

---

meta

Pagination

Statistics

Counts

Future metadata

---

# 11. Error Response Standard

Errors always return the same structure.

```json
{
  "success": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "The requested project does not exist.",
    "details": null
  }
}
```

---

Fields

success

Always false.

---

code

Machine-readable error identifier.

---

message

Human-readable explanation.

---

details

Optional debugging information.

---

# 12. Standard Error Codes

Authentication

```
AUTH_REQUIRED

INVALID_SESSION

SESSION_EXPIRED
```

---

Authorization

```
UNAUTHORIZED

FORBIDDEN
```

---

Validation

```
VALIDATION_ERROR

INVALID_INPUT

DUPLICATE_SLUG

INVALID_FILE
```

---

Resources

```
PROJECT_NOT_FOUND

BLOG_NOT_FOUND

MEDIA_NOT_FOUND

LEARNING_NOT_FOUND

JOURNEY_NOT_FOUND
```

---

Infrastructure

```
DATABASE_ERROR

UPLOAD_FAILED

UNKNOWN_ERROR
```

---

# 13. HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 201 | Resource Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Failed |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

# 14. API Naming Convention

Endpoints use

Plural nouns

Examples

```
/api/projects

/api/blogs

/api/media
```

Avoid

```
/api/getProjects

/api/createBlog
```

Use HTTP methods instead.

---

# 15. Endpoint Design Rules

Each endpoint

- Has one responsibility
- Returns one resource type
- Uses consistent naming
- Supports validation
- Returns predictable responses

Endpoints should remain RESTful.

---

# 16. API Documentation Standard

Every endpoint must document

Purpose

Authentication

Method

Endpoint

Parameters

Request Body

Validation Rules

Success Response

Error Responses

Example Request

Example Response

---

# 17. Security Principles

Every endpoint must

Validate all input.

Sanitize user data.

Never expose internal fields.

Prevent mass assignment.

Validate permissions.

Use HTTPS.

Avoid detailed internal error messages.

---

# 18. Logging

Development

Verbose logs

Production

Errors

Warnings

Administrative actions

Sensitive information must never be logged.

---

# 19. Future Compatibility

The API should support future additions without redesign.

Examples

- Public API Keys
- GraphQL
- Mobile Client
- Webhooks
- Plugin Integrations

---

# 20. Dependencies

Depends On

00_PRODUCT_REQUIREMENTS.md

01_PROJECT_DECISIONS.md

02_MASTER_BLUEPRINT.md

03_UI_ROADMAP.md

04_DESIGN_SYSTEM.md

05_SYSTEM_ARCHITECTURE.md

06_DATABASE_SCHEMA.md

Next Sections

- Public APIs
- Dashboard APIs
- CRUD Endpoints
- Media Upload
- Search
- Validation Rules
- Pagination
- Security
- Testing

---

# End of Part 1

---

# 21. API Resource Naming

Every API resource follows a consistent naming convention.

| Resource | Endpoint |
|----------|----------|
| Projects | `/api/projects` |
| Blogs | `/api/blogs` |
| Learning | `/api/learning` |
| Journey | `/api/journey` |
| Academics | `/api/academics` |
| Freelancing | `/api/freelancing` |
| Media | `/api/media` |
| Contact | `/api/contact` |
| Settings | `/api/settings` |

Rules

- Resource names are plural.
- Use lowercase.
- Use nouns instead of verbs.
- CRUD operations are determined by HTTP methods.

---

# 22. Public API Endpoints

Public APIs are read-only.

Authentication is **not required**.

---

## Projects

### Get All Projects

Method

```
GET
```

Endpoint

```
/api/projects
```

Authentication

```
No
```

Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | Number | Pagination |
| limit | Number | Items per page |
| category | String | Filter by category |
| technology | String | Filter by technology |
| status | String | Filter by status |
| search | String | Search projects |
| sort | String | Sort order |

Response

```
200 OK
```

---

### Get Project By Slug

Method

```
GET
```

Endpoint

```
/api/projects/:slug
```

Authentication

No

Response

```
200 OK

404 Not Found
```

---

## Blogs

### Get All Blogs

```
GET /api/blogs
```

Supports

- Pagination
- Category
- Tags
- Search
- Sorting

---

### Get Blog

```
GET /api/blogs/:slug
```

---

## Learning

### List Learning

```
GET /api/learning
```

---

### Get Learning Entry

```
GET /api/learning/:id
```

---

## Journey

### List Journey Entries

```
GET /api/journey
```

---

### Get Journey Entry

```
GET /api/journey/:id
```

---

## Academics

### List Academic Records

```
GET /api/academics
```

---

## Freelancing

### List Freelancing Projects

```
GET /api/freelancing
```

---

## Settings

### Get Public Site Settings

```
GET /api/settings/public
```

Returns

- Site title
- Social links
- Resume
- SEO

---

# 23. Dashboard API Endpoints

Dashboard APIs require authentication.

---

Authentication

```
Required
```

Authorization

```
Administrator
```

---

# 24. Project APIs

---

### Create Project

Method

```
POST
```

Endpoint

```
/api/projects
```

Authentication

Administrator

Required Fields

- title
- slug
- description
- content

Optional

- featuredImage
- technologies
- repository
- demo
- seo

Returns

```
201 Created
```

---

### Update Project

```
PATCH /api/projects/:id
```

Updates only provided fields.

---

### Archive Project

```
DELETE /api/projects/:id
```

Version 1 performs a soft delete.

Returns

```
204 No Content
```

---

# 25. Blog APIs

---

### Create Blog

```
POST /api/blogs
```

Required

- title
- slug
- content

---

### Update Blog

```
PATCH /api/blogs/:id
```

---

### Archive Blog

```
DELETE /api/blogs/:id
```

---

# 26. Learning APIs

---

### Create Learning Entry

```
POST /api/learning
```

---

### Update Learning Entry

```
PATCH /api/learning/:id
```

---

### Delete Learning Entry

```
DELETE /api/learning/:id
```

---

# 27. Journey APIs

---

### Create Journey Entry

```
POST /api/journey
```

---

### Update Journey Entry

```
PATCH /api/journey/:id
```

---

### Delete Journey Entry

```
DELETE /api/journey/:id
```

---

# 28. Academics APIs

---

### Create Semester

```
POST /api/academics
```

---

### Update Semester

```
PATCH /api/academics/:id
```

---

### Delete Semester

```
DELETE /api/academics/:id
```

---

# 29. Freelancing APIs

---

### Create Client Project

```
POST /api/freelancing
```

---

### Update Client Project

```
PATCH /api/freelancing/:id
```

---

### Delete Client Project

```
DELETE /api/freelancing/:id
```

---

# 30. Common CRUD Rules

Every resource follows the same lifecycle.

```
POST

↓

GET

↓

PATCH

↓

DELETE
```

Rules

- POST returns **201**
- GET returns **200**
- PATCH returns **200**
- DELETE returns **204**
- DELETE performs soft delete
- Slugs must remain unique
- Validation occurs before business logic

---

# 31. Standard Success Responses

## Resource Created

```json
{
  "success": true,
  "message": "Resource created successfully.",
  "data": {}
}
```

---

## Resource Updated

```json
{
  "success": true,
  "message": "Resource updated successfully.",
  "data": {}
}
```

---

## Resource Deleted

```json
{
  "success": true,
  "message": "Resource archived successfully."
}
```

---

## Resource Retrieved

```json
{
  "success": true,
  "data": {}
}
```

---

# 32. Resource Validation Matrix

| Resource | Required Fields |
|------------|----------------|
| Project | title, slug, description, content |
| Blog | title, slug, content |
| Learning | category, title |
| Journey | title, date |
| Academics | semester, cgpa |
| Freelancing | client, project |

Validation occurs before database operations.

---

# End of Part 2
---

# 33. Media APIs

The Media API manages all uploaded assets.

Files are stored in Cloudinary.

MongoDB stores only metadata.

Authentication

Administrator Required

---

## Upload Media

Method

POST

Endpoint

```
/api/media/upload
```

Authentication

Administrator

Content Type

```
multipart/form-data
```

Supported Files

- JPG
- JPEG
- PNG
- SVG
- WEBP
- GIF

Future Support

- MP4
- PDF

Required Fields

| Field | Type |
|--------|------|
| file | File |

Returns

```
201 Created
```

---

## Get Media Library

Method

GET

Endpoint

```
/api/media
```

Supports

- Pagination
- Search
- Sorting

---

## Delete Media

Method

DELETE

Endpoint

```
/api/media/:id
```

Deletes media from

- Cloudinary
- MongoDB Metadata

---

# 34. Contact APIs

---

## Submit Contact Form

Method

POST

Endpoint

```
/api/contact
```

Authentication

No

Required Fields

- name
- email
- subject
- message

Returns

```
201 Created
```

---

## List Messages

Method

GET

Endpoint

```
/api/contact
```

Authentication

Administrator

---

## Mark Message Read

Method

PATCH

Endpoint

```
/api/contact/:id
```

---

## Archive Message

Method

DELETE

Endpoint

```
/api/contact/:id
```

---

# 35. Settings APIs

---

## Get Public Settings

```
GET /api/settings/public
```

Returns

- Site Title
- SEO
- Resume
- Social Links

---

## Get Dashboard Settings

```
GET /api/settings
```

Administrator Only

---

## Update Settings

```
PATCH /api/settings
```

Administrator Only

---

# 36. Search APIs

Global search across all modules.

---

## Search Everything

Method

GET

Endpoint

```
/api/search
```

Query Parameters

| Parameter | Description |
|-----------|-------------|
| q | Search keyword |
| module | Optional module filter |
| page | Pagination |
| limit | Result limit |

Returns

Projects

Blogs

Learning

Journey

---

# 37. Pagination Standard

All collection endpoints support pagination.

Parameters

```
?page=1

&limit=12
```

Default

```
page = 1

limit = 12
```

Maximum

```
limit = 100
```

Pagination Response

```json
{
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 125,
    "pages": 11
  }
}
```

---

# 38. Filtering Standard

Filtering uses query parameters.

Examples

```
?category=AI

?status=Published

?technology=React

?tag=MongoDB
```

Multiple filters may be combined.

---

# 39. Sorting Standard

Sorting parameter

```
sort=
```

Examples

Newest

```
sort=-createdAt
```

Oldest

```
sort=createdAt
```

Alphabetical

```
sort=title
```

Reverse Alphabetical

```
sort=-title
```

---

# 40. File Upload Specification

Uploads use

```
multipart/form-data
```

Rules

Maximum File Size

```
10 MB
```

Allowed Types

Images

```
jpg

jpeg

png

svg

gif

webp
```

Rejected Files

- Executables
- Scripts
- Unsupported MIME Types

Uploaded files receive

- Unique filename
- Optimized delivery
- CDN URL

---

# 41. Validation Rules

Every endpoint validates

Required Fields

↓

Type

↓

Length

↓

Format

↓

Business Rules

↓

Database

Validation Types

- Required
- Email
- URL
- Slug
- Enum
- Number
- Date
- File Type

Validation occurs before business logic.

---

# 42. Rate Limiting

Public APIs

```
100 requests / minute
```

Dashboard APIs

```
30 requests / minute
```

Authentication APIs

```
10 login attempts / 15 minutes
```

Future implementations may use Redis or edge-based rate limiting if traffic grows.

---

# 43. Endpoint Permissions Matrix

| Endpoint | Public | Admin |
|----------|:------:|:-----:|
| GET /projects | ✓ | ✓ |
| GET /projects/:slug | ✓ | ✓ |
| POST /projects | ✗ | ✓ |
| PATCH /projects/:id | ✗ | ✓ |
| DELETE /projects/:id | ✗ | ✓ |
| GET /blogs | ✓ | ✓ |
| POST /blogs | ✗ | ✓ |
| POST /media/upload | ✗ | ✓ |
| POST /contact | ✓ | ✓ |
| PATCH /settings | ✗ | ✓ |

---

# 44. API Naming Rules

Endpoints use

Plural nouns

```
/api/projects
```

Nested Resources

```
/api/projects/:id/timeline
```

Use

```
:id
```

for internal identifiers.

Use

```
:slug
```

for public-facing content.

Never expose MongoDB implementation details.

---

# 45. Idempotency Guidelines

GET

Safe

Idempotent

---

PATCH

Idempotent

---

DELETE

Should safely handle already archived resources.

---

POST

Not idempotent unless explicitly documented.

---

# 46. API Best Practices

Every endpoint should

- Return predictable JSON.
- Validate all input.
- Return appropriate HTTP status codes.
- Never expose internal database fields.
- Use pagination for collections.
- Keep responses lightweight.
- Keep one responsibility per endpoint.
- Document all changes.

---

# End of Part 3

---

# 47. Complete Endpoint Catalog

The following table provides a high-level overview of every API endpoint in Portfolio OS.

| Method | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| GET | /api/projects | No | Get all projects |
| GET | /api/projects/:slug | No | Get project details |
| POST | /api/projects | Yes | Create project |
| PATCH | /api/projects/:id | Yes | Update project |
| DELETE | /api/projects/:id | Yes | Archive project |
| GET | /api/blogs | No | Get all blogs |
| GET | /api/blogs/:slug | No | Get blog details |
| POST | /api/blogs | Yes | Create blog |
| PATCH | /api/blogs/:id | Yes | Update blog |
| DELETE | /api/blogs/:id | Yes | Archive blog |
| GET | /api/learning | No | Get learning entries |
| POST | /api/learning | Yes | Create learning entry |
| PATCH | /api/learning/:id | Yes | Update learning entry |
| DELETE | /api/learning/:id | Yes | Delete learning entry |
| GET | /api/journey | No | Get journey timeline |
| POST | /api/journey | Yes | Create journey entry |
| PATCH | /api/journey/:id | Yes | Update journey entry |
| DELETE | /api/journey/:id | Yes | Delete journey entry |
| GET | /api/academics | No | Get academic records |
| POST | /api/academics | Yes | Create semester |
| PATCH | /api/academics/:id | Yes | Update semester |
| DELETE | /api/academics/:id | Yes | Delete semester |
| GET | /api/freelancing | No | Get freelancing projects |
| POST | /api/freelancing | Yes | Create client project |
| PATCH | /api/freelancing/:id | Yes | Update client project |
| DELETE | /api/freelancing/:id | Yes | Delete client project |
| GET | /api/media | Yes | Media library |
| POST | /api/media/upload | Yes | Upload media |
| DELETE | /api/media/:id | Yes | Delete media |
| POST | /api/contact | No | Submit contact form |
| GET | /api/contact | Yes | List messages |
| PATCH | /api/contact/:id | Yes | Update message |
| DELETE | /api/contact/:id | Yes | Archive message |
| GET | /api/settings/public | No | Public settings |
| GET | /api/settings | Yes | Dashboard settings |
| PATCH | /api/settings | Yes | Update settings |
| GET | /api/search | No | Global search |

---

# 48. API Testing Strategy

The API must be tested before deployment.

Testing Levels

```
Unit Tests

↓

Integration Tests

↓

API Tests

↓

Manual Verification

↓

Production Validation
```

---

## Unit Testing

Verify

- Validation
- Business Logic
- Utility Functions
- Error Handling

---

## Integration Testing

Verify

- Database operations
- Service layer
- Repository layer
- Authentication

---

## API Testing

Every endpoint should be tested for

✓ Success

✓ Validation failure

✓ Unauthorized access

✓ Forbidden access

✓ Missing resources

✓ Invalid IDs

✓ Duplicate data

✓ Invalid file upload

✓ Empty request body

✓ Invalid query parameters

---

## Performance Testing

Verify

- Response time
- Pagination performance
- Search performance
- Upload performance
- Large dataset handling

---

# 49. API Security Checklist

Every endpoint must satisfy the following requirements.

## Authentication

✓ Protected endpoints require login.

✓ Sessions are validated.

✓ Expired sessions are rejected.

---

## Authorization

✓ User permissions verified.

✓ Public endpoints remain read-only.

✓ Dashboard restricted.

---

## Validation

✓ Required fields checked.

✓ Input sanitized.

✓ Type validation.

✓ Length validation.

✓ Enum validation.

---

## File Upload Security

✓ MIME type validation.

✓ File size validation.

✓ Safe filenames.

✓ Virus scanning (Future).

---

## Headers

Use

- HTTPS
- Secure Cookies
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options

---

## Secrets

Secrets must

- Never be exposed
- Never be logged
- Never be committed to Git

---

# 50. API Monitoring

Monitor

- Request count
- Error rate
- Response time
- Failed authentication
- Upload failures
- Search performance

Future integrations

- Vercel Analytics
- Sentry
- Better Stack

---

# 51. API Documentation Rules

Every endpoint must include

Purpose

Authentication

Authorization

HTTP Method

Endpoint

Parameters

Request Body

Validation Rules

Response Examples

Error Responses

Notes

No endpoint should exist without documentation.

---

# 52. API Change Management

Every API change must be

- Documented
- Reviewed
- Versioned (if breaking)
- Tested
- Approved

Breaking changes must never be introduced silently.

---

# 53. Future API Roadmap

Potential Version 2 Features

- Public API Keys
- Webhooks
- GraphQL API
- Mobile API
- RSS Feed API
- Analytics API
- Plugin API

Potential Version 3 Features

- Team Workspaces
- Third-party Integrations
- OAuth Applications
- Real-time Notifications

---

# 54. API Best Practices

Every API should

- Have one responsibility
- Return predictable responses
- Be fully documented
- Validate all inputs
- Never expose internal implementation details
- Use standard HTTP status codes
- Support pagination where applicable
- Support filtering where applicable
- Support sorting where applicable

---

# 55. API Review Checklist

Before an endpoint is approved, verify

## Design

✓ Correct resource name

✓ RESTful structure

✓ Correct HTTP method

✓ Proper URL format

---

## Validation

✓ Required fields

✓ Type checking

✓ Business rules

✓ Duplicate detection

---

## Security

✓ Authentication

✓ Authorization

✓ Input sanitization

✓ Rate limiting

---

## Documentation

✓ Request documented

✓ Response documented

✓ Errors documented

✓ Examples included

---

## Performance

✓ Indexed queries

✓ Efficient database access

✓ Pagination supported

✓ No unnecessary data returned

---

## Maintainability

✓ Uses Service Layer

✓ Uses Repository Layer

✓ Reusable validation

✓ Consistent naming

---

# 56. API Quality Gates

An API endpoint is considered production-ready only if it passes all of the following:

✓ Architecture Review

✓ Security Review

✓ Validation Review

✓ Performance Review

✓ Documentation Review

✓ Manual Testing

✓ Integration Testing

✓ Code Review

No endpoint should be deployed unless every quality gate has passed.

---

# 57. Dependencies

Depends On

- 00_PRODUCT_REQUIREMENTS.md
- 01_PROJECT_DECISIONS.md
- 02_MASTER_BLUEPRINT.md
- 03_UI_ROADMAP.md
- 04_DESIGN_SYSTEM.md
- 05_SYSTEM_ARCHITECTURE.md
- 06_DATABASE_SCHEMA.md

Next Document

08_ROADMAP.md

---
---

# 58. API Sequence Diagrams

This section documents the complete execution flow of common API operations.

These diagrams describe how requests move through the application architecture.

All APIs should follow these patterns unless explicitly documented otherwise.

---

## 58.1 Create Project

```
Administrator

        │
        ▼

Dashboard

        │
        ▼

POST /api/projects

        │
        ▼

Authentication Middleware

        │
        ▼

Authorization Check

        │
        ▼

Request Validation

        │
        ▼

Project Service

        │
        ▼

Project Repository

        │
        ▼

MongoDB

        │
        ▼

Response Formatter

        │
        ▼

HTTP Response

        │
        ▼

Dashboard UI Refresh
```

---

## 58.2 Update Project

```
Administrator

        │
        ▼

PATCH /api/projects/:id

        │
        ▼

Authentication

        │
        ▼

Authorization

        │
        ▼

Validation

        │
        ▼

Project Service

        │
        ▼

Repository

        │
        ▼

MongoDB

        │
        ▼

Updated Resource

        │
        ▼

Response
```

---

## 58.3 Archive Project

```
Administrator

        │
        ▼

DELETE /api/projects/:id

        │
        ▼

Authentication

        │
        ▼

Authorization

        │
        ▼

Repository

        │
        ▼

Soft Delete

        │
        ▼

MongoDB

        │
        ▼

204 No Content
```

---

## 58.4 View Public Project

```
Visitor

        │
        ▼

GET /api/projects/:slug

        │
        ▼

Project Service

        │
        ▼

Repository

        │
        ▼

MongoDB

        │
        ▼

JSON Response

        │
        ▼

Rendered Astro Page
```

---

## 58.5 Create Blog

```
Administrator

        │
        ▼

POST /api/blogs

        │
        ▼

Authentication

        │
        ▼

Validation

        │
        ▼

Blog Service

        │
        ▼

Repository

        │
        ▼

MongoDB

        │
        ▼

Success Response
```

---

## 58.6 View Blog

```
Visitor

        │
        ▼

GET /api/blogs/:slug

        │
        ▼

Blog Service

        │
        ▼

Repository

        │
        ▼

MongoDB

        │
        ▼

Response

        │
        ▼

Blog Page
```

---

## 58.7 Upload Media

```
Administrator

        │
        ▼

POST /api/media/upload

        │
        ▼

Authentication

        │
        ▼

File Validation

        │
        ▼

Cloudinary Upload

        │
        ▼

Receive Metadata

        │
        ▼

Media Repository

        │
        ▼

MongoDB

        │
        ▼

Success Response
```

---

## 58.8 Delete Media

```
Administrator

        │
        ▼

DELETE /api/media/:id

        │
        ▼

Authentication

        │
        ▼

Find Media

        │
        ▼

Delete Cloudinary Asset

        │
        ▼

Delete Metadata

        │
        ▼

MongoDB

        │
        ▼

Success Response
```

---

## 58.9 Submit Contact Form

```
Visitor

        │
        ▼

POST /api/contact

        │
        ▼

Validation

        │
        ▼

Contact Service

        │
        ▼

Repository

        │
        ▼

MongoDB

        │
        ▼

Confirmation Response
```

---

## 58.10 Global Search

```
Visitor

        │
        ▼

GET /api/search?q=portfolio

        │
        ▼

Validation

        │
        ▼

Search Service

        │
        ▼

Projects Repository

Blogs Repository

Learning Repository

Journey Repository

        │
        ▼

Merge Results

        │
        ▼

Sort Results

        │
        ▼

JSON Response
```

---

## 58.11 Dashboard Login

```
Administrator

        │
        ▼

Login Form

        │
        ▼

Better Auth

        │
        ▼

Credential Verification

        │
        ▼

Session Creation

        │
        ▼

Secure Cookie

        │
        ▼

Dashboard Redirect
```

---

## 58.12 Protected API Request

```
Dashboard

        │
        ▼

Protected API

        │
        ▼

Authentication Middleware

        │
        ▼

Session Validation

        │
        ▼

Authorization

        │
        ▼

Business Service

        │
        ▼

Repository

        │
        ▼

MongoDB

        │
        ▼

Response
```

---

# 59. Complete API Lifecycle

Every request in Portfolio OS follows the same architecture.

```
Browser

        │
        ▼

Astro Page

        │
        ▼

API Route

        │
        ▼

Middleware

        │
        ▼

Authentication

        │
        ▼

Authorization

        │
        ▼

Validation

        │
        ▼

Business Service

        │
        ▼

Repository

        │
        ▼

MongoDB

        │
        ▼

Response Formatter

        │
        ▼

JSON Response

        │
        ▼

Frontend Update
```

No layer may be bypassed.

---

# 60. Final API Architecture Rules

Every API must satisfy the following principles:

## Architecture

- Use Astro Server Endpoints.
- Keep routes thin.
- Place business logic only in Services.
- Repositories handle database access exclusively.
- Database never contains business logic.

---

## Validation

- Validate before processing.
- Reject malformed requests.
- Return standardized validation errors.
- Sanitize all user input.

---

## Authentication

- Public endpoints remain read-only.
- Dashboard endpoints require authentication.
- Authorization is checked before business logic.

---

## Performance

- Support pagination for collections.
- Return only required fields.
- Avoid unnecessary database queries.
- Optimize indexes for common queries.

---

## Security

- Never expose internal IDs unnecessarily.
- Never return secrets.
- Protect against mass assignment.
- Validate uploaded files.
- Use secure cookies and HTTPS.

---

## Documentation

Every endpoint must include:

- Purpose
- Authentication
- Authorization
- HTTP Method
- URL
- Parameters
- Request Body
- Validation Rules
- Success Response
- Error Responses
- Example Request
- Example Response

---

## Quality Gates

Before deployment, every endpoint must pass:

- Architecture Review
- Validation Review
- Security Review
- Performance Review
- Documentation Review
- Unit Tests
- Integration Tests
- Manual Verification
- Code Review

Only endpoints that pass all quality gates are considered production-ready.

---

# End of 07_API_SPEC.md
