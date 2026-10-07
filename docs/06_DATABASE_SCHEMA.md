# 06_DATABASE_SCHEMA.md

---

# Portfolio OS Database Schema

| Field | Value |
|--------|--------|
| Project | Portfolio OS |
| Version | 1.0 |
| Status | Planning |
| Purpose | Define the complete database structure, entity relationships, validation rules, indexing strategy, and data standards for Portfolio OS. |

---

# 1. Database Philosophy

Portfolio OS stores all dynamic content in MongoDB Atlas.

The database should be:

- Simple
- Consistent
- Scalable
- Secure
- Easy to Maintain

The schema is designed for long-term evolution without breaking existing content.

---

# 2. Database Technology

Database

- MongoDB Atlas

ODM

- Mongoose

Data Format

- BSON

Primary Identifier

- ObjectId

---

# 3. Collection Overview

Version 1 includes the following collections.

```
users

projects

blogs

learning

journey

academics

freelancing

media

contactMessages

settings
```

Additional collections may be introduced in future versions without affecting the existing schema.

---

# 4. Collection Naming Rules

Collections use:

- lowercase
- plural names
- camelCase field names

Examples

```
projects

contactMessages

learning
```

Avoid abbreviations unless universally understood.

---

# 5. Common Document Fields

Every collection should include the following fields where applicable.

```
_id

createdAt

updatedAt

status

isDeleted
```

These fields provide consistency across the database.

---

# 6. Project Collection

Purpose

Stores project information and metadata.

Key Fields

- title
- slug
- description
- content
- featuredImage
- technologies
- repositoryUrl
- liveUrl
- category
- status
- timeline
- seo

Indexes

- slug (unique)
- category
- status

Relationships

Projects connect to:

- Blogs
- Learning
- Journey
- Media

---

# 7. Blog Collection

Purpose

Stores blog articles.

Key Fields

- title
- slug
- excerpt
- content
- coverImage
- tags
- category
- readingTime
- seo
- publishedAt

Indexes

- slug (unique)
- tags
- category
- publishedAt

Relationships

Blogs connect to:

- Projects
- Learning
- Journey

---

# 8. Learning Collection

Purpose

Tracks learning progress.

Key Fields

- category
- title
- progress
- resources
- notes
- relatedProjects

Indexes

- category
- progress

Relationships

Learning connects to:

- Projects
- Blogs
- Journey

---

# 9. Journey Collection

Purpose

Stores chronological milestones.

Key Fields

- title
- date
- description
- status
- relatedProjects
- relatedBlogs

Indexes

- date
- status

---

# 10. Academics Collection

Purpose

Stores academic progress.

Key Fields

- semester
- cgpa
- achievements
- certificates

Indexes

- semester

---

# 11. Freelancing Collection

Purpose

Stores professional work.

Key Fields

- client
- project
- services
- technologies
- testimonial

Indexes

- client

---

# 12. Media Collection

Purpose

Stores metadata for uploaded media.

Media files remain in Cloudinary.

MongoDB stores:

- publicId
- url
- width
- height
- format
- size
- alt
- uploadedAt

Indexes

- publicId (unique)

---

# 13. Contact Messages Collection

Purpose

Stores contact form submissions.

Key Fields

- name
- email
- subject
- message
- status
- replied

Indexes

- email
- status

---

# 14. Settings Collection

Purpose

Stores global site configuration.

Examples

- Site Title
- SEO
- Social Links
- Resume URL
- Analytics IDs

This collection should contain a single document.

---

# 15. Relationships

```
Projects

↓

Blogs

↓

Learning

↓

Journey

↓

Academics

↓

Freelancing
```

Relationships are maintained through document references.

---

# 16. Validation Rules

All documents must satisfy:

- Required field validation
- Type validation
- Length validation
- Enum validation
- URL validation
- Slug uniqueness

Validation should occur in the service layer before persistence.

---

# 17. Indexing Strategy

Indexes should be created only for frequently queried fields.

Typical indexed fields:

- slug
- category
- status
- createdAt
- publishedAt

Avoid unnecessary indexes.

---

# 18. Soft Delete Strategy

Documents should not be permanently removed.

Instead:

```
isDeleted = true
deletedAt = timestamp
```

Queries should exclude deleted documents by default.

---

# 19. Timestamp Strategy

Every mutable document includes:

- createdAt
- updatedAt

These values are managed automatically.

---

# 20. SEO Data Structure

SEO information is embedded within content documents.

Common fields:

- title
- description
- keywords
- canonicalUrl
- openGraphImage

---

# 21. Media References

Content stores references to media documents.

Media metadata remains centralized.

---

# 22. Data Integrity Rules

Rules include:

- Unique slugs
- Valid references
- Required fields
- Consistent enums
- No orphaned references

---

# 23. Backup Strategy

MongoDB Atlas automated backups.

Regular export of critical collections.

Media backed up through Cloudinary.

---

# 24. Migration Strategy

Future schema changes should be:

- Backward compatible
- Versioned
- Documented
- Tested before deployment

---

# 25. Database Quality Checklist

✓ Consistent naming

✓ Required validation

✓ Proper indexing

✓ Soft deletes

✓ Timestamps

✓ Relationship integrity

✓ Documentation

---

# 26. Dependencies

Depends On

- 00_PRODUCT_REQUIREMENTS.md
- 01_PROJECT_DECISIONS.md
- 02_MASTER_BLUEPRINT.md
- 03_UI_ROADMAP.md
- 04_DESIGN_SYSTEM.md
- 05_SYSTEM_ARCHITECTURE.md

Next Document

07_API_SPEC.md

---

---

# 27. Entity Relationship Diagram (ERD)

The following diagram illustrates the logical relationships between collections.

```
                           +----------------+
                           |     Users      |
                           +----------------+
                                   |
                                   |
                           Manages Dashboard
                                   |
                                   v
+------------+      +------------+      +------------+
|  Projects  |<---->|   Blogs    |<---->|  Learning  |
+------------+      +------------+      +------------+
      |                    |                   |
      |                    |                   |
      +---------+----------+-------------------+
                |
                v
         +---------------+
         |    Journey    |
         +---------------+
                |
                |
        +-------+-------+
        |               |
        v               v
+---------------+   +---------------+
|  Academics    |   | Freelancing   |
+---------------+   +---------------+

                |
                |
                v
        +---------------+
        |     Media     |
        +---------------+

                |
                |
                v
        +---------------+
        |   Settings    |
        +---------------+

                |
                |
                v
        +-------------------+
        | Contact Messages  |
        +-------------------+
```

Relationships are logical and maintained through ObjectId references where appropriate.

---

# 28. Standard Field Definitions

To maintain consistency across all collections, common fields use standardized definitions.

| Field | Type | Description |
|--------|------|-------------|
| _id | ObjectId | Primary identifier |
| title | String | Human-readable title |
| slug | String | URL-friendly unique identifier |
| description | String | Short summary |
| content | String | Markdown content |
| status | Enum | Current publication status |
| featuredImage | ObjectId | Reference to Media collection |
| seo | Object | SEO metadata |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last modification timestamp |
| isDeleted | Boolean | Soft delete flag |
| deletedAt | Date | Soft deletion timestamp |
| schemaVersion | Number | Document schema version |

These fields should use consistent names and data types across every collection.

---

# 29. Enum Definitions

Centralized enum definitions ensure consistency throughout the application.

## Content Status

- Draft
- Published
- Archived

---

## Project Timeline Status

- Planned
- In Progress
- Completed
- Missed
- Cancelled

---

## Contact Message Status

- Unread
- Read
- Replied
- Archived

---

## Learning Progress

- Not Started
- In Progress
- Completed

---

## Media Type

- Image
- Video
- Document
- Other

---

## User Role (Future)

- Administrator
- Editor
- Viewer

---

# 30. Reference Strategy

Portfolio OS follows a hybrid document model.

## Embed Data

Embed when the data belongs exclusively to one parent document.

Examples

- SEO Metadata
- Timeline Entries
- Settings
- Statistics
- Social Links

---

## Reference Data

Reference when data is shared between multiple documents.

Examples

- Media
- Related Projects
- Related Blogs
- Learning Resources
- Journey Entries

---

## Design Principles

- Avoid unnecessary duplication.
- Keep documents focused on a single responsibility.
- Reference reusable content instead of copying it.
- Embed small, tightly coupled data structures.

---

# 31. Schema Versioning

Every mutable document includes a schema version.

Example

```text
schemaVersion: 1
```

Purpose

- Track schema evolution.
- Simplify future migrations.
- Enable backward compatibility.
- Support data transformation scripts.

Version changes should be documented in migration notes.

---

# 32. Sample Document Structures

The following examples define the expected document structure.

## Project Document

```text
Project
├── _id
├── title
├── slug
├── description
├── content
├── category
├── technologies[]
├── timeline[]
├── featuredImageId
├── seo
├── status
├── schemaVersion
├── createdAt
└── updatedAt
```

---

## Blog Document

```text
Blog
├── _id
├── title
├── slug
├── excerpt
├── content
├── coverImageId
├── tags[]
├── category
├── readingTime
├── seo
├── publishedAt
├── status
├── schemaVersion
├── createdAt
└── updatedAt
```

---

## Learning Document

```text
Learning
├── _id
├── category
├── title
├── progress
├── resources[]
├── notes
├── relatedProjectIds[]
├── status
├── schemaVersion
├── createdAt
└── updatedAt
```

---

## Journey Document

```text
Journey
├── _id
├── title
├── description
├── date
├── status
├── relatedProjectIds[]
├── relatedBlogIds[]
├── schemaVersion
├── createdAt
└── updatedAt
```

---

## Academics Document

```text
Academics
├── _id
├── semester
├── cgpa
├── achievements[]
├── certificates[]
├── schemaVersion
├── createdAt
└── updatedAt
```

---

## Freelancing Document

```text
Freelancing
├── _id
├── client
├── project
├── services[]
├── technologies[]
├── testimonial
├── schemaVersion
├── createdAt
└── updatedAt
```

---

## Media Document

```text
Media
├── _id
├── publicId
├── url
├── width
├── height
├── format
├── size
├── alt
├── uploadedAt
├── schemaVersion
└── createdAt
```

---

## Contact Message Document

```text
ContactMessage
├── _id
├── name
├── email
├── subject
├── message
├── status
├── replied
├── createdAt
└── updatedAt
```

---

## Settings Document

```text
Settings
├── _id
├── siteTitle
├── siteDescription
├── logo
├── socialLinks
├── seo
├── analytics
├── resumeUrl
├── schemaVersion
├── createdAt
└── updatedAt
```

These structures define the expected document hierarchy. Implementation-specific details belong in the application code, not in this specification.

---

# 33. Database Naming Convention

To maintain consistency across the database, the following naming conventions must be followed.

## Collections

- Lowercase
- Plural nouns

Examples

- projects
- blogs
- learning
- journey
- academics
- freelancing
- media
- contactMessages
- settings

---

## Fields

- camelCase
- Descriptive names
- No abbreviations

Examples

- createdAt
- updatedAt
- featuredImageId
- repositoryUrl
- relatedProjectIds
- relatedBlogIds

---

## Indexes

Use descriptive names when creating custom indexes.

Examples

```text
idx_projects_slug

idx_projects_category

idx_blogs_slug

idx_blogs_publishedAt

idx_learning_category

idx_journey_date

idx_media_publicId
```

---

## Reference Fields

Reference fields should follow a consistent naming convention.

Single Reference

```text
featuredImageId

authorId

coverImageId
```

Multiple References

```text
relatedProjectIds

relatedBlogIds

mediaIds

technologyIds
```

This convention makes relationships immediately recognizable throughout the codebase.

---

# 34. Database Best Practices

The following rules apply to every collection.

## General Rules

- Every document must have a unique `_id`.
- Every mutable document includes `createdAt` and `updatedAt`.
- Every public-facing document includes a unique `slug`.
- Soft delete is preferred over permanent deletion.
- Required fields must never be nullable unless explicitly documented.

---

## Performance Rules

- Index only frequently queried fields.
- Avoid unnecessary indexes.
- Keep documents reasonably sized.
- Prevent excessive nesting.
- Reference large reusable datasets instead of embedding them.

---

## Security Rules

- Never store secrets in MongoDB.
- Validate all data before persistence.
- Sanitize user input.
- Never expose internal fields through public APIs.
- Log administrative changes when appropriate.

---

## Maintainability Rules

- Keep collection names consistent.
- Use shared field names whenever possible.
- Version schema changes.
- Document every structural change.
- Review indexes after major feature additions.

---

# 35. Database Review Checklist

Every collection must satisfy the following checklist before implementation.

## Structure

- ✓ Clear responsibility
- ✓ Consistent naming
- ✓ Required fields defined
- ✓ Appropriate data types

---

## Relationships

- ✓ References documented
- ✓ No orphaned relationships
- ✓ Proper embedding strategy
- ✓ Bidirectional relationships documented (where applicable)

---

## Performance

- ✓ Required indexes added
- ✓ No duplicate data
- ✓ Query patterns considered

---

## Security

- ✓ Input validation planned
- ✓ Sensitive data excluded
- ✓ Soft delete supported

---

## Future Compatibility

- ✓ Schema version included
- ✓ Migration strategy documented
- ✓ Backward compatibility considered

---



# End of Document