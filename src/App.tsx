import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/presentation/components/layout/AppLayout';
import { ApiLimitReached } from '@/presentation/components/feedback/ApiLimitReached';
import { useApiLimitStore } from '@/presentation/store/apiLimitStore';
import {
  OverviewPage,
  StandingsPage,
  PlayerStatsPage,
  LiveMatchPage,
  TacticalAnalysisPage,
  NotFoundPage,
} from '@/presentation/pages';

function App() {
  const { limitReached, usedRequests, maxRequests } = useApiLimitStore();

  return (
    <>
      {limitReached && <ApiLimitReached usedRequests={usedRequests} maxRequests={maxRequests} />}
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/standings" element={<StandingsPage />} />
          <Route path="/players" element={<PlayerStatsPage />} />
          <Route path="/live-match" element={<LiveMatchPage />} />
          <Route path="/tactical-analysis" element={<TacticalAnalysisPage />} />
          <Route
            path="/injuries"
            element={<div className="text-foreground p-4">Injuries — Coming Soon</div>}
          />
          <Route
            path="/calendar"
            element={<div className="text-foreground p-4">Calendar — Coming Soon</div>}
          />
          <Route
            path="/records"
            element={<div className="text-foreground p-4">Records — Coming Soon</div>}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
