import { httpClient } from "../adapters/httpClient/httpClient";
import type { DashboardStatistics, DashboardStatisticsResponse } from "../models/DashboardStatistics";

export interface GetDashboardStatisticsParams {
  chapterId: string;
}

export async function getDashboardStatistics(
  params: GetDashboardStatisticsParams
): Promise<DashboardStatisticsResponse> {
  try {
    const { data } = await httpClient.get<DashboardStatistics>(
      `/api/v1/statistics/dashboard?chapterId=${params.chapterId}`
    );
    return { data };
  } catch (error: unknown) {
    // Handle authorization errors and other API errors
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string; timestamp?: string } } };
      if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
        return {
          message: axiosError.response?.data?.message || "Authorization header is required",
          timestamp: axiosError.response?.data?.timestamp || new Date().toISOString(),
        };
      }
    }

    // Handle other errors
    throw error;
  }
}
