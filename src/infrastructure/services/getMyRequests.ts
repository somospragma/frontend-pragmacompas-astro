import { mockGetMyRequestsResponse } from "@/tests/__mocks__/getMyRequestsMock";
import { httpClient } from "../adapters/httpClient/httpClient";
import type { MyRequestsResponse } from "../models/TutoringRequest";

export interface GetMyRequests {
  message: string;
  data: MyRequestsResponse;
  timestamp: string;
}

export async function getMyRequests(): Promise<GetMyRequests> {
  const { data } = await httpClient.get<GetMyRequests>("/api/v1/tutoring-requests/my-requests");
  return data;
  return Promise.resolve(mockGetMyRequestsResponse);
}
