// API Types
export interface HealthResponse {
  status: "healthy" | "unhealthy";
  checks: {
    storage: "ok" | "error";
  };
  timestamp?: string;
}

export interface DownloadJob {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  fileIds: number[];
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  error?: string;
}

export interface FileCheckRequest {
  file_id: number;
}

export interface FileCheckResponse {
  file_id: number;
  available: boolean;
  size_bytes?: number;
  processing_time_ms?: number;
}

export interface DownloadInitiateRequest {
  file_ids: number[];
}

export interface DownloadInitiateResponse {
  jobId: string;
  status: string;
  message: string;
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  level: "error" | "warning" | "info";
}
