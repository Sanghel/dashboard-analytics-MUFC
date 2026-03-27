# MUFC Dashboard — Real API Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar todos los datos mock del dashboard con datos reales de API-Football v3, cubriendo fixtures, standings, player stats, estadísticas de equipo, eventos de partido y polling de partido en vivo.

**Architecture:** Toda la infraestructura base existe: `footballApi.ts` (axios con rate limiting), endpoints `fixtures/standings/players/teams.api.ts`, hooks de React Query y flag `VITE_USE_MOCK_DATA`. Este plan agrega los endpoints faltantes (`/fixtures/events`, `/fixtures/statistics`, `/fixtures?live=all`), corrige la paginación de jugadores, y deriva el gráfico de temporada desde los fixtures reales en lugar de mock JSON.

**Tech Stack:** React 19, TypeScript 5.9, Axios 1.13, React Query v5, Zustand 5, Vite, Vitest 4

**GitHub Workflow por tarea:**

1. Crear issue en GitHub
2. Crear rama `feature/issue-{N}-{description}` desde `develop`
3. Desarrollar con TDD
4. Push rama + PR a `develop`
5. Merge a `develop`
6. Al final de cada FASE: PR de `develop` a `main`

---

## Endpoints API-Football v3 involucrados

Base URL: `https://v3.football.api-sports.io`
Auth headers: `x-rapidapi-key: {VITE_API_FOOTBALL_KEY}` + `x-rapidapi-host: v3.football.api-sports.io`

| Endpoint                   | Método                          | Params requeridos | Vista                 |
| -------------------------- | ------------------------------- | ----------------- | --------------------- |
| `GET /fixtures`            | `team=33&season=2024`           | Ya existe         | Overview, LiveMatch   |
| `GET /standings`           | `league=39&season=2024`         | Ya existe         | Standings, Overview   |
| `GET /players`             | `team=33&season=2024&page=N`    | Fix paginación    | PlayerStats, Tactical |
| `GET /teams/statistics`    | `team=33&league=39&season=2024` | Ya existe         | Overview              |
| `GET /fixtures/events`     | `fixture={id}`                  | **NUEVO**         | LiveMatch             |
| `GET /fixtures/statistics` | `fixture={id}`                  | **NUEVO**         | LiveMatch             |
| `GET /fixtures?live=all`   | —                               | **NUEVO**         | LiveMatch             |

---

## Mapa de archivos

### Archivos a CREAR:

- `src/infrastructure/api/endpoints/fixtureEvents.api.ts` — `GET /fixtures/events`
- `src/infrastructure/api/endpoints/fixtureStatistics.api.ts` — `GET /fixtures/statistics`
- `src/infrastructure/api/endpoints/liveFixtures.api.ts` — `GET /fixtures?live=all`
- `src/infrastructure/api/mocks/fixtureEvents.mock.json` — mock para events
- `src/infrastructure/api/mocks/fixtureStatistics.mock.json` — mock para statistics
- `src/presentation/hooks/useFixtureDetail.ts` — hook combinado events + statistics
- `src/presentation/hooks/useLiveFixtures.ts` — hook con polling 30s

### Archivos a MODIFICAR:

- `src/shared/types/football.ts` — agregar `FixtureEvent`, `FixtureStatistic`
- `src/infrastructure/api/endpoints/players.api.ts` — fix paginación
- `src/presentation/hooks/useSeasonPerformance.ts` — derivar de fixtures reales
- `src/presentation/pages/LiveMatchPage.tsx` — usar datos reales

### Archivos a CREAR (tests):

- `src/infrastructure/api/endpoints/fixtureEvents.api.test.ts`
- `src/infrastructure/api/endpoints/fixtureStatistics.api.test.ts`
- `src/infrastructure/api/endpoints/liveFixtures.api.test.ts`
- `src/presentation/hooks/useFixtureDetail.test.ts`
- `src/presentation/hooks/useLiveFixtures.test.ts`
- `src/presentation/hooks/useSeasonPerformance.test.ts`

---

## Fase 0 — Limpieza del workspace

> No requiere issue ni rama — commit directo a `develop`.

### Task 0.1: Commit cambios pendientes en `.gitignore`

El `.gitignore` tiene `.vercel` agregado pero sin commit. Además `coverage/` está sin trackear y sin estar en `.gitignore`.

**Files:**

- Modify: `.gitignore`

- [ ] **Step 1: Agregar `coverage/` al `.gitignore`**

```
# Abrir .gitignore y agregar al final:
coverage/
```

- [ ] **Step 2: Verificar el estado del workspace**

```bash
git status
```

Expected: `.gitignore` modified, `coverage/` untracked.

- [ ] **Step 3: Commit el `.gitignore`**

```bash
git checkout develop
git add .gitignore
git commit -m "chore: add .vercel and coverage/ to .gitignore"
```

Expected: commit exitoso en develop.

---

## Fase 1 — Tipos nuevos + Fix paginación de jugadores

**Objetivo:** Agregar los tipos TypeScript necesarios para los nuevos endpoints y corregir el bug crítico de paginación en `players.api.ts`. La API devuelve máximo 20 jugadores por página — sin paginación solo ves el primer tercio del plantel.

**Al finalizar:** PR de `develop` a `main`.

---

### Task 1.1: Agregar `FixtureEvent` y `FixtureStatistic` a `football.ts`

**GitHub:** Crear issue "feat: add FixtureEvent and FixtureStatistic types"

**Files:**

- Modify: `src/shared/types/football.ts`

**Respuesta real de `GET /fixtures/events?fixture=215662`:**

```json
{
  "response": [
    {
      "time": { "elapsed": 12, "extra": null },
      "team": { "id": 33, "name": "Manchester United", "logo": "..." },
      "player": { "id": 19185, "name": "M. Rashford" },
      "assist": { "id": null, "name": null },
      "type": "Goal",
      "detail": "Normal Goal",
      "comments": null
    }
  ]
}
```

**Respuesta real de `GET /fixtures/statistics?fixture=215662`:**

```json
{
  "response": [
    {
      "team": { "id": 33, "name": "Manchester United", "logo": "..." },
      "statistics": [
        { "type": "Ball Possession", "value": "54%" },
        { "type": "Total Shots", "value": 14 },
        { "type": "Shots on Goal", "value": 6 },
        { "type": "Corner Kicks", "value": 7 },
        { "type": "Fouls", "value": 8 },
        { "type": "Yellow Cards", "value": 1 },
        { "type": "Red Cards", "value": 0 },
        { "type": "Offsides", "value": 2 }
      ]
    }
  ]
}
```

- [ ] **Step 1: Escribir el test de tipos**

Crear `src/shared/types/football.test.ts`:

```typescript
import { describe, it, expectTypeOf } from 'vitest';
import type { FixtureEvent, FixtureStatistic, FixtureStatTeam } from './football';

describe('FixtureEvent type', () => {
  it('has required fields', () => {
    expectTypeOf<FixtureEvent>().toHaveProperty('time');
    expectTypeOf<FixtureEvent>().toHaveProperty('team');
    expectTypeOf<FixtureEvent>().toHaveProperty('player');
    expectTypeOf<FixtureEvent>().toHaveProperty('type');
    expectTypeOf<FixtureEvent>().toHaveProperty('detail');
  });
});

describe('FixtureStatTeam type', () => {
  it('has required fields', () => {
    expectTypeOf<FixtureStatTeam>().toHaveProperty('team');
    expectTypeOf<FixtureStatTeam>().toHaveProperty('statistics');
  });
});
```

- [ ] **Step 2: Correr test para verificar que falla**

```bash
npx vitest run src/shared/types/football.test.ts
```

Expected: FAIL — `FixtureEvent` and `FixtureStatTeam` are not exported.

- [ ] **Step 3: Agregar los tipos a `football.ts`**

Agregar al final de `src/shared/types/football.ts`:

```typescript
export interface FixtureEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number | null; name: string | null };
  assist: { id: number | null; name: string | null };
  type: 'Goal' | 'Card' | 'subst' | 'Var';
  detail: string;
  comments: string | null;
}

export interface FixtureStat {
  type: string;
  value: number | string | null;
}

export interface FixtureStatTeam {
  team: { id: number; name: string; logo: string };
  statistics: FixtureStat[];
}
```

- [ ] **Step 4: Correr test para verificar que pasa**

```bash
npx vitest run src/shared/types/football.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/shared/types/football.ts src/shared/types/football.test.ts
git commit -m "feat(types): add FixtureEvent, FixtureStat and FixtureStatTeam types"
```

- [ ] **Step 6: Push y crear PR a `develop`**

```bash
git push origin HEAD
gh pr create --base develop --title "feat(types): add FixtureEvent and FixtureStatistic types" --body "Adds TypeScript types for /fixtures/events and /fixtures/statistics API responses. Closes #<N>"
```

---

### Task 1.2: Fix paginación en `players.api.ts`

**GitHub:** Crear issue "fix: handle pagination in fetchPlayers endpoint"

**Files:**

- Modify: `src/infrastructure/api/endpoints/players.api.ts`
- Modify: `src/infrastructure/api/endpoints/players.api.test.ts` (ya existe)

**Problema:** `GET /players?team=33&season=2024` devuelve paginado:

```json
{
  "paging": { "current": 1, "total": 3 },
  "response": [
    /* 20 players */
  ]
}
```

El código actual solo pide la página 1. Manchester United tiene ~30-40 jugadores registrados.

- [ ] **Step 1: Crear rama desde develop**

```bash
git checkout develop
git checkout -b feature/issue-{N}-fix-players-pagination
```

- [ ] **Step 2: Escribir los tests**

Editar `src/infrastructure/api/endpoints/players.api.test.ts` (o crear si no existe en esta forma):

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchPlayers } from './players.api';
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';

vi.mock('../footballApi', () => ({
  footballApiClient: { get: vi.fn() },
}));

vi.mock('@/shared/config/env', () => ({
  env: { useMockData: false, teamId: 33 },
}));

const mockGet = vi.mocked(footballApiClient.get);

describe('fetchPlayers', () => {
  beforeEach(() => vi.clearAllMocks());

  it('fetches a single page when total pages is 1', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        paging: { current: 1, total: 1 },
        response: [{ player: { id: 1 }, statistics: [] }],
      },
    });

    const result = await fetchPlayers(33, 2024);
    expect(mockGet).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(1);
  });

  it('fetches all pages when total > 1', async () => {
    mockGet
      .mockResolvedValueOnce({
        data: {
          paging: { current: 1, total: 2 },
          response: [{ player: { id: 1 }, statistics: [] }],
        },
      })
      .mockResolvedValueOnce({
        data: {
          paging: { current: 2, total: 2 },
          response: [{ player: { id: 2 }, statistics: [] }],
        },
      });

    const result = await fetchPlayers(33, 2024);
    expect(mockGet).toHaveBeenCalledTimes(2);
    expect(mockGet).toHaveBeenNthCalledWith(1, '/players', {
      params: { team: 33, season: 2024, page: 1 },
    });
    expect(mockGet).toHaveBeenNthCalledWith(2, '/players', {
      params: { team: 33, season: 2024, page: 2 },
    });
    expect(result).toHaveLength(2);
  });
});
```

- [ ] **Step 3: Correr tests para verificar que fallan**

```bash
npx vitest run src/infrastructure/api/endpoints/players.api.test.ts
```

Expected: FAIL — la implementación actual no soporta paginación.

- [ ] **Step 4: Reemplazar `players.api.ts` con lógica de paginación**

```typescript
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import playersMock from '../mocks/players.mock.json';
import type { PlayerStats } from '@/shared/types/football';

export async function fetchPlayers(teamId = env.teamId, season = 2024): Promise<PlayerStats[]> {
  if (env.useMockData) {
    return playersMock.response as unknown as PlayerStats[];
  }

  const allPlayers: PlayerStats[] = [];
  let currentPage = 1;
  let totalPages = 1;

  do {
    const { data } = await footballApiClient.get('/players', {
      params: { team: teamId, season, page: currentPage },
    });
    allPlayers.push(...(data.response as PlayerStats[]));
    totalPages = data.paging.total as number;
    currentPage++;
  } while (currentPage <= totalPages);

  return allPlayers;
}
```

- [ ] **Step 5: Correr tests para verificar que pasan**

```bash
npx vitest run src/infrastructure/api/endpoints/players.api.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit + PR**

```bash
git add src/infrastructure/api/endpoints/players.api.ts src/infrastructure/api/endpoints/players.api.test.ts
git commit -m "fix(players): fetch all pages to get complete squad data"
git push origin HEAD
gh pr create --base develop --title "fix(players): handle pagination in fetchPlayers" --body "Fetches all pages from /players endpoint. Without this fix only the first 20 players out of ~35 were returned. Closes #<N>"
```

---

### Merge Fase 1 → main

- [ ] Verificar que ambas PRs están mergeadas en `develop`
- [ ] Crear PR de `develop` a `main`:

```bash
gh pr create --base main --head develop --title "Release: Phase 1 - Types and players pagination fix" --body "- Add FixtureEvent, FixtureStat, FixtureStatTeam types\n- Fix players API pagination (was returning only 20/35 players)"
```

---

## Fase 2 — LiveMatch con datos reales

**Objetivo:** Reemplazar `MOCK_MATCH_EVENTS` y `MOCK_MATCH_STATS` hardcodeados en `LiveMatchPage.tsx` con datos reales de `/fixtures/events` y `/fixtures/statistics`.

**Al finalizar:** PR de `develop` a `main`.

---

### Task 2.1: Endpoint `fixtureEvents.api.ts`

**GitHub:** Crear issue "feat: add fixture events endpoint"

**Files:**

- Create: `src/infrastructure/api/endpoints/fixtureEvents.api.ts`
- Create: `src/infrastructure/api/endpoints/fixtureEvents.api.test.ts`
- Create: `src/infrastructure/api/mocks/fixtureEvents.mock.json`

- [ ] **Step 1: Crear mock JSON**

Crear `src/infrastructure/api/mocks/fixtureEvents.mock.json`:

```json
{
  "response": [
    {
      "time": { "elapsed": 12, "extra": null },
      "team": { "id": 33, "name": "Manchester United", "logo": "" },
      "player": { "id": 19185, "name": "M. Rashford" },
      "assist": { "id": null, "name": null },
      "type": "Goal",
      "detail": "Normal Goal",
      "comments": null
    },
    {
      "time": { "elapsed": 34, "extra": null },
      "team": { "id": 40, "name": "Liverpool", "logo": "" },
      "player": { "id": 18978, "name": "M. Salah" },
      "assist": { "id": null, "name": null },
      "type": "Card",
      "detail": "Yellow Card",
      "comments": null
    },
    {
      "time": { "elapsed": 45, "extra": 2 },
      "team": { "id": 33, "name": "Manchester United", "logo": "" },
      "player": { "id": 521, "name": "B. Fernandes" },
      "assist": { "id": null, "name": null },
      "type": "Goal",
      "detail": "Penalty",
      "comments": null
    }
  ]
}
```

- [ ] **Step 2: Escribir el test**

Crear `src/infrastructure/api/endpoints/fixtureEvents.api.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchFixtureEvents } from './fixtureEvents.api';
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';

vi.mock('../footballApi', () => ({
  footballApiClient: { get: vi.fn() },
}));

vi.mock('@/shared/config/env', () => ({
  env: { useMockData: false },
}));

const mockGet = vi.mocked(footballApiClient.get);

describe('fetchFixtureEvents', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls /fixtures/events with fixtureId', async () => {
    mockGet.mockResolvedValueOnce({ data: { response: [] } });
    await fetchFixtureEvents(215662);
    expect(mockGet).toHaveBeenCalledWith('/fixtures/events', {
      params: { fixture: 215662 },
    });
  });

  it('returns mapped events array', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        response: [
          {
            time: { elapsed: 12, extra: null },
            team: { id: 33, name: 'Manchester United', logo: '' },
            player: { id: 19185, name: 'M. Rashford' },
            assist: { id: null, name: null },
            type: 'Goal',
            detail: 'Normal Goal',
            comments: null,
          },
        ],
      },
    });

    const result = await fetchFixtureEvents(215662);
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('Goal');
    expect(result[0].player.name).toBe('M. Rashford');
    expect(result[0].time.elapsed).toBe(12);
  });

  it('returns mock data when useMockData is true', async () => {
    vi.mocked(env).useMockData = true;
    const result = await fetchFixtureEvents(1);
    expect(mockGet).not.toHaveBeenCalled();
    expect(result.length).toBeGreaterThan(0);
    vi.mocked(env).useMockData = false;
  });
});
```

- [ ] **Step 3: Correr test para verificar que falla**

```bash
npx vitest run src/infrastructure/api/endpoints/fixtureEvents.api.test.ts
```

Expected: FAIL — módulo no existe.

- [ ] **Step 4: Crear `fixtureEvents.api.ts`**

```typescript
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import fixtureEventsMock from '../mocks/fixtureEvents.mock.json';
import type { FixtureEvent } from '@/shared/types/football';

export async function fetchFixtureEvents(fixtureId: number): Promise<FixtureEvent[]> {
  if (env.useMockData) {
    return fixtureEventsMock.response as unknown as FixtureEvent[];
  }
  const { data } = await footballApiClient.get('/fixtures/events', {
    params: { fixture: fixtureId },
  });
  return data.response as FixtureEvent[];
}
```

- [ ] **Step 5: Correr tests para verificar que pasan**

```bash
npx vitest run src/infrastructure/api/endpoints/fixtureEvents.api.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit + PR**

```bash
git add src/infrastructure/api/endpoints/fixtureEvents.api.ts \
        src/infrastructure/api/endpoints/fixtureEvents.api.test.ts \
        src/infrastructure/api/mocks/fixtureEvents.mock.json
git commit -m "feat(api): add fixture events endpoint"
git push origin HEAD
gh pr create --base develop --title "feat(api): add fixture events endpoint" --body "Adds fetchFixtureEvents() calling GET /fixtures/events. Closes #<N>"
```

---

### Task 2.2: Endpoint `fixtureStatistics.api.ts`

**GitHub:** Crear issue "feat: add fixture statistics endpoint"

**Files:**

- Create: `src/infrastructure/api/endpoints/fixtureStatistics.api.ts`
- Create: `src/infrastructure/api/endpoints/fixtureStatistics.api.test.ts`
- Create: `src/infrastructure/api/mocks/fixtureStatistics.mock.json`

- [ ] **Step 1: Crear mock JSON**

Crear `src/infrastructure/api/mocks/fixtureStatistics.mock.json`:

```json
{
  "response": [
    {
      "team": { "id": 33, "name": "Manchester United", "logo": "" },
      "statistics": [
        { "type": "Ball Possession", "value": "54%" },
        { "type": "Total Shots", "value": 14 },
        { "type": "Shots on Goal", "value": 6 },
        { "type": "Corner Kicks", "value": 7 },
        { "type": "Fouls", "value": 8 },
        { "type": "Yellow Cards", "value": 1 },
        { "type": "Red Cards", "value": 0 },
        { "type": "Offsides", "value": 2 }
      ]
    },
    {
      "team": { "id": 40, "name": "Liverpool", "logo": "" },
      "statistics": [
        { "type": "Ball Possession", "value": "46%" },
        { "type": "Total Shots", "value": 9 },
        { "type": "Shots on Goal", "value": 3 },
        { "type": "Corner Kicks", "value": 4 },
        { "type": "Fouls", "value": 12 },
        { "type": "Yellow Cards", "value": 2 },
        { "type": "Red Cards", "value": 0 },
        { "type": "Offsides", "value": 1 }
      ]
    }
  ]
}
```

- [ ] **Step 2: Escribir el test**

Crear `src/infrastructure/api/endpoints/fixtureStatistics.api.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchFixtureStatistics } from './fixtureStatistics.api';
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';

vi.mock('../footballApi', () => ({
  footballApiClient: { get: vi.fn() },
}));

vi.mock('@/shared/config/env', () => ({
  env: { useMockData: false },
}));

const mockGet = vi.mocked(footballApiClient.get);

describe('fetchFixtureStatistics', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls /fixtures/statistics with fixtureId', async () => {
    mockGet.mockResolvedValueOnce({ data: { response: [] } });
    await fetchFixtureStatistics(215662);
    expect(mockGet).toHaveBeenCalledWith('/fixtures/statistics', {
      params: { fixture: 215662 },
    });
  });

  it('returns two team stat objects', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        response: [
          {
            team: { id: 33, name: 'Manchester United', logo: '' },
            statistics: [
              { type: 'Ball Possession', value: '54%' },
              { type: 'Total Shots', value: 14 },
            ],
          },
          {
            team: { id: 40, name: 'Liverpool', logo: '' },
            statistics: [
              { type: 'Ball Possession', value: '46%' },
              { type: 'Total Shots', value: 9 },
            ],
          },
        ],
      },
    });

    const result = await fetchFixtureStatistics(215662);
    expect(result).toHaveLength(2);
    expect(result[0].team.id).toBe(33);
    expect(result[0].statistics[0].type).toBe('Ball Possession');
    expect(result[1].team.id).toBe(40);
  });
});
```

- [ ] **Step 3: Correr test para verificar que falla**

```bash
npx vitest run src/infrastructure/api/endpoints/fixtureStatistics.api.test.ts
```

Expected: FAIL.

- [ ] **Step 4: Crear `fixtureStatistics.api.ts`**

```typescript
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import fixtureStatsMock from '../mocks/fixtureStatistics.mock.json';
import type { FixtureStatTeam } from '@/shared/types/football';

export async function fetchFixtureStatistics(fixtureId: number): Promise<FixtureStatTeam[]> {
  if (env.useMockData) {
    return fixtureStatsMock.response as unknown as FixtureStatTeam[];
  }
  const { data } = await footballApiClient.get('/fixtures/statistics', {
    params: { fixture: fixtureId },
  });
  return data.response as FixtureStatTeam[];
}
```

- [ ] **Step 5: Correr tests para verificar que pasan**

```bash
npx vitest run src/infrastructure/api/endpoints/fixtureStatistics.api.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit + PR**

```bash
git add src/infrastructure/api/endpoints/fixtureStatistics.api.ts \
        src/infrastructure/api/endpoints/fixtureStatistics.api.test.ts \
        src/infrastructure/api/mocks/fixtureStatistics.mock.json
git commit -m "feat(api): add fixture statistics endpoint"
git push origin HEAD
gh pr create --base develop --title "feat(api): add fixture statistics endpoint" --body "Adds fetchFixtureStatistics() calling GET /fixtures/statistics. Closes #<N>"
```

---

### Task 2.3: Hook `useFixtureDetail`

**GitHub:** Crear issue "feat: add useFixtureDetail hook for match events and statistics"

**Files:**

- Create: `src/presentation/hooks/useFixtureDetail.ts`
- Create: `src/presentation/hooks/useFixtureDetail.test.ts`

- [ ] **Step 1: Crear rama**

```bash
git checkout develop
git checkout -b feature/issue-{N}-use-fixture-detail-hook
```

- [ ] **Step 2: Escribir el test**

Crear `src/presentation/hooks/useFixtureDetail.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useFixtureDetail } from './useFixtureDetail';
import * as fixtureEventsApi from '@/infrastructure/api/endpoints/fixtureEvents.api';
import * as fixtureStatsApi from '@/infrastructure/api/endpoints/fixtureStatistics.api';

vi.mock('@/infrastructure/api/endpoints/fixtureEvents.api');
vi.mock('@/infrastructure/api/endpoints/fixtureStatistics.api');

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useFixtureDetail', () => {
  it('returns null data when fixtureId is undefined', () => {
    const { result } = renderHook(() => useFixtureDetail(undefined), { wrapper });
    expect(result.current.events).toBeUndefined();
    expect(result.current.statistics).toBeUndefined();
  });

  it('fetches events and statistics when fixtureId is provided', async () => {
    vi.mocked(fixtureEventsApi.fetchFixtureEvents).mockResolvedValue([
      {
        time: { elapsed: 12, extra: null },
        team: { id: 33, name: 'Manchester United', logo: '' },
        player: { id: 1, name: 'Rashford' },
        assist: { id: null, name: null },
        type: 'Goal',
        detail: 'Normal Goal',
        comments: null,
      },
    ]);
    vi.mocked(fixtureStatsApi.fetchFixtureStatistics).mockResolvedValue([]);

    const { result } = renderHook(() => useFixtureDetail(215662), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.events).toHaveLength(1);
    expect(fixtureEventsApi.fetchFixtureEvents).toHaveBeenCalledWith(215662);
    expect(fixtureStatsApi.fetchFixtureStatistics).toHaveBeenCalledWith(215662);
  });
});
```

- [ ] **Step 3: Correr test para verificar que falla**

```bash
npx vitest run src/presentation/hooks/useFixtureDetail.test.ts
```

Expected: FAIL.

- [ ] **Step 4: Crear `useFixtureDetail.ts`**

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchFixtureEvents } from '@/infrastructure/api/endpoints/fixtureEvents.api';
import { fetchFixtureStatistics } from '@/infrastructure/api/endpoints/fixtureStatistics.api';
import type { FixtureEvent, FixtureStatTeam } from '@/shared/types/football';

export function useFixtureDetail(fixtureId: number | undefined) {
  const eventsQuery = useQuery<FixtureEvent[]>({
    queryKey: ['fixture', 'events', fixtureId],
    queryFn: () => fetchFixtureEvents(fixtureId!),
    enabled: fixtureId !== undefined,
    staleTime: 5 * 60 * 1000,
  });

  const statisticsQuery = useQuery<FixtureStatTeam[]>({
    queryKey: ['fixture', 'statistics', fixtureId],
    queryFn: () => fetchFixtureStatistics(fixtureId!),
    enabled: fixtureId !== undefined,
    staleTime: 5 * 60 * 1000,
  });

  return {
    events: eventsQuery.data,
    statistics: statisticsQuery.data,
    isLoading: eventsQuery.isLoading || statisticsQuery.isLoading,
    isError: eventsQuery.isError || statisticsQuery.isError,
  };
}
```

- [ ] **Step 5: Correr tests para verificar que pasan**

```bash
npx vitest run src/presentation/hooks/useFixtureDetail.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit + PR**

```bash
git add src/presentation/hooks/useFixtureDetail.ts src/presentation/hooks/useFixtureDetail.test.ts
git commit -m "feat(hooks): add useFixtureDetail hook for events and statistics"
git push origin HEAD
gh pr create --base develop --title "feat(hooks): add useFixtureDetail hook" --body "Closes #<N>"
```

---

### Task 2.4: Actualizar `LiveMatchPage` con datos reales

**GitHub:** Crear issue "feat: connect LiveMatchPage to real fixture events and statistics"

**Files:**

- Modify: `src/presentation/pages/LiveMatchPage.tsx`

**Qué hay que hacer:**

1. Obtener el `id` del último partido de `lastMatch.id`
2. Usar `useFixtureDetail(lastMatch?.id)` para events y statistics
3. Reemplazar `MOCK_MATCH_EVENTS` con events reales mapeados
4. Reemplazar `MOCK_MATCH_STATS` con statistics reales mapeados

**Mapping de statistics a los labels del chart:**
La API devuelve tipos como `"Ball Possession"`, `"Total Shots"`, `"Shots on Goal"`, `"Corner Kicks"`, `"Fouls"`, `"Yellow Cards"`. Hay que extraer el valor numérico (strip el `%` si lo tiene) para pasarlo al `MatchStatsChart`.

- [ ] **Step 1: Crear rama**

```bash
git checkout develop
git checkout -b feature/issue-{N}-livematch-real-data
```

- [ ] **Step 2: Escribir el test de integración de la página**

Crear `src/presentation/pages/LiveMatchPage.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { LiveMatchPage } from './LiveMatchPage';
import * as fixturesHook from '@/presentation/hooks/useFixtures';
import * as fixtureDetailHook from '@/presentation/hooks/useFixtureDetail';
import type { Fixture, FixtureEvent, FixtureStatTeam } from '@/shared/types/football';

vi.mock('@/presentation/hooks/useFixtures');
vi.mock('@/presentation/hooks/useFixtureDetail');

const mockFixture: Fixture = {
  id: 215662,
  date: '2024-12-01T15:00:00+00:00',
  timestamp: 1733065200,
  status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
  homeTeam: { id: 33, name: 'Manchester United', shortName: 'MU', logo: '' },
  awayTeam: { id: 40, name: 'Liverpool', shortName: 'LIV', logo: '' },
  homeGoals: 2,
  awayGoals: 1,
  league: { id: 39, name: 'Premier League', logo: '', round: 'Round 14' },
  venue: { name: 'Old Trafford', city: 'Manchester' },
};

const mockEvents: FixtureEvent[] = [
  {
    time: { elapsed: 12, extra: null },
    team: { id: 33, name: 'Manchester United', logo: '' },
    player: { id: 1, name: 'M. Rashford' },
    assist: { id: null, name: null },
    type: 'Goal',
    detail: 'Normal Goal',
    comments: null,
  },
];

const mockStats: FixtureStatTeam[] = [
  {
    team: { id: 33, name: 'Manchester United', logo: '' },
    statistics: [
      { type: 'Ball Possession', value: '54%' },
      { type: 'Total Shots', value: 14 },
    ],
  },
  {
    team: { id: 40, name: 'Liverpool', logo: '' },
    statistics: [
      { type: 'Ball Possession', value: '46%' },
      { type: 'Total Shots', value: 9 },
    ],
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('LiveMatchPage', () => {
  it('shows real match events when available', async () => {
    vi.mocked(fixturesHook.useRecentFixtures).mockReturnValue({
      data: [mockFixture],
      isLoading: false,
    } as ReturnType<typeof fixturesHook.useRecentFixtures>);

    vi.mocked(fixtureDetailHook.useFixtureDetail).mockReturnValue({
      events: mockEvents,
      statistics: mockStats,
      isLoading: false,
      isError: false,
    });

    render(createElement(LiveMatchPage), { wrapper });
    await waitFor(() => {
      expect(screen.getByText('M. Rashford')).toBeInTheDocument();
    });
  });
});
```

- [ ] **Step 3: Correr test para verificar que falla**

```bash
npx vitest run src/presentation/pages/LiveMatchPage.test.tsx
```

Expected: FAIL — la página usa mocks hardcodeados.

- [ ] **Step 4: Reemplazar `LiveMatchPage.tsx`**

```typescript
import { useState } from 'react';
import { useRecentFixtures } from '@/presentation/hooks/useFixtures';
import { useFixtureDetail } from '@/presentation/hooks/useFixtureDetail';
import { MatchStatsChart } from '@/presentation/components/charts/MatchStatsChart';
import { LoadingPage } from '@/presentation/components/feedback/LoadingSpinner';
import { EmptyState } from '@/presentation/components/feedback/EmptyState';
import { Badge } from '@/components/ui/badge';
import type { FixtureStatTeam } from '@/shared/types/football';

function parseStatValue(value: number | string | null): number {
  if (value === null) return 0;
  if (typeof value === 'number') return value;
  return parseInt(value.replace('%', ''), 10) || 0;
}

function buildMatchStats(stats: FixtureStatTeam[], homeTeamId: number) {
  const homeStats = stats.find((s) => s.team.id === homeTeamId);
  const awayStats = stats.find((s) => s.team.id !== homeTeamId);
  if (!homeStats || !awayStats) return [];

  const statTypes = ['Ball Possession', 'Total Shots', 'Shots on Goal', 'Corner Kicks', 'Fouls', 'Yellow Cards'];
  return statTypes.map((type) => {
    const homeStat = homeStats.statistics.find((s) => s.type === type);
    const awayStat = awayStats.statistics.find((s) => s.type === type);
    return {
      label: type === 'Ball Possession' ? 'Possession' : type,
      home: parseStatValue(homeStat?.value ?? null),
      away: parseStatValue(awayStat?.value ?? null),
    };
  });
}

export function LiveMatchPage() {
  const [now] = useState(() => Math.floor(Date.now() / 1000));
  const { data: recent, isLoading } = useRecentFixtures(now);
  const lastMatch = recent?.[0];
  const { events, statistics, isLoading: detailLoading } = useFixtureDetail(lastMatch?.id);

  if (isLoading) return <LoadingPage />;
  if (!lastMatch)
    return (
      <EmptyState title="No match data available" description="No recent or live matches found." />
    );

  const homeTeamName = lastMatch.homeTeam.name;
  const awayTeamName = lastMatch.awayTeam.name;
  const matchStats = statistics ? buildMatchStats(statistics, lastMatch.homeTeam.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Match</h1>
        <p className="text-sm text-muted-foreground">Latest match details</p>
      </div>

      {/* Match header */}
      <div className="bg-card border border-white/5 rounded-xl p-6">
        <div className="text-center mb-2">
          <span className="text-xs text-muted-foreground">
            {lastMatch.league.name} · {lastMatch.league.round}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-foreground">{homeTeamName}</p>
            <p className="text-xs text-muted-foreground">Home</p>
          </div>
          <div className="text-center px-6">
            <p className="text-4xl font-bold text-foreground">
              {lastMatch.homeGoals ?? '-'} - {lastMatch.awayGoals ?? '-'}
            </p>
            <Badge className="mt-1 bg-muted text-muted-foreground">{lastMatch.status.long}</Badge>
          </div>
          <div className="text-center flex-1">
            <p className="text-lg font-bold text-foreground">{awayTeamName}</p>
            <p className="text-xs text-muted-foreground">Away</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Match Stats */}
        <div className="bg-card border border-white/5 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Match Statistics</h2>
          {detailLoading ? (
            <p className="text-sm text-muted-foreground">Loading statistics...</p>
          ) : matchStats.length > 0 ? (
            <MatchStatsChart stats={matchStats} homeTeam={homeTeamName} awayTeam={awayTeamName} />
          ) : (
            <p className="text-sm text-muted-foreground">No statistics available</p>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-card border border-white/5 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-foreground mb-4">Match Events</h2>
          {detailLoading ? (
            <p className="text-sm text-muted-foreground">Loading events...</p>
          ) : events && events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event, i) => {
                const isHome = event.team.id === lastMatch.homeTeam.id;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-3 text-sm ${isHome ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    <span className="text-muted-foreground w-8 text-center font-mono text-xs">
                      {event.time.elapsed}&apos;
                    </span>
                    <div
                      className={`flex-1 p-2 rounded-lg bg-muted/30 ${isHome ? 'text-left' : 'text-right'}`}
                    >
                      <p className="font-medium text-foreground">{event.player.name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground">{event.type} · {event.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No events available</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Correr tests para verificar que pasan**

```bash
npx vitest run src/presentation/pages/LiveMatchPage.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Correr todos los tests**

```bash
npx vitest run
```

Expected: todos pasan.

- [ ] **Step 7: Commit + PR**

```bash
git add src/presentation/pages/LiveMatchPage.tsx src/presentation/pages/LiveMatchPage.test.tsx
git commit -m "feat(livematch): replace hardcoded mock data with real fixture events and statistics"
git push origin HEAD
gh pr create --base develop --title "feat(livematch): connect to real match events and statistics" --body "Removes MOCK_MATCH_EVENTS and MOCK_MATCH_STATS. Uses useFixtureDetail hook to fetch real data from /fixtures/events and /fixtures/statistics. Closes #<N>"
```

---

### Merge Fase 2 → main

- [ ] Verificar que todas las PRs de Fase 2 están mergeadas en `develop`
- [ ] Crear PR de `develop` a `main`:

```bash
gh pr create --base main --head develop --title "Release: Phase 2 - LiveMatch real data" --body "- Add fixture events endpoint\n- Add fixture statistics endpoint\n- Add useFixtureDetail hook\n- LiveMatchPage now shows real events and statistics"
```

---

## Fase 3 — Season Performance desde datos reales

**Objetivo:** Reemplazar el mock JSON hardcodeado de `useSeasonPerformance` con datos derivados en cliente desde los fixtures reales. No hay endpoint dedicado para esto en API-Football — la performance se calcula match a match.

**Al finalizar:** PR de `develop` a `main`.

---

### Task 3.1: Derivar season performance desde fixtures reales

**GitHub:** Crear issue "feat: compute season performance from real fixtures data"

**Files:**

- Modify: `src/presentation/hooks/useSeasonPerformance.ts`
- Create: `src/presentation/hooks/useSeasonPerformance.test.ts`

**Lógica de derivación:**

- Filtrar fixtures del MU (homeTeam.id === 33 || awayTeam.id === 33)
- Filtrar solo partidos terminados (status.short === 'FT')
- Ordenar por `timestamp` ascendente
- Para cada partido calcular:
  - `goals`: goles que hizo el MU
  - `goalsAgainst`: goles que recibió el MU
  - `points`: 3 si ganó, 1 si empató, 0 si perdió
  - `matchday`: `GW${index + 1}`

- [ ] **Step 1: Crear rama**

```bash
git checkout develop
git checkout -b feature/issue-{N}-season-performance-real-data
```

- [ ] **Step 2: Escribir los tests**

Crear `src/presentation/hooks/useSeasonPerformance.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useSeasonPerformance } from './useSeasonPerformance';
import * as fixturesHook from './useFixtures';
import type { Fixture } from '@/shared/types/football';

vi.mock('./useFixtures');

const makeFixture = (
  id: number,
  homeId: number,
  awayId: number,
  homeGoals: number,
  awayGoals: number,
  timestamp: number
): Fixture => ({
  id,
  date: new Date(timestamp * 1000).toISOString(),
  timestamp,
  status: { long: 'Match Finished', short: 'FT', elapsed: 90 },
  homeTeam: {
    id: homeId,
    name: homeId === 33 ? 'Manchester United' : 'Opponent',
    shortName: '',
    logo: '',
  },
  awayTeam: {
    id: awayId,
    name: awayId === 33 ? 'Manchester United' : 'Opponent',
    shortName: '',
    logo: '',
  },
  homeGoals,
  awayGoals,
  league: { id: 39, name: 'Premier League', logo: '', round: 'Round 1' },
  venue: { name: '', city: '' },
});

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useSeasonPerformance', () => {
  it('returns empty array when no fixtures', async () => {
    vi.mocked(fixturesHook.useFixtures).mockReturnValue({
      data: [],
      isLoading: false,
    } as ReturnType<typeof fixturesHook.useFixtures>);

    const { result } = renderHook(() => useSeasonPerformance(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toEqual([]);
  });

  it('computes 3 points for a MU home win', async () => {
    vi.mocked(fixturesHook.useFixtures).mockReturnValue({
      data: [makeFixture(1, 33, 40, 2, 0, 1000)],
      isLoading: false,
    } as ReturnType<typeof fixturesHook.useFixtures>);

    const { result } = renderHook(() => useSeasonPerformance(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0]).toEqual({
      matchday: 'GW1',
      goals: 2,
      goalsAgainst: 0,
      points: 3,
    });
  });

  it('computes 1 point for a draw', async () => {
    vi.mocked(fixturesHook.useFixtures).mockReturnValue({
      data: [makeFixture(2, 40, 33, 1, 1, 2000)],
      isLoading: false,
    } as ReturnType<typeof fixturesHook.useFixtures>);

    const { result } = renderHook(() => useSeasonPerformance(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data![0].points).toBe(1);
    expect(result.current.data![0].goals).toBe(1);
    expect(result.current.data![0].goalsAgainst).toBe(1);
  });

  it('computes 0 points for an away loss', async () => {
    vi.mocked(fixturesHook.useFixtures).mockReturnValue({
      data: [makeFixture(3, 40, 33, 3, 1, 3000)],
      isLoading: false,
    } as ReturnType<typeof fixturesHook.useFixtures>);

    const { result } = renderHook(() => useSeasonPerformance(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data![0].points).toBe(0);
    expect(result.current.data![0].goals).toBe(1);
    expect(result.current.data![0].goalsAgainst).toBe(3);
  });

  it('only includes finished matches (FT)', async () => {
    vi.mocked(fixturesHook.useFixtures).mockReturnValue({
      data: [
        makeFixture(1, 33, 40, 2, 0, 1000),
        {
          ...makeFixture(2, 33, 50, 0, 0, 2000),
          status: { long: 'Not Started', short: 'NS', elapsed: null },
        },
      ],
      isLoading: false,
    } as ReturnType<typeof fixturesHook.useFixtures>);

    const { result } = renderHook(() => useSeasonPerformance(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toHaveLength(1);
  });
});
```

- [ ] **Step 3: Correr tests para verificar que fallan**

```bash
npx vitest run src/presentation/hooks/useSeasonPerformance.test.ts
```

Expected: FAIL — la implementación actual siempre retorna mock data.

- [ ] **Step 4: Reemplazar `useSeasonPerformance.ts`**

```typescript
import { useMemo } from 'react';
import { useFixtures } from '@/presentation/hooks/useFixtures';
import type { Fixture } from '@/shared/types/football';

const MU_TEAM_ID = 33;

interface PerformanceDataPoint {
  matchday: string;
  goals: number;
  goalsAgainst: number;
  points: number;
}

function computePerformance(fixtures: Fixture[]): PerformanceDataPoint[] {
  return fixtures
    .filter(
      (f) =>
        f.status.short === 'FT' && (f.homeTeam.id === MU_TEAM_ID || f.awayTeam.id === MU_TEAM_ID)
    )
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((f, index) => {
      const isHome = f.homeTeam.id === MU_TEAM_ID;
      const goals = isHome ? (f.homeGoals ?? 0) : (f.awayGoals ?? 0);
      const goalsAgainst = isHome ? (f.awayGoals ?? 0) : (f.homeGoals ?? 0);
      let points = 0;
      if (goals > goalsAgainst) points = 3;
      else if (goals === goalsAgainst) points = 1;

      return {
        matchday: `GW${index + 1}`,
        goals,
        goalsAgainst,
        points,
      };
    });
}

export function useSeasonPerformance() {
  const { data: fixtures, isLoading } = useFixtures();

  const data = useMemo(() => {
    if (!fixtures) return [];
    return computePerformance(fixtures);
  }, [fixtures]);

  return { data, isLoading };
}
```

- [ ] **Step 5: Correr tests para verificar que pasan**

```bash
npx vitest run src/presentation/hooks/useSeasonPerformance.test.ts
```

Expected: PASS.

- [ ] **Step 6: Correr todos los tests**

```bash
npx vitest run
```

Expected: todos pasan.

- [ ] **Step 7: Commit + PR**

```bash
git add src/presentation/hooks/useSeasonPerformance.ts src/presentation/hooks/useSeasonPerformance.test.ts
git commit -m "feat(hooks): compute season performance from real fixtures instead of mock data"
git push origin HEAD
gh pr create --base develop --title "feat(hooks): derive season performance from real fixtures" --body "Removes mock JSON dependency. Computes per-matchday goals, goalsAgainst, and points by filtering/sorting real fixtures. Closes #<N>"
```

---

### Merge Fase 3 → main

```bash
gh pr create --base main --head develop --title "Release: Phase 3 - Season Performance from real data" --body "- Season performance chart now uses real fixture data\n- Derived client-side: no extra API call needed"
```

---

## Fase 4 — Live Match con polling en tiempo real

**Objetivo:** Cuando hay un partido en vivo del MU, mostrar datos actualizados automáticamente cada 30 segundos usando `GET /fixtures?live=all`.

**Al finalizar:** PR de `develop` a `main`.

---

### Task 4.1: Endpoint `liveFixtures.api.ts`

**GitHub:** Crear issue "feat: add live fixtures endpoint"

**Files:**

- Create: `src/infrastructure/api/endpoints/liveFixtures.api.ts`
- Create: `src/infrastructure/api/endpoints/liveFixtures.api.test.ts`

**Respuesta de `GET /fixtures?live=all`:**
Devuelve el mismo schema que `/fixtures` pero solo los partidos en curso en este momento. `live=all` trae todos los ligas. También puede ser `live=39` (solo PL) o `live=39-2` (PL + UCL).

- [ ] **Step 1: Crear rama**

```bash
git checkout develop
git checkout -b feature/issue-{N}-live-fixtures-endpoint
```

- [ ] **Step 2: Escribir el test**

Crear `src/infrastructure/api/endpoints/liveFixtures.api.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchLiveFixtures } from './liveFixtures.api';
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';

vi.mock('../footballApi', () => ({
  footballApiClient: { get: vi.fn() },
}));

vi.mock('@/shared/config/env', () => ({
  env: { useMockData: false, teamId: 33 },
}));

const mockGet = vi.mocked(footballApiClient.get);

describe('fetchLiveFixtures', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls /fixtures with live=all', async () => {
    mockGet.mockResolvedValueOnce({ data: { response: [] } });
    await fetchLiveFixtures();
    expect(mockGet).toHaveBeenCalledWith('/fixtures', {
      params: { live: 'all' },
    });
  });

  it('returns empty array when no live fixtures', async () => {
    mockGet.mockResolvedValueOnce({ data: { response: [] } });
    const result = await fetchLiveFixtures();
    expect(result).toEqual([]);
  });

  it('filters to MU fixtures only (teamId 33)', async () => {
    mockGet.mockResolvedValueOnce({
      data: {
        response: [
          {
            fixture: {
              id: 1,
              date: '',
              timestamp: 1000,
              status: { long: '1H', short: '1H', elapsed: 23 },
            },
            teams: {
              home: { id: 33, name: 'Manchester United', logo: '' },
              away: { id: 40, name: 'Liverpool', logo: '' },
            },
            goals: { home: 1, away: 0 },
            league: { id: 39, name: 'Premier League', logo: '', round: 'Round 14' },
            venue: { name: 'Old Trafford', city: 'Manchester' },
          },
          {
            fixture: {
              id: 2,
              date: '',
              timestamp: 2000,
              status: { long: '1H', short: '1H', elapsed: 30 },
            },
            teams: {
              home: { id: 50, name: 'Arsenal', logo: '' },
              away: { id: 60, name: 'Chelsea', logo: '' },
            },
            goals: { home: 0, away: 1 },
            league: { id: 39, name: 'Premier League', logo: '', round: 'Round 14' },
            venue: { name: 'Emirates', city: 'London' },
          },
        ],
      },
    });

    const result = await fetchLiveFixtures(33);
    expect(result).toHaveLength(1);
    expect(result[0].homeTeam.id).toBe(33);
  });

  it('returns mock empty array when useMockData is true', async () => {
    vi.mocked(env).useMockData = true;
    const result = await fetchLiveFixtures();
    expect(mockGet).not.toHaveBeenCalled();
    expect(result).toEqual([]);
    vi.mocked(env).useMockData = false;
  });
});
```

- [ ] **Step 3: Correr test para verificar que falla**

```bash
npx vitest run src/infrastructure/api/endpoints/liveFixtures.api.test.ts
```

Expected: FAIL.

- [ ] **Step 4: Crear `liveFixtures.api.ts`**

Reusar la función `mapFixture` — pero está en `fixtures.api.ts` como función local. Hay que extraerla a un helper compartido o duplicarla.

**Opción A (sin refactor):** Duplicar `mapFixture` localmente.

```typescript
import { footballApiClient } from '../footballApi';
import { env } from '@/shared/config/env';
import type { Fixture } from '@/shared/types/football';

function mapFixture(item: Record<string, unknown>): Fixture {
  const f = item.fixture as Record<string, unknown>;
  const teams = item.teams as Record<string, unknown>;
  const goals = item.goals as Record<string, unknown>;
  const league = item.league as Record<string, unknown>;
  const venue = item.venue as Record<string, unknown>;
  return {
    id: f.id as number,
    date: f.date as string,
    timestamp: f.timestamp as number,
    status: f.status as Fixture['status'],
    homeTeam: teams.home as unknown as Fixture['homeTeam'],
    awayTeam: teams.away as unknown as Fixture['awayTeam'],
    homeGoals: goals.home as number | null,
    awayGoals: goals.away as number | null,
    league: league as Fixture['league'],
    venue: venue as Fixture['venue'],
  };
}

export async function fetchLiveFixtures(teamId?: number): Promise<Fixture[]> {
  if (env.useMockData) {
    return []; // No live fixtures in mock mode
  }
  const { data } = await footballApiClient.get('/fixtures', {
    params: { live: 'all' },
  });
  const fixtures = (data.response as Record<string, unknown>[]).map(mapFixture);
  if (teamId === undefined) return fixtures;
  return fixtures.filter((f) => f.homeTeam.id === teamId || f.awayTeam.id === teamId);
}
```

- [ ] **Step 5: Correr tests para verificar que pasan**

```bash
npx vitest run src/infrastructure/api/endpoints/liveFixtures.api.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit + PR**

```bash
git add src/infrastructure/api/endpoints/liveFixtures.api.ts \
        src/infrastructure/api/endpoints/liveFixtures.api.test.ts
git commit -m "feat(api): add live fixtures endpoint with team filtering"
git push origin HEAD
gh pr create --base develop --title "feat(api): add live fixtures endpoint" --body "Adds fetchLiveFixtures() using GET /fixtures?live=all. Filters by teamId optionally. Closes #<N>"
```

---

### Task 4.2: Hook `useLiveFixtures` con polling

**GitHub:** Crear issue "feat: add useLiveFixtures hook with 30s polling"

**Files:**

- Create: `src/presentation/hooks/useLiveFixtures.ts`
- Create: `src/presentation/hooks/useLiveFixtures.test.ts`

- [ ] **Step 1: Crear rama**

```bash
git checkout develop
git checkout -b feature/issue-{N}-use-live-fixtures-hook
```

- [ ] **Step 2: Escribir el test**

Crear `src/presentation/hooks/useLiveFixtures.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { useLiveFixtures } from './useLiveFixtures';
import * as liveApi from '@/infrastructure/api/endpoints/liveFixtures.api';
import type { Fixture } from '@/shared/types/football';

vi.mock('@/infrastructure/api/endpoints/liveFixtures.api');

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return createElement(QueryClientProvider, { client: queryClient }, children);
};

const mockFixture: Fixture = {
  id: 99,
  date: '',
  timestamp: Date.now() / 1000,
  status: { long: 'First Half', short: '1H', elapsed: 23 },
  homeTeam: { id: 33, name: 'Manchester United', shortName: 'MU', logo: '' },
  awayTeam: { id: 40, name: 'Liverpool', shortName: 'LIV', logo: '' },
  homeGoals: 1,
  awayGoals: 0,
  league: { id: 39, name: 'Premier League', logo: '', round: 'Round 14' },
  venue: { name: 'Old Trafford', city: 'Manchester' },
};

describe('useLiveFixtures', () => {
  it('returns live fixtures when available', async () => {
    vi.mocked(liveApi.fetchLiveFixtures).mockResolvedValue([mockFixture]);

    const { result } = renderHook(() => useLiveFixtures(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].id).toBe(99);
    expect(result.current.hasLiveMatch).toBe(true);
  });

  it('hasLiveMatch is false when no live fixtures', async () => {
    vi.mocked(liveApi.fetchLiveFixtures).mockResolvedValue([]);

    const { result } = renderHook(() => useLiveFixtures(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasLiveMatch).toBe(false);
  });
});
```

- [ ] **Step 3: Correr test para verificar que falla**

```bash
npx vitest run src/presentation/hooks/useLiveFixtures.test.ts
```

Expected: FAIL.

- [ ] **Step 4: Crear `useLiveFixtures.ts`**

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchLiveFixtures } from '@/infrastructure/api/endpoints/liveFixtures.api';
import { env } from '@/shared/config/env';

const POLLING_INTERVAL_MS = 30 * 1000; // 30 seconds

export function useLiveFixtures() {
  const query = useQuery({
    queryKey: ['fixtures', 'live', env.teamId],
    queryFn: () => fetchLiveFixtures(env.teamId),
    staleTime: 0,
    refetchInterval: POLLING_INTERVAL_MS,
  });

  return {
    ...query,
    hasLiveMatch: (query.data?.length ?? 0) > 0,
  };
}
```

- [ ] **Step 5: Correr tests para verificar que pasan**

```bash
npx vitest run src/presentation/hooks/useLiveFixtures.test.ts
```

Expected: PASS.

- [ ] **Step 6: Commit + PR**

```bash
git add src/presentation/hooks/useLiveFixtures.ts src/presentation/hooks/useLiveFixtures.test.ts
git commit -m "feat(hooks): add useLiveFixtures hook with 30s polling"
git push origin HEAD
gh pr create --base develop --title "feat(hooks): add useLiveFixtures hook with polling" --body "Polls GET /fixtures?live=all every 30 seconds. Exposes hasLiveMatch boolean. Closes #<N>"
```

---

### Task 4.3: Priorizar partido en vivo en `LiveMatchPage`

**GitHub:** Crear issue "feat: show live match data with real-time polling in LiveMatchPage"

**Files:**

- Modify: `src/presentation/pages/LiveMatchPage.tsx`

**Lógica:**

- Si `hasLiveMatch === true` → mostrar el live fixture con badge "LIVE" y polling activo
- Si no → mostrar el último partido jugado (comportamiento actual)
- En ambos casos, `useFixtureDetail` aplica para events y statistics

- [ ] **Step 1: Crear rama**

```bash
git checkout develop
git checkout -b feature/issue-{N}-livematch-polling
```

- [ ] **Step 2: Actualizar el test de `LiveMatchPage`**

Agregar al `src/presentation/pages/LiveMatchPage.test.tsx` existente:

```typescript
import * as liveHook from '@/presentation/hooks/useLiveFixtures';

// Agregar este test al describe existente:
it('shows LIVE badge when a match is in progress', async () => {
  const liveFixture = { ...mockFixture, status: { long: 'First Half', short: '1H', elapsed: 23 } };

  vi.mocked(liveHook.useLiveFixtures).mockReturnValue({
    data: [liveFixture],
    hasLiveMatch: true,
    isLoading: false,
  } as ReturnType<typeof liveHook.useLiveFixtures>);

  vi.mocked(fixturesHook.useRecentFixtures).mockReturnValue({
    data: [mockFixture],
    isLoading: false,
  } as ReturnType<typeof fixturesHook.useRecentFixtures>);

  vi.mocked(fixtureDetailHook.useFixtureDetail).mockReturnValue({
    events: [],
    statistics: [],
    isLoading: false,
    isError: false,
  });

  render(createElement(LiveMatchPage), { wrapper });
  await waitFor(() => {
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Correr test para verificar que falla**

```bash
npx vitest run src/presentation/pages/LiveMatchPage.test.tsx
```

Expected: FAIL — no hay badge LIVE.

- [ ] **Step 4: Actualizar `LiveMatchPage.tsx` para priorizar live match**

Agregar al inicio de `LiveMatchPage`:

```typescript
import { useLiveFixtures } from '@/presentation/hooks/useLiveFixtures';

// Dentro del componente, reemplazar el bloque de selección del partido:
const { data: liveFixtures, hasLiveMatch } = useLiveFixtures();
const activeMatch = hasLiveMatch ? liveFixtures![0] : lastMatch;

// Usar activeMatch en lugar de lastMatch en todo el JSX
// Agregar badge condicional al status:
```

En el `Badge`:

```tsx
<Badge
  className={
    hasLiveMatch ? 'bg-red-500 text-white animate-pulse' : 'bg-muted text-muted-foreground'
  }
>
  {hasLiveMatch ? 'LIVE' : activeMatch.status.long}
</Badge>
```

Y pasar `activeMatch.id` a `useFixtureDetail`.

- [ ] **Step 5: Correr todos los tests**

```bash
npx vitest run
```

Expected: todos pasan.

- [ ] **Step 6: Commit + PR**

```bash
git add src/presentation/pages/LiveMatchPage.tsx src/presentation/pages/LiveMatchPage.test.tsx
git commit -m "feat(livematch): prioritize live match data with real-time polling"
git push origin HEAD
gh pr create --base develop --title "feat(livematch): show live match with polling when available" --body "LiveMatchPage now checks for live fixtures first. Shows animated LIVE badge and auto-refreshes every 30s during live matches. Closes #<N>"
```

---

### Merge Fase 4 → main

```bash
gh pr create --base main --head develop --title "Release: Phase 4 - Live Match polling" --body "- Add live fixtures endpoint\n- Add useLiveFixtures hook with 30s polling\n- LiveMatchPage prioritizes live fixtures with LIVE badge and auto-refresh"
```

---

## Checklist final de verificación

Antes de dar por completado el proyecto, verificar que `VITE_USE_MOCK_DATA=false` en `.env.local` y que:

- [ ] Overview muestra stats, fixtures y standings reales
- [ ] Standings muestra la tabla real de la Premier League (y UCL/Europa si el equipo califica)
- [ ] PlayerStats muestra el plantel completo (no solo 20 jugadores)
- [ ] TacticalAnalysis muestra stats reales de los jugadores
- [ ] LiveMatch muestra events y statistics reales del último partido
- [ ] Si hay partido en vivo: aparece badge LIVE y se refresca automáticamente

---

## Variables de entorno necesarias (`.env.local`)

```env
VITE_API_FOOTBALL_KEY=tu_api_key_aqui
VITE_API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
VITE_USE_MOCK_DATA=false
VITE_TEAM_ID=33
VITE_API_RATE_LIMIT=100
```
