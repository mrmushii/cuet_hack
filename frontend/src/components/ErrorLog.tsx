import { useState } from "react";
import { Card } from "./common/Card";
import { AlertCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { testSentryError } from "../services/sentry";

// Mock error logs
const mockErrors = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    message: "Failed to fetch download status",
    level: "error" as const,
    stack:
      "Error: Network request failed\n  at fetchDownload (download.ts:45)\n  at async download.ts:123",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    message: "S3 bucket connection timeout",
    level: "warning" as const,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    message: "Download completed successfully",
    level: "info" as const,
  },
];

export function ErrorLog() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const levelConfig = {
    error: {
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
    },
    info: {
      icon: Info,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
    },
  };

  return (
    <Card
      title="Error Log"
      action={
        <button
          onClick={() => testSentryError()}
          className="px-3 py-1.5 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
        >
          Test Sentry
        </button>
      }
    >
      <div className="space-y-2">
        {mockErrors.map((error) => {
          const config = levelConfig[error.level];
          const Icon = config.icon;
          const isExpanded = expandedId === error.id;

          return (
            <div
              key={error.id}
              className={`p-3 rounded-lg border ${config.bg} ${config.border} cursor-pointer hover:bg-opacity-80 transition-colors`}
              onClick={() => setExpandedId(isExpanded ? null : error.id)}
            >
              <div className="flex items-start space-x-3">
                <Icon
                  className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`}
                />
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${config.color}`}>
                    {error.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(error.timestamp).toLocaleString()}
                  </p>

                  {/* Stack trace (expandable) */}
                  {error.stack && isExpanded && (
                    <pre className="mt-3 p-3 bg-slate-900 rounded text-xs text-slate-300 overflow-x-auto">
                      {error.stack}
                    </pre>
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${config.color} ${config.bg} border ${config.border} uppercase`}
                >
                  {error.level}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sentry Info */}
      <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-purple-300">
            <p className="font-medium mb-1">Sentry Integration</p>
            <p className="text-purple-400/80">
              Click "Test Sentry" to trigger a test error. Configure
              VITE_SENTRY_DSN in .env to enable error tracking.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
