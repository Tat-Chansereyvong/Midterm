import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ListCommentsQueryDto } from './dto/list-comments-query.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  private comments: CommentEntity[] = [];
  private nextId = 1;

  create(authorId: string, dto: CreateCommentDto): CommentEntity {
    const now = new Date().toISOString();
    const comment: CommentEntity = {
      id: String(this.nextId++),
      postId: dto.postId,
      content: dto.content,
      authorId,
      likes: [],
      createdAt: now,
      updatedAt: now,
    };
    this.comments.push(comment);
    return comment;
  }

  findAll(query: ListCommentsQueryDto): CommentEntity[] {
    const filtered = this.comments.filter((comment) => {
      if (query.postId && comment.postId !== query.postId) {
        return false;
      }
      if (query.authorId && comment.authorId !== query.authorId) {
        return false;
      }
      return true;
    });

    const sorted = filtered.sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    return query.limit ? sorted.slice(0, query.limit) : sorted;
  }

  findById(id: string): CommentEntity {
    const comment = this.comments.find((entry) => entry.id === id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  update(id: string, authorId: string, dto: UpdateCommentDto): CommentEntity {
    const comment = this.findById(id);
    if (comment.authorId !== authorId) {
      throw new ForbiddenException('You can only update your own comment');
    }

    comment.content = dto.content;
    comment.updatedAt = new Date().toISOString();
    return comment;
  }

  remove(id: string, authorId: string): { message: string } {
    const commentIndex = this.comments.findIndex((entry) => entry.id === id);
    if (commentIndex === -1) {
      throw new NotFoundException('Comment not found');
    }

    if (this.comments[commentIndex].authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own comment');
    }

    this.comments.splice(commentIndex, 1);
    return { message: 'Comment deleted' };
  }

  like(id: string, userId: string): CommentEntity {
    const comment = this.findById(id);
    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
      comment.updatedAt = new Date().toISOString();
    }
    return comment;
  }

  unlike(id: string, userId: string): CommentEntity {
    const comment = this.findById(id);
    const originalLength = comment.likes.length;
    comment.likes = comment.likes.filter((idToKeep) => idToKeep !== userId);
    if (comment.likes.length !== originalLength) {
      comment.updatedAt = new Date().toISOString();
    }
    return comment;
  }
}
