import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { FeedModule } from './feed/feed.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, CommentsModule, FeedModule],
})
export class AppModule {}
