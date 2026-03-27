import { create } from 'zustand';
import { getApiRequestCount, isApiLimitReached } from '@/infrastructure/api/footballApi';
import { env } from '@/shared/config/env';

interface ApiLimitState {
  usedRequests: number;
  maxRequests: number;
  limitReached: boolean;
  checkLimit: () => void;
  refreshCount: () => void;
}

export const useApiLimitStore = create<ApiLimitState>()((set) => ({
  usedRequests: getApiRequestCount(),
  maxRequests: env.apiRateLimit,
  limitReached: isApiLimitReached(),
  checkLimit: () => {
    const used = getApiRequestCount();
    const limit = isApiLimitReached();
    set({ usedRequests: used, limitReached: limit });
  },
  refreshCount: () => {
    const used = getApiRequestCount();
    const limit = isApiLimitReached();
    set({ usedRequests: used, limitReached: limit });
  },
}));
