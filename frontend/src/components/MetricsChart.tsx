import { Card } from "./common/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

// Mock metrics data
const mockMetrics = [
  { time: "12:00", requests: 45, errors: 2, avgResponseTime: 120 },
  { time: "12:05", requests: 52, errors: 1, avgResponseTime: 110 },
  { time: "12:10", requests: 61, errors: 3, avgResponseTime: 145 },
  { time: "12:15", requests: 48, errors: 0, avgResponseTime: 95 },
  { time: "12:20", requests: 55, errors: 1, avgResponseTime: 105 },
  { time: "12:25", requests: 70, errors: 2, avgResponseTime: 130 },
  { time: "12:30", requests: 58, errors: 1, avgResponseTime: 115 },
];

export function MetricsChart() {
  const totalRequests = mockMetrics.reduce((sum, m) => sum + m.requests, 0);
  const totalErrors = mockMetrics.reduce((sum, m) => sum + m.errors, 0);
  const avgResponseTime = Math.round(
    mockMetrics.reduce((sum, m) => sum + m.avgResponseTime, 0) /
      mockMetrics.length,
  );
  const successRate = ((1 - totalErrors / totalRequests) * 100).toFixed(1);

  return (
    <Card title="Performance Metrics">
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-slate-400">Total Requests</p>
          </div>
          <p className="text-2xl font-bold text-slate-100">{totalRequests}</p>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-green-400">{successRate}%</p>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Errors</p>
          <p className="text-2xl font-bold text-red-400">{totalErrors}</p>
        </div>

        <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Avg Response</p>
          <p className="text-2xl font-bold text-yellow-400">
            {avgResponseTime}ms
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Request & Error Chart */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">
            Request Volume & Errors
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Requests"
              />
              <Line
                type="monotone"
                dataKey="errors"
                stroke="#ef4444"
                strokeWidth={2}
                name="Errors"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Chart */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3">
            Average Response Time (ms)
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="time"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#64748b" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="avgResponseTime"
                stroke="#eab308"
                strokeWidth={2}
                name="Avg Response Time"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Note */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-400">
          💡 Showing mock metrics data. Integrate with Prometheus or custom
          metrics endpoint for real-time data.
        </p>
      </div>
    </Card>
  );
}
