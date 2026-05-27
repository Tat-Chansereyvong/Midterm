export interface CommentEntity {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}
