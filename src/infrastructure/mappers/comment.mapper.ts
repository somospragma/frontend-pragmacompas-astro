import type { BackendCommentsResponse } from "@/infrastructure/models/backend-comment-response";
import type { Comment } from "@/shared/entities/comment";

export const CommentMapper = {
  backendResponseToEntity: (backendComment: BackendCommentsResponse): Comment => {
    return {
      commentId: backendComment.id,
      content: backendComment.text,
      user: backendComment.author,
      username: backendComment.alterName,
      isArchived: backendComment.isDeprecated,
      timestamp: backendComment.createdAt,
    };
  },
};
