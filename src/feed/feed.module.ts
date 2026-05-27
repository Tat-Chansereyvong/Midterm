import { Module } from '@nestjs/common';
import { CommentsModule } from '../comments/comments.module';
import { UsersModule } from '../users/users.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [CommentsModule, UsersModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
