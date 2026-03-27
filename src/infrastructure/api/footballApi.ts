import axios from 'axios';
import { env } from '@/shared/config/env';

// Request counter key in localStorage
const COUNTER_KEY = 'mufc_api_requests';
const COUNTER_DATE_KEY = 'mufc_api_requests_date';

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getApiRequestCount(): number {
  const today = getTodayKey();
  const storedDate = localStorage.getItem(COUNTER_DATE_KEY);
  if (storedDate !== today) {
    localStorage.setItem(COUNTER_DATE_KEY, today);
    localStorage.setItem(COUNTER_KEY, '0');
    return 0;
  }
  return parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10);
}

export function incrementApiRequestCount(): void {
  const count = getApiRequestCount();
  localStorage.setItem(COUNTER_KEY, String(count + 1));
}

export function isApiLimitReached(): boolean {
  return getApiRequestCount() >= env.apiRateLimit;
}

export class ApiLimitError extends Error {
  constructor() {
    super('API rate limit reached for today');
    this.name = 'ApiLimitError';
  }
}

const footballApiClient = axios.create({
  baseURL: env.apiFootballBaseUrl,
  headers: {
    'x-rapidapi-key': env.apiFootballKey,
    'x-rapidapi-host': 'v3.football.api-sports.io',
  },
});

footballApiClient.interceptors.request.use((config) => {
  if (isApiLimitReached()) {
    throw new ApiLimitError();
  }
  incrementApiRequestCount();
  return config;
});

footballApiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (error instanceof ApiLimitError) return Promise.reject(error);
    const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
    const message = axiosError.response?.data?.message || axiosError.message || 'API error';
    return Promise.reject(new Error(message));
  }
);

export { footballApiClient };
