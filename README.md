# Tech Interview Timeline Tracker

A production-ready Next.js 14 application for tracking your tech interview journey — from application to offer.

Built with **Next.js 14** (App Router), **TypeScript** (strict mode), **Tailwind CSS**, **Prisma**, **PostgreSQL**, and **NextAuth.js v5** (Auth.js).

---

## ✨ Features

- 🔐 **OAuth Authentication** — Sign in with Google or GitHub
- 🛡️ **Route Protection** — Middleware-based auth guard on all `/dashboard/*` routes
- 📋 **Interview Pipeline** — Track applications through every stage
- 📊 **Analytics Dashboard** — Visualize your progress
- 🌙 **Dark Mode** — Beautiful slate-palette dark design system
- ⚡ **Server Components** — Optimized with React Server Components
- 🗃️ **Database** — PostgreSQL with Prisma ORM

---

## 📁 Project Structure

```
tech-interview-tracker/
├── app/                          # Next.js App Router
│   ├── api/auth/[...nextauth]/   # Auth.js API route
│   ├── dashboard/                # Protected dashboard pages
│   │   ├── layout.tsx            # Dashboard shell (header + sidebar)
│   │   └── page.tsx              # Dashboard overview
│   ├── globals.css               # Global styles & design system
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Landing page
│   └── providers.tsx             # Client-side providers (SessionProvider)
├── components/                   # Reusable components
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   ├── landing/                  # Landing page components
│   │   ├── features.tsx
│   │   ├── footer.tsx
│   │   ├── hero.tsx
│   │   ├── how-it-works.tsx
│   │   ├── navbar.tsx
│   │   └── sign-in-button.tsx
│   └── ui/                       # Generic UI components
│       └── button.tsx
├── lib/                          # Shared utilities
│   ├── auth.ts                   # Auth.js v5 configuration
│   ├── prisma.ts                 # Prisma client singleton
│   └── utils.ts                  # Helper functions
├── prisma/                       # Database schema
│   └── schema.prisma
├── types/                        # TypeScript type declarations
│   └── index.ts
├── middleware.ts                  # Auth middleware (route protection)
├── .env.example                  # Environment variable template
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js** ≥ 18.17
- **PostgreSQL** running locally (or a remote instance)
- **Google OAuth credentials** ([console.cloud.google.com](https://console.cloud.google.com/apis/credentials))
- **GitHub OAuth App** ([github.com/settings/developers](https://github.com/settings/developers))

### Step 1: Clone & Install

```bash
git clone <your-repo-url> tech-interview-tracker
cd tech-interview-tracker
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `http://localhost:3000` for local dev |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `AUTH_GITHUB_ID` | GitHub OAuth App Client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Client Secret |

> **Google OAuth:** Set authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
>
> **GitHub OAuth:** Set authorization callback URL to `http://localhost:3000/api/auth/callback/github`

### Step 3: Set Up the Database

```bash
# Push the Prisma schema to your database
npm run db:push

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### Step 4: Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the landing page.

### Step 5: Sign In

Click **Get Started** and sign in with Google or GitHub. You'll be redirected to `/dashboard`.

---

## 🗃️ Database Commands

| Command | Description |
|---|---|
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:push` | Push schema changes (dev) |
| `npm run db:migrate` | Create a migration (production) |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 3.4 |
| Auth | NextAuth.js v5 (Auth.js) |
| Database | PostgreSQL |
| ORM | Prisma 6 |
| Deployment | Vercel (recommended) |

---

## 📝 License

MIT
