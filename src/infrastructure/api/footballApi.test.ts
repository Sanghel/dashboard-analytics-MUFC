import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });

// Mock env module BEFORE importing footballApi
vi.mock('@/shared/config/env', () => ({
  env: {
    apiFootballKey: 'test-key',
    apiFootballBaseUrl: 'https://v3.football.api-sports.io',
    useMockData: true,
    teamId: 33,
    apiRateLimit: 100,
  },
}));

import {
  getApiRequestCount,
  incrementApiRequestCount,
  isApiLimitReached,
  ApiLimitError,
} from './footballApi';

describe('footballApi - rate limit counter', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('getApiRequestCount returns 0 when no data stored', () => {
    expect(getApiRequestCount()).toBe(0);
  });

  it('getApiRequestCount returns 0 on a new day (different stored date)', () => {
    // Store old date
    localStorage.setItem('mufc_api_requests_date', '2020-01-01');
    localStorage.setItem('mufc_api_requests', '50');
    const count = getApiRequestCount();
    expect(count).toBe(0);
  });

  it('getApiRequestCount returns correct count for today', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('mufc_api_requests_date', today);
    localStorage.setItem('mufc_api_requests', '42');
    expect(getApiRequestCount()).toBe(42);
  });

  it('incrementApiRequestCount increases count by 1', () => {
    expect(getApiRequestCount()).toBe(0);
    incrementApiRequestCount();
    expect(getApiRequestCount()).toBe(1);
    incrementApiRequestCount();
    expect(getApiRequestCount()).toBe(2);
  });

  it('isApiLimitReached returns false when below limit', () => {
    expect(isApiLimitReached()).toBe(false);
  });

  it('isApiLimitReached returns true when count equals limit (100)', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('mufc_api_requests_date', today);
    localStorage.setItem('mufc_api_requests', '100');
    expect(isApiLimitReached()).toBe(true);
  });

  it('isApiLimitReached returns true when count exceeds limit', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('mufc_api_requests_date', today);
    localStorage.setItem('mufc_api_requests', '150');
    expect(isApiLimitReached()).toBe(true);
  });

  it('counter resets to 0 on a new day', () => {
    // Set old date with high count
    localStorage.setItem('mufc_api_requests_date', '2000-01-01');
    localStorage.setItem('mufc_api_requests', '99');
    // Calling getApiRequestCount with a new day should reset
    const count = getApiRequestCount();
    expect(count).toBe(0);
    // And the date should now be today
    const today = new Date().toISOString().slice(0, 10);
    expect(localStorage.getItem('mufc_api_requests_date')).toBe(today);
  });
});

describe('ApiLimitError', () => {
  it('has correct message', () => {
    const error = new ApiLimitError();
    expect(error.message).toBe('API rate limit reached for today');
  });

  it('has correct name', () => {
    const error = new ApiLimitError();
    expect(error.name).toBe('ApiLimitError');
  });

  it('is an instance of Error', () => {
    const error = new ApiLimitError();
    expect(error).toBeInstanceOf(Error);
  });
});
