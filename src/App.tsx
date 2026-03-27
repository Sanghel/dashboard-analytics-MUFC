import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/presentation/components/layout/AppLayout';
import { ApiLimitReached } from '@/presentation/components/feedback/ApiLimitReached';
import { useApiLimitStore } from '@/presentation/store/apiLimitStore';

function App() {
  const { limitReached, usedRequests, maxRequests } = useApiLimitStore();

  return (
    <>
      {limitReached && <ApiLimitReached usedRequests={usedRequests} maxRequests={maxRequests} />}
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={
              <div className="text-foreground p-4">
                <h2 className="text-2xl font-bold">Overview Dashboard</h2>
              </div>
            }
          />
          <Route path="/standings" element={<div className="text-foreground p-4">Standings</div>} />
          <Route
            path="/players"
            element={<div className="text-foreground p-4">Player Stats</div>}
          />
          <Route
            path="/live-match"
            element={<div className="text-foreground p-4">Live Match</div>}
          />
          <Route
            path="/tactical-analysis"
            element={<div className="text-foreground p-4">Tactical Analysis</div>}
          />
          <Route path="/injuries" element={<div className="text-foreground p-4">Injuries</div>} />
          <Route path="/calendar" element={<div className="text-foreground p-4">Calendar</div>} />
          <Route path="/records" element={<div className="text-foreground p-4">Records</div>} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center h-full text-foreground">
                <h2 className="text-4xl font-bold">404</h2>
              </div>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
