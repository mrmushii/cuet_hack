import { clsx } from "clsx";

interface StatusBadgeProps {
  status:
    | "healthy"
    | "unhealthy"
    | "queued"
    | "processing"
    | "completed"
    | "failed"
    | "ok"
    | "error";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    healthy: {
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      label: "Healthy",
    },
    unhealthy: {
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      label: "Unhealthy",
    },
    ok: {
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      label: "OK",
    },
    error: {
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      label: "Error",
    },
    queued: {
      color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      label: "Queued",
    },
    processing: {
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      label: "Processing",
    },
    completed: {
      color: "bg-green-500/20 text-green-400 border-green-500/30",
      label: "Completed",
    },
    failed: {
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      label: "Failed",
    },
  };

  const config = statusConfig[status] || statusConfig.error;

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.color,
        className,
      )}
    >
      <span className="w-2 h-2 rounded-full bg-current mr-1.5 animate-pulse" />
      {config.label}
    </span>
  );
}
