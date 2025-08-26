import type { MentorshipState } from "@/shared/entities/mentorshipState";
import { httpClient } from "../adapters/httpClient/httpClient";
import type { TutoringRequest } from "../models/TutoringRequest";

export interface GetTutoringRequestsParams {
  tuteeId?: string;
  skillId?: string;
  status?: MentorshipState;
}

export interface GetTutoringRequestsResponse {
  message: string;
  data: TutoringRequest[];
  timestamp: string;
}

export async function getTutoringRequests(params: GetTutoringRequestsParams) {
  console.log("💩 ~ getTutoringRequests ~ params:", params);
  const { data } = await httpClient.get<GetTutoringRequestsResponse>("/api/v1/tutoring-requests");
  return data;
}
