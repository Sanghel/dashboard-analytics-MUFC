interface EnvConfig {
  apiFootballKey: string;
  apiFootballBaseUrl: string;
  useMockData: boolean;
  teamId: number;
  apiRateLimit: number;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] as string | undefined;
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? defaultValue ?? '';
};

export const env: EnvConfig = {
  apiFootballKey: getEnvVar('VITE_API_FOOTBALL_KEY', ''),
  apiFootballBaseUrl: getEnvVar('VITE_API_FOOTBALL_BASE_URL', 'https://v3.football.api-sports.io'),
  useMockData: getEnvVar('VITE_USE_MOCK_DATA', 'true') === 'true',
  teamId: parseInt(getEnvVar('VITE_TEAM_ID', '33'), 10),
  apiRateLimit: parseInt(getEnvVar('VITE_API_RATE_LIMIT', '100'), 10),
};
