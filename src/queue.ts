import { Queue } from "bullmq";
import { Redis } from "ioredis";

// Type definitions
export interface DownloadJobData {
  jobId: string;
  fileIds: number[];
  userId?: string;
  webhookUrl?: string;
}

export interface JobProgress {
  current: number;
  total: number;
  percentage: number;
}

export interface JobStatus {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: JobProgress;
  files: {
    fileId: number;
    status: "queued" | "processing" | "completed" | "failed";
    sizeBytes: number | null;
  }[];
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  downloadUrl: string | null;
  error: string | null;
}

// Redis connection helper
export const createRedisConnection = () => {
  const host = process.env.REDIS_HOST ?? "localhost";
  const port = Number.parseInt(process.env.REDIS_PORT ?? "6379", 10);
  const password = process.env.REDIS_PASSWORD;
  const db = Number.parseInt(process.env.REDIS_DB ?? "0", 10);

  return new Redis({
    host,
    port,
    password: password ?? undefined,
    db,
    maxRetriesPerRequest: null,
  });
};

// Queue helper
export const createDownloadQueue = () => {
  const connection = createRedisConnection();
  return new Queue<DownloadJobData>("downloads", {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        age: 86400, // 24 hours
        count: 1000,
      },
      removeOnFail: {
        age: 604800, // 7 days
      },
    },
  });
};

// Job status helpers
export const updateJobStatus = async (
  redis: Redis,
  jobId: string,
  updates: Partial<JobStatus>,
): Promise<void> => {
  const key = `job:${jobId}`;
  const currentData = await redis.hgetall(key);

  const updatedData = {
    ...currentData,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Convert objects to JSON strings for Redis hash
  const hashData: Record<string, string> = {};
  for (const [k, v] of Object.entries(updatedData)) {
    if (v == null || v === "") continue;
    hashData[k] = typeof v === "object" ? JSON.stringify(v) : v;
  }

  if (Object.keys(hashData).length > 0) {
    await redis.hmset(key, hashData);
  }
  await redis.expire(key, 604800); // 7 days TTL
};

export const getJobStatus = async (
  redis: Redis,
  jobId: string,
): Promise<JobStatus | null> => {
  const key = `job:${jobId}`;
  const data = await redis.hgetall(key);

  if (Object.keys(data).length === 0) {
    return null;
  }

  // Parse JSON fields with defaults
  const progress = data.progress
    ? (JSON.parse(data.progress) as JobProgress)
    : { current: 0, total: 0, percentage: 0 };
  const files = data.files
    ? (JSON.parse(data.files) as JobStatus["files"])
    : [];

  const statusValue = data.status as JobStatus["status"] | undefined;

  return {
    jobId: data.jobId || jobId,
    status: statusValue ?? "queued",
    progress,
    files,
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    completedAt: data.completedAt || null,
    downloadUrl: data.downloadUrl || null,
    error: data.error || null,
  };
};

// WebSocket connection tracking
export const addWebSocketConnection = async (
  redis: Redis,
  jobId: string,
  connectionId: string,
): Promise<void> => {
  const key = `ws:job:${jobId}`;
  await redis.sadd(key, connectionId);
  await redis.expire(key, 3600); // 1 hour TTL
};

export const removeWebSocketConnection = async (
  redis: Redis,
  jobId: string,
  connectionId: string,
): Promise<void> => {
  const key = `ws:job:${jobId}`;
  await redis.srem(key, connectionId);
};

export const getWebSocketConnections = async (
  redis: Redis,
  jobId: string,
): Promise<string[]> => {
  const key = `ws:job:${jobId}`;
  return redis.smembers(key);
};
