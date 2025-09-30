/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpClient } from "../adapters/httpClient/httpClient";
import type { Tutoring } from "../models/Tutoring";

export interface CompleteTutoringBody {
  userId: string;
  finalActUrl: string;
}

export interface CompleteTutoringResponse {
  message: string;
  data: Tutoring; // TODO: mapear bien la respuesta
  timestamp: string;
}

export async function completeTutoring(tutoringId: string, body: CompleteTutoringBody) {
  try {
    const { data } = await httpClient.patch<CompleteTutoringResponse>(`/api/v1/tutorings/${tutoringId}/complete`, body);
    return data;
  } catch (error: any) {
    throw error;
  }
}
