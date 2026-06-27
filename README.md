# Tech Interview Timeline Tracker

A comprehensive pipeline and CRM tool designed to help job seekers meticulously track tech interviews from application to offer. Manage companies, applications, contacts, and interactions seamlessly while getting a holistic overview of your performance.

## Feature List

- **Dashboard**: Unified overview of your active applications, offers, and upcoming interviews.
- **Kanban Board**: Drag-and-drop statuses to quickly transition applications.
- **Applications Management**: Full CRUD for job applications, sortable lists, filters (status, source, date), and one-click CSV export.
- **Timeline & Activity Feed**: A unified feed tracking every application step, interview, offer, and reminder grouped intelligently by recency.
- **Interviews Tracking**: Log multi-round interviews including scheduling, outcome, and notes.
- **Recruiter CRM**: Integrated contact management to track recruiters, hiring managers, and referrals.
- **Interaction Logging**: Log every email, call, or meeting with a contact.
- **Follow-up Tracker**: Assign follow-ups and due dates to specific contacts or applications.
- **Analytics**: Visualize your pipeline funnel, application history over 6 months, and status distribution with interactive Recharts.
- **Dark Mode**: Complete support for system/manual dark mode toggling.
- **Authentication**: Secure Google & GitHub OAuth via NextAuth.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: NextAuth.js (v5)
- **Styling**: Tailwind CSS, Radix UI Primitives
- **Data Fetching**: React Server Components & Server Actions
- **Forms & Validation**: React Hook Form + Zod
- **Drag & Drop**: @dnd-kit/core
- **Charts**: Recharts

## Folder Structure

```
├── app/                  # Next.js App Router pages and Server Actions
│   ├── actions/          # Prisma database mutations & aggregations
│   ├── api/              # API routes (auth)
│   ├── dashboard/        # Dashboard layout and authenticated routes
│   └── layout.tsx        # Root HTML layout and Providers
├── components/           # Reusable UI components
│   ├── dashboard/        # Feature-specific dashboard components
│   ├── ui/               # Generic UI components (Buttons, Inputs)
│   └── theme-provider.tsx# next-themes context
├── lib/                  # Shared utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma singleton
│   └── validations/      # Zod schemas
└── prisma/               # Database schema and migrations
    ├── schema.prisma     # Core data models
    └── seed.ts           # Development seed script
```

## Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nupur2006/tech-interview-tracker.git
   cd tech-interview-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Copy the example environment file and configure your credentials.
   ```bash
   cp .env.example .env
   ```
   *Note: Ensure you set up a local PostgreSQL instance and update the `DATABASE_URL`.*

4. **Prisma Migration:**
   Run migrations to set up the database schema.
   ```bash
   npx prisma migrate dev
   ```

5. **Prisma Seed:**
   Seed the database with sample data to see the dashboard populated.
   ```bash
   npx prisma db seed
   ```

6. **Running Locally:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to a GitHub repository.
2. Sign in to [Vercel](https://vercel.com/) and create a "New Project".
3. Import your GitHub repository.
4. Add the required environment variables in the Vercel dashboard:
   - `DATABASE_URL` (Use a pooled connection string if using Supabase/Neon)
   - `AUTH_SECRET` (Run `openssl rand -base64 32` to generate one)
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `AUTH_GITHUB_ID`
   - `AUTH_GITHUB_SECRET`
5. Click **Deploy**. Vercel will automatically detect Next.js and run the build.
6. Remember to run `npx prisma migrate deploy` against your production database (or configure Vercel build step to do so).

## Future Roadmap

- Native Calendar (.ics) export integration
- **Note: Email reminders and notification center are planned for a future release.**
