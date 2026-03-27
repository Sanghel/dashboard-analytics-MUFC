import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
      <p className="text-8xl font-bold text-mufc-red">404</p>
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild variant="outline">
        <Link to="/" className="gap-2">
          <Home className="w-4 h-4" />
          Back to Overview
        </Link>
      </Button>
    </div>
  );
}
