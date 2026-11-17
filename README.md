# Bookshelf

Bookshelf is a reading tracker for organizing books, tracking reading progress, and setting yearly reading goals.

## Project structure

```text
public/                  Static public files
src/
  api/                    Google Books and Supabase requests
  assets/                 Images and icons
  components/             Reusable UI, layout, login, and book components
  constants/              Shared constants, including book languages
  context/                React authentication context
  hooks/                  Reusable React hooks
  lib/                    Supabase client and shared utilities
  pages/                  Application pages
  routes/                 Route definitions and route guards
  schemas/                Zod schemas, including database schemas
```

## Requirements

- Node.js
- pnpm

## Installation

Install the project dependencies and create a local environment file:

```sh
pnpm install
cp .env.example .env
```

Fill in the values in `.env`, then start the development server:

```sh
pnpm dev
```

## Commands

```sh
pnpm dev      # Start the development server
pnpm build    # Type-check and build the app
pnpm lint     # Run Oxlint
pnpm preview  # Preview the production build
```

## APIs

- **Google Books API** provides book search results and book details.
- **Supabase** provides authentication and database access for the user's library and reading goals.

## Environment variables

`.env.example` shows the required variable names and placeholder values:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-or-anon-key
VITE_GOOGLE_BOOKS_API_KEY=your-google-api-key
```

Use your own project values in `.env`. Do not put Supabase secret or service-role keys in `VITE_` variables; Vite exposes those variables to browser code.
