import { API_URL } from "astro:env/client";
import { CommentMapper } from "@/infrastructure/mappers/comment.mapper";
import type { BackendCommentsResponse } from "@/infrastructure/models/backend-comment-response";
import type { Comment } from "@/shared/entities/comment";

export const getComments = async (): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/comments`);

    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }

    const backendComments: BackendCommentsResponse[] = await response.json();

    const comments: Comment[] = backendComments.map(CommentMapper.backendResponseToEntity);

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
};
