import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../services/api";
import type { HealthResponse } from "../types/api";

export function useHealth() {
  return useQuery<HealthResponse>({
    queryKey: ["health"],
    queryFn: () => apiClient.getHealth(),
    refetchInterval: 10000, // Refresh every 10 seconds
    retry: 3,
  });
}
