import { Worker, type Job } from "bullmq";
import type { DownloadJobData, JobProgress } from "./queue.ts";
import { createRedisConnection, updateJobStatus } from "./queue.ts";

// Simulation helpers
const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

const getRandomDelay = (): number => {
    const minMs = Number.parseInt(
        process.env.DOWNLOAD_DELAY_MIN_MS ?? "10000",
        10,
    );
    const maxMs = Number.parseInt(
        process.env.DOWNLOAD_DELAY_MAX_MS ?? "120000",
        10,
    );
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
};

// Worker processor
const processDownloadJob = async (job: Job<DownloadJobData>) => {
    const { jobId, fileIds } = job.data;
    const redis = createRedisConnection();

    console.log(`[Worker] Processing job ${jobId} with ${fileIds.length} files`);

    try {
        // Update to processing
        await updateJobStatus(redis, jobId, {
            jobId,
            status: "processing",
            progress: { current: 0, total: fileIds.length, percentage: 0 },
            files: fileIds.map((fileId) => ({
                fileId,
                status: "queued" as const,
                sizeBytes: null,
            })),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: null,
            downloadUrl: null,
            error: null,
        });

        // Process each file
        const processedFiles: Array<{
            fileId: number;
            status: "completed" | "failed";
            sizeBytes: number | null;
        }> = [];

        for (let i = 0; i < fileIds.length; i++) {
            const fileId = fileIds[i];
            const delayMs = getRandomDelay();

            console.log(
                `[Worker] Processing file ${fileId} (${i + 1}/${fileIds.length}) - delay: ${(delayMs / 1000).toFixed(1)}s`,
            );

            // Simulate processing
            await sleep(delayMs);

            // Mock file result
            const fileResult = {
                fileId,
                status: "completed" as const,
                sizeBytes: Math.floor(Math.random() * 10000000) + 1000,
            };

            processedFiles.push(fileResult);

            // Update progress
            const progress: JobProgress = {
                current: i + 1,
                total: fileIds.length,
                percentage: Math.round(((i + 1) / fileIds.length) * 100),
            };

            await updateJobStatus(redis, jobId, {
                jobId,
                status: "processing",
                progress,
                files: [
                    ...processedFiles,
                    ...fileIds.slice(i + 1).map((fid) => ({
                        fileId: fid,
                        status: "queued" as const,
                        sizeBytes: null,
                    })),
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                completedAt: null,
                downloadUrl: null,
                error: null,
            });

            await job.updateProgress(progress.percentage);

            console.log(
                `[Worker] File ${fileId} completed - Progress: ${progress.percentage}%`,
            );
        }

        // Generate download URL
        const downloadUrl = `https://storage.example.com/jobs/${jobId}/download?token=${crypto.randomUUID()}`;

        // Mark as completed
        await updateJobStatus(redis, jobId, {
            jobId,
            status: "completed",
            progress: { current: fileIds.length, total: fileIds.length, percentage: 100 },
            files: processedFiles,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            downloadUrl,
            error: null,
        });

        console.log(`[Worker] Job ${jobId} completed successfully`);

        await redis.quit();
        return { success: true, downloadUrl };
    } catch (error) {
        console.error(`[Worker] Job ${jobId} failed:`, error);

        await updateJobStatus(redis, jobId, {
            jobId,
            status: "failed",
            progress: { current: 0, total: fileIds.length, percentage: 0 },
            files: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            downloadUrl: null,
            error: error instanceof Error ? error.message : "Unknown error",
        });

        await redis.quit();
        throw error;
    }
};

// Create and start worker
const startWorker = () => {
    const connection = createRedisConnection();

    const worker = new Worker<DownloadJobData>("downloads", processDownloadJob, {
        connection,
        concurrency: 3, // Process 3 jobs in parallel
        limiter: {
            max: 50,
            duration: 1000,
        },
    });

    worker.on("completed", (job) => {
        console.log(`[Worker] Job ${job.id} completed`);
    });

    worker.on("failed", (job, err) => {
        console.error(`[Worker] Job ${job?.id} failed:`, err.message);
    });

    worker.on("progress", (job, progress) => {
        console.log(`[Worker] Job ${job.id} progress: ${progress}%`);
    });

    worker.on("error", (err) => {
        console.error("[Worker] Error:", err);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
        console.log(`\n${signal} received. Shutting down worker...`);
        await worker.close();
        await connection.quit();
        console.log("Worker shut down successfully");
        process.exit(0);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    console.log("🚀 Download worker started and listening for jobs...");
    console.log(`   Environment: ${process.env.NODE_ENV ?? "development"}`);
    console.log(`   Redis: ${process.env.REDIS_HOST ?? "localhost"}:${process.env.REDIS_PORT ?? "6379"}`);
    console.log(`   Concurrency: 3`);
};

// Start the worker
startWorker();
