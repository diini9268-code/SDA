---

# Architecture

## System Overview

The SDA Website follows a full-stack web architecture designed to provide information, publish blog content, manage organizational content, and support membership applications.

```
Visitors / Members / Leadership / Administrators
        ->
Next.js App Router UI
        ->
Next.js Route Handlers and Server Modules
        ->
Prisma ORM
        ->
Supabase PostgreSQL
        ->
Blog, Programs, Membership, Archive, and Contact Services
```

## Core Layers

### Next.js UI Layer

The UI layer provides user-friendly interfaces for visitors, members, and administrators.

- Home page
- About page
- Leadership profiles
- Programs page
- Blog posts
- Archive page
- Membership application form
- Contact page
- Admin content management dashboard

### Next.js Backend Layer

Route Handlers and server-side modules manage business logic and application services.

- Authentication
- Authorization
- Input validation
- Membership application processing
- Blog management
- Program management
- Leadership management
- Archive management
- Contact message handling
- Content management

### Data Access Layer

Prisma provides type-safe database access to Supabase PostgreSQL. PostgreSQL stores website content, blog posts, blog-owned media, leadership information, membership applications, archived activities, and contact messages.

---

# Domain Modules

### Authentication

Responsibilities:

- Administrator login
- Session management
- Token verification
- Role-based access control

### Users

Responsibilities:

- Store administrator accounts
- Store leadership profiles
- Manage user roles
- Secure administrator access

### Leadership

Responsibilities:

- Store leadership information
- Display executive council members
- Manage leadership profiles
- Update leadership content

### Programs

Responsibilities:

- Create program records
- Display featured programs
- Manage upcoming programs
- Archive completed activities

### Blog

Responsibilities:

- Publish blog posts
- Categorize blog content
- Manage blog-owned media attachments
- Display featured and recent blog posts
- Ensure media is attached to blog posts only, not managed as a standalone library

### Archive

Responsibilities:

- Store historical activities
- Maintain event records
- Display archived programs
- Preserve organizational history

### Membership

Responsibilities:

- Accept membership applications
- Store applicant information
- Manage application status
- Support member registration

### Contact

Responsibilities:

- Receive contact messages
- Store inquiries
- Forward messages to administrators
- Support organizational communication

---

# Website Content Flow

The website content follows a structured publishing process:

1. Administrator Login
2. Create or Update Content
3. Validate Information
4. Publish to Website
5. Display to Visitors
6. Receive User Interactions
7. Store Records in Database

---

# Data Model Baseline

### users

- `id`
- `full_name`
- `email`
- `password`
- `role`
- `created_at`

### leadership

- `id`
- `full_name`
- `position`
- `biography`
- `photo`
- `created_at`

### programs

- `id`
- `title`
- `description`
- `event_date`
- `location`
- `status`

### blog

- `id`
- `title`
- `slug`
- `category`
- `excerpt`
- `content`
- `status`
- `published_at`

### blog_media

- `id`
- `blog_id`
- `url`
- `alt_text`
- `mime_type`
- `size_bytes`
- `created_at`

### archive

- `id`
- `title`
- `summary`
- `activity_date`
- `images`

### membership_applications

- `id`
- `full_name`
- `email`
- `phone`
- `university`
- `status`
- `submitted_at`

### contact_messages

- `id`
- `full_name`
- `email`
- `subject`
- `message`
- `created_at`

---

# Required API Areas

- `POST /auth/login`
- `POST /membership/apply`
- `GET /leadership`
- `GET /programs`
- `GET /programs/:id`
- `GET /blog`
- `GET /blog/:slug`
- `GET /archive`
- `GET /archive/:id`
- `POST /contact`
- `GET /admin/dashboard`
- `POST /admin/programs`
- `PATCH /admin/programs/:id`
- `POST /admin/blog`
- `PATCH /admin/blog/:id`
- `DELETE /admin/blog/:id`
- `POST /admin/archive`
- `PATCH /admin/archive/:id`

Exact route names may change during implementation, but the API should preserve these capabilities.

---

# Authorization Model

- Visitors can browse all public website pages, blog posts, programs, leadership information, and archived content.
- Visitors can submit membership applications and contact messages.
- Administrators can manage website content, blog posts and blog-owned media, programs, leadership profiles, archive records, and membership applications.
- Administrative functions are restricted to authenticated users with the appropriate role.

---

# External Services

### Email Service

Used to acknowledge membership applications and deliver responses to contact inquiries.

### Blog Media Storage

Used only for media attached to blog posts. The MVP does not include a standalone media library.

### Content Management Service

Used to publish, update, and manage website content across all public pages.
