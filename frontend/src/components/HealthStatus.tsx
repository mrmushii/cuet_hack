import { useHealth } from "../hooks/useHealth";
import { Card } from "./common/Card";
import { StatusBadge } from "./common/StatusBadge";
import { Activity, Database, RefreshCw } from "lucide-react";

export function HealthStatus() {
  const { data: health, isLoading, error, refetch } = useHealth();

  if (isLoading) {
    return (
      <Card title="System Health">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-400">Loading health status...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="System Health">
        <div className="flex items-center space-x-3 text-red-400">
          <Activity className="w-5 h-5" />
          <span>Failed to fetch health status</span>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="System Health"
      action={
        <button
          onClick={() => refetch()}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </button>
      }
    >
      <div className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity
              className={`w-5 h-5 ${health?.status === "healthy" ? "text-green-400" : "text-red-400"}`}
            />
            <span className="text-slate-200">API Status</span>
          </div>
          <StatusBadge status={health?.status || "unhealthy"} />
        </div>

        {/* Storage Check */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database
              className={`w-5 h-5 ${health?.checks?.storage === "ok" ? "text-green-400" : "text-red-400"}`}
            />
            <span className="text-slate-200">S3 Storage</span>
          </div>
          <StatusBadge status={health?.checks?.storage || "error"} />
        </div>

        {/* Auto-refresh indicator */}
        <div className="pt-2 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            Auto-refresh every 10 seconds
          </p>
        </div>
      </div>
    </Card>
  );
}
