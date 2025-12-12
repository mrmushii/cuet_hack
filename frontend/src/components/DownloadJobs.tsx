import { useState } from "react";
import { Card } from "./common/Card";
import { StatusBadge } from "./common/StatusBadge";
import { Download, Clock, FileText } from "lucide-react";

// Mock data - replace with real API when backend implements job tracking
const mockJobs = [
  {
    jobId: "job_abc123",
    status: "completed" as const,
    fileIds: [70000, 70001],
    progress: { current: 2, total: 2, percentage: 100 },
    createdAt: new Date(Date.now() - 60000).toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    jobId: "job_def456",
    status: "processing" as const,
    fileIds: [70002, 70003, 70004],
    progress: { current: 2, total: 3, percentage: 67 },
    createdAt: new Date(Date.now() - 30000).toISOString(),
  },
  {
    jobId: "job_ghi789",
    status: "queued" as const,
    fileIds: [70005],
    createdAt: new Date(Date.now() - 10000).toISOString(),
  },
];

export function DownloadJobs() {
  const [filter, setFilter] = useState<
    "all" | "queued" | "processing" | "completed" | "failed"
  >("all");

  const filteredJobs =
    filter === "all"
      ? mockJobs
      : mockJobs.filter((job) => job.status === filter);

  return (
    <Card title="Download Jobs">
      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 border-b border-slate-700 pb-3">
        {(["all", "queued", "processing", "completed", "failed"] as const).map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === status
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:bg-slate-700/50"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ),
        )}
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No {filter !== "all" ? filter : ""} jobs found
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.jobId}
              className="p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="font-mono text-sm text-slate-300">
                      {job.jobId}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.fileIds.length} file
                      {job.fileIds.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <StatusBadge status={job.status} />
              </div>

              {/* Progress Bar */}
              {job.progress && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>
                      {job.progress.current} / {job.progress.total} files
                    </span>
                    <span>{job.progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="mt-3 pt-3 border-t border-slate-700 grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Created {new Date(job.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                {job.completedAt && (
                  <div className="flex items-center space-x-2 text-green-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>
                      Done {new Date(job.completedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Note */}
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-xs text-blue-400">
          💡 Note: Job tracking is currently showing mock data. Implement
          backend `/v1/jobs` endpoints for real-time tracking.
        </p>
      </div>
    </Card>
  );
}
