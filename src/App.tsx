import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/presentation/components/layout/AppLayout';

function OverviewPage() {
  return (
    <div className="text-foreground">
      <h2 className="text-2xl font-bold mb-4">Overview Dashboard</h2>
      <p className="text-muted-foreground">Season overview content coming soon...</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-foreground">
      <h2 className="text-4xl font-bold mb-2">404</h2>
      <p className="text-muted-foreground">Page not found</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/standings" element={<div className="text-foreground">Standings</div>} />
        <Route path="/players" element={<div className="text-foreground">Player Stats</div>} />
        <Route path="/live-match" element={<div className="text-foreground">Live Match</div>} />
        <Route
          path="/tactical-analysis"
          element={<div className="text-foreground">Tactical Analysis</div>}
        />
        <Route path="/injuries" element={<div className="text-foreground">Injuries</div>} />
        <Route path="/calendar" element={<div className="text-foreground">Calendar</div>} />
        <Route path="/records" element={<div className="text-foreground">Records</div>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
