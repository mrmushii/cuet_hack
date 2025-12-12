import type {
  HealthResponse,
  FileCheckRequest,
  FileCheckResponse,
  DownloadInitiateRequest,
  DownloadInitiateResponse,
  DownloadJob,
} from "../types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health Check
  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  // File Operations
  async checkFile(data: FileCheckRequest): Promise<FileCheckResponse> {
    return this.request<FileCheckResponse>("/v1/download/check", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async initiateDownload(
    data: DownloadInitiateRequest,
  ): Promise<DownloadInitiateResponse> {
    return this.request<DownloadInitiateResponse>("/v1/download/initiate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Job Status (if implemented in backend)
  async getJobStatus(jobId: string): Promise<DownloadJob> {
    return this.request<DownloadJob>(`/v1/jobs/${jobId}/status`);
  }

  async getAllJobs(): Promise<DownloadJob[]> {
    return this.request<DownloadJob[]>("/v1/jobs");
  }
}

export const apiClient = new APIClient();
export default apiClient;
