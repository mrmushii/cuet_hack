import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HealthStatus } from "./components/HealthStatus";
import { DownloadJobs } from "./components/DownloadJobs";
import { ErrorLog } from "./components/ErrorLog";
import { TraceViewer } from "./components/TraceViewer";
import { MetricsChart } from "./components/MetricsChart";
import { Activity } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-slate-100">
                  Observability Dashboard
                </h1>
                <p className="text-sm text-slate-400">
                  CUET Hackathon - Download Microservice Monitoring
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="grid gap-6">
            {/* Row 1: Health Status & Download Jobs */}
            <div className="grid lg:grid-cols-2 gap-6">
              <HealthStatus />
              <DownloadJobs />
            </div>

            {/* Row 2: Error Log & Metrics */}
            <div className="grid lg:grid-cols-2 gap-6">
              <ErrorLog />
              <MetricsChart />
            </div>

            {/* Row 3: Trace Viewer (Full Width) */}
            <div>
              <TraceViewer />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700 mt-12">
          <div className="container mx-auto px-6 py-6">
            <div className="text-center text-sm text-slate-500">
              <p>Built with React + Vite + TypeScript</p>
              <p className="mt-1">
                Challenge 4: Observability Dashboard (Bonus)
              </p>
            </div>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
