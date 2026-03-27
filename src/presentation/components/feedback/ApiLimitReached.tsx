import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApiLimitReachedProps {
  usedRequests: number;
  maxRequests: number;
  resetDate?: string;
}

export function ApiLimitReached({ usedRequests, maxRequests, resetDate }: ApiLimitReachedProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-mufc-red/30 bg-card">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <ShieldAlert className="w-16 h-16 text-mufc-red" />
          </div>
          <CardTitle className="text-xl text-foreground">API Limit Reached</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-3">
          <p className="text-muted-foreground">
            You have used{' '}
            <span className="text-mufc-red font-bold">
              {usedRequests}/{maxRequests}
            </span>{' '}
            API requests for today.
          </p>
          <p className="text-sm text-muted-foreground">
            The free tier of API Football allows {maxRequests} requests per day.
            {resetDate && ` Your limit resets on ${resetDate}.`}
          </p>
          <div className="pt-2 text-xs text-muted-foreground border-t border-white/5">
            The app is now using cached data only. Live updates are unavailable until the limit
            resets.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
