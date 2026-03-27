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

vi.mock('@/shared/config/env', () => ({
  env: {
    apiFootballKey: 'test-key',
    apiFootballBaseUrl: 'https://v3.football.api-sports.io',
    useMockData: true,
    teamId: 33,
    apiRateLimit: 100,
  },
}));

import { useApiLimitStore } from './apiLimitStore';

describe('apiLimitStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    // Reset store state
    useApiLimitStore.setState({
      usedRequests: 0,
      maxRequests: 100,
      limitReached: false,
    });
  });

  it('initial maxRequests is 100 (from env.apiRateLimit)', () => {
    const state = useApiLimitStore.getState();
    expect(state.maxRequests).toBe(100);
  });

  it('initial usedRequests is 0 when localStorage is empty', () => {
    useApiLimitStore.setState({ usedRequests: 0 });
    const state = useApiLimitStore.getState();
    expect(state.usedRequests).toBe(0);
  });

  it('initial limitReached is false when no requests made', () => {
    const state = useApiLimitStore.getState();
    expect(state.limitReached).toBe(false);
  });

  it('checkLimit updates usedRequests from localStorage', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('mufc_api_requests_date', today);
    localStorage.setItem('mufc_api_requests', '42');
    const { checkLimit } = useApiLimitStore.getState();
    checkLimit();
    expect(useApiLimitStore.getState().usedRequests).toBe(42);
  });

  it('checkLimit updates limitReached to true when at limit', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('mufc_api_requests_date', today);
    localStorage.setItem('mufc_api_requests', '100');
    const { checkLimit } = useApiLimitStore.getState();
    checkLimit();
    expect(useApiLimitStore.getState().limitReached).toBe(true);
  });

  it('checkLimit updates limitReached to false when below limit', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('mufc_api_requests_date', today);
    localStorage.setItem('mufc_api_requests', '50');
    const { checkLimit } = useApiLimitStore.getState();
    checkLimit();
    expect(useApiLimitStore.getState().limitReached).toBe(false);
    expect(useApiLimitStore.getState().usedRequests).toBe(50);
  });

  it('refreshCount updates usedRequests from localStorage', () => {
    const today = new Date().toISOString().slice(0, 10);
    localStorage.setItem('mufc_api_requests_date', today);
    localStorage.setItem('mufc_api_requests', '75');
    const { refreshCount } = useApiLimitStore.getState();
    refreshCount();
    expect(useApiLimitStore.getState().usedRequests).toBe(75);
  });
});
