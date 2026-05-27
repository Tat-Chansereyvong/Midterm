import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(() => {
    service = new CommentsService();
  });

  it('creates and updates a comment for the owner', () => {
    const comment = service.create('1', {
      postId: 'post-1',
      content: 'first comment',
    });
    const updated = service.update(comment.id, '1', {
      content: 'updated comment',
    });

    expect(updated.content).toBe('updated comment');
  });

  it('prevents non-owner update and delete', () => {
    const comment = service.create('1', {
      postId: 'post-1',
      content: 'owner comment',
    });

    expect(() =>
      service.update(comment.id, '2', { content: 'hijack' }),
    ).toThrow(ForbiddenException);
    expect(() => service.remove(comment.id, '2')).toThrow(ForbiddenException);
  });

  it('throws not found for missing comment', () => {
    expect(() => service.findById('999')).toThrow(NotFoundException);
  });
});
