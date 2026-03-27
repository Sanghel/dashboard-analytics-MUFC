# Architecture

This project uses Hexagonal Architecture (Ports & Adapters).

## Layers

### Core (Domain)

- `entities/` - Domain models (Team, Player, Match, Standing)
- `useCases/` - Business logic
- `ports/` - Interfaces for external dependencies

### Infrastructure (Adapters)

- `api/` - API Football HTTP client
- `cache/` - React Query configuration
- `websockets/` - Live match WebSocket client

### Presentation (UI)

- `components/` - React components (layout, stats, charts, feedback)
- `pages/` - Route-level page components
- `hooks/` - Custom React hooks
- `store/` - Zustand global state
- `routes/` - React Router configuration

### Shared

- `config/` - Environment configuration
- `constants/` - App-wide constants
- `types/` - Shared TypeScript types
- `utils/` - Pure utility functions

## Data Flow

1. User interaction -> Presentation layer
2. Presentation -> Custom hooks (useQuery wrappers)
3. Hooks -> Infrastructure (API/cache)
4. Infrastructure -> Core ports
5. Core -> Domain entities
