# Manchester United Analytics Dashboard

Analytics dashboard for Manchester United FC, built with React 18 + TypeScript.

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM v6
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts
- **UI Components:** Shadcn/ui + Tailwind CSS
- **Testing:** Vitest + React Testing Library
- **Node:** 20.x LTS

## Architecture

Hexagonal Architecture (Ports & Adapters):

- `src/core/` - Domain entities, use cases, ports
- `src/infrastructure/` - External adapters (API, cache, websockets)
- `src/presentation/` - UI layer (components, pages, hooks, store)
- `src/shared/` - Shared utilities and types

## Prerequisites

- Node.js 20.x LTS
- npm 10+

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and fill in your API key
4. Start dev server: `npm run dev`

## Scripts

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Format with Prettier           |
| `npm run test`          | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |

## Environment Variables

See `.env.example` for all required variables. Key variables:

- `VITE_API_FOOTBALL_KEY` - Your API Football key (get at api-football.com)
- `VITE_USE_MOCK_DATA` - Set to `true` for development without API key
- `VITE_API_RATE_LIMIT` - Daily API request limit (default: 100)

## API

Uses [API Football v3](https://www.api-football.com/documentation-v3).
**Important:** Free tier has a limit of 100 requests/day. The app tracks and blocks requests when limit is reached.

## Branch Strategy

- `main` - Production branch (protected, requires PR + CI)
- `develop` - Development branch (protected, requires PR + CI)
- Feature branches: `feature/issue-{number}-{description}`
- Fix branches: `fix/issue-{number}-{description}`

## Commit Convention

```
feat(scope): description
fix(scope): description
refactor(scope): description
test(scope): description
docs(scope): description
```
