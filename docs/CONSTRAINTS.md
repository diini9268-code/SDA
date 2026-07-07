# Constraints

## Architecture Constraints

- Preserve a clear separation between frontend, backend API, and database layers.
- Use one Next.js full-stack application rather than separate frontend and backend projects.
- Keep business logic in route handlers, server actions, or server-only modules, not in client-side components.
- Use Prisma as the only application access layer for Supabase PostgreSQL.
- Restrict content management features to authorized administrators.
- Keep website content organized and maintainable across all public pages.
- Avoid implementing future features before the core website functionality is completed.

---

## TypeScript Constraints

- Use strict TypeScript for both frontend and backend implementation.
- Avoid using `any` unless required for third-party integrations.
- Prefer strongly typed request and response objects.
- Keep functions modular, readable, and maintainable.

---

## Data Constraints

- `email` should be unique for administrator accounts.
- Leadership members should have unique profiles.
- Research publications should have unique identifiers.
- Programs and archived activities must store valid dates.
- Membership applications must contain complete applicant information.
- Contact messages must always include a sender name, email, subject, and message.

---

## Validation Constraints

Required membership application fields:

- Full name
- Email address
- Phone number
- University or Institution
- Area of Interest

Required contact form fields:

- Full name
- Email address
- Subject
- Message

Required research fields:

- Title
- Category
- Content
- Publication date

Required program fields:

- Title
- Description
- Event date
- Location

---

## Security Constraints

- Never expose application secrets in source control.
- Hash administrator passwords before storage.
- Validate all incoming request data.
- Sanitize all user-generated content before storing it.
- Validate uploaded files by size and format.
- Restrict administrative pages to authenticated users.
- Prevent unauthorized users from modifying website content.
- Protect membership and contact information from unauthorized access.

---

## Frontend Constraints

- Reuse shared UI components throughout the website.
- Ensure responsive layouts for desktop, tablet, and mobile devices.
- Maintain consistent branding and navigation.
- Use accessible labels for forms, buttons, and navigation elements.
- Keep the interface clean, simple, and easy to navigate.
- Optimize pages for fast loading and good user experience.

---

## Content Management Constraints

- Only administrators can publish or edit website content.
- Research publications must be categorized before publishing.
- Programs and archive entries should include dates and descriptions.
- Leadership information should remain accurate and up to date.
- Deleted content should not affect existing website functionality.

---

## Reporting Constraints

- Membership applications should be stored in the database.
- Contact messages should be available through the administrator dashboard.
- Website statistics should be generated from actual database records.
- Reports should avoid exposing sensitive personal information.

---

## Deployment Constraints

- Frontend and backend should support production deployment.
- Production secrets must be managed through environment variables.
- Database migrations must be repeatable and version controlled.
- Deployment should include application health checks.
- Uploaded media should be stored securely.

---

## Future Scope Constraints

The following features should remain outside the initial release unless explicitly approved:

- Mobile application
- Online member portal
- Multi-language support
- Online payment integration
- Email newsletter automation
- Live event streaming
- AI-powered content recommendations
- Integration with external learning or membership platforms