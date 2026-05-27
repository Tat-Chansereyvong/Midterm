import { Injectable } from '@nestjs/common';
import { CommentsService } from '../comments/comments.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class FeedService {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
  ) {}

  getFeed(limit = 20) {
    const comments = this.commentsService.findAll({ limit });
    return comments.map((comment) => ({
      ...comment,
      author: this.usersService.getPublicUserById(comment.authorId),
    }));
  }
}
