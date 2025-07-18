# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Development Commands

### Core Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production application
- `pnpm lint` - Run ESLint
- `pnpm format` - Format UI and SQL files

### Database Operations
- `pnpm db:start` - Start local Supabase instance (required for development)
- `pnpm db:reset` - Reset database and regenerate types
- `pnpm db:gen-types` - Generate TypeScript types from schema
- `pnpm db:new-migration` - Create new database migration
- `pnpm db:test` - Run database function tests

### Testing
- `pnpm test` - Run Vitest test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Generate coverage report
- `pnpm test:mutation` - Run Stryker mutation testing

## Code Architecture

### Tech Stack
- **Next.js 15** with App Router and React 19
- **TypeScript** with strict type safety
- **Supabase** PostgreSQL with RPC functions for business logic
- **NextAuth.js** with Google OAuth and Supabase adapter
- **Material UI (MUI)** for component library
- **Vitest** for testing with mutation testing support

### Key Files & Directories
- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Shared React components
- `src/serverUtil.ts` - Server-side utilities and RPC helpers
- `src/common-types.ts` - Type aliases for database types
- `src/database.types.ts` - Auto-generated Supabase types
- `supabase/migrations/` - Database schema migrations
- `supabase/tests/` - Database function tests

### Database Pattern
- **PostgreSQL stored procedures/RPC functions** handle all business logic
- Type-safe database interactions via generated types and `supabaseRPC()` helper
- Domain-driven schema with enums for data integrity
- Migrations follow sequential naming: `000000000000XX_name.sql`
- All database objects must be well-commented

### Server Actions Pattern
- Server actions colocated with components in `actions.ts` files
- All actions marked with `"use server"` directive
- Use `supabaseRPC()` helper from `serverUtil.ts` for database calls
- Authentication via `requireLoggedInUser()` and `requirePreferences()`
- Always revalidate affected paths with `revalidatePath()`

### Component Architecture
- **API-style component logic**: Components with logic use a `use{ComponentName}API` hook
- **Client vs Server components**: Client components marked with `"use client"`
- **Page-specific components**: In `_components` directory within page folders
- **Shared components**: In top-level `components/` directory
- **MUI-first styling**: Use `Stack` for layout, minimal custom CSS
- **Type aliases**: Always create local aliases for database types

### Authentication & Authorization
- Google OAuth via NextAuth.js
- User data in `next_auth.users` table
- Server-side auth validation via `requireLoggedInUser()`
- User preferences validation via `requirePreferences()`

### Form Handling
- MUI components with `component="form"` on `Stack`
- Server actions called directly or with `.bind()` from client
- Form drafts saved to database for persistence

### Testing Strategy
- **Integration tests**: Focus on user flows, not isolated units
- **Database tests**: Use PGTap for stored procedures
- **Real implementations**: Avoid mocks except for external dependencies
- **Mutation testing**: Stryker for code quality validation

## Development Workflow

1. **Start local environment**: `pnpm db:start && pnpm dev`
2. **Create new migration**: `pnpm db:new-migration` (follow sequential naming)
3. **Regenerate types**: `pnpm db:gen-types` (after schema changes)
4. **Run tests**: `pnpm test` (includes database tests)
5. **Format code**: `pnpm format` (UI and SQL files)
6. **Lint**: `pnpm lint`

## Key Domain Concepts

- **Exercises**: Barbell, dumbbell, machine, and bodyweight exercises
- **Exercise Blocks**: Grouped exercises with sequences
- **Wendler 5/3/1**: Complete implementation with cycle management
- **Personal Records**: Automatic tracking with historical data
- **User Preferences**: Weight units and available equipment configuration