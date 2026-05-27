import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Social Media API (e2e)', () => {
  let app: INestApplication;
  let userOneToken: string;
  let userTwoToken: string;
  let createdCommentId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('registers first user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'first_user',
        email: 'first@example.com',
        password: 'Password123',
      })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
    userOneToken = response.body.accessToken;
  });

  it('rejects duplicate registration', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'first_user_duplicate',
        email: 'first@example.com',
        password: 'Password123',
      })
      .expect(409);
  });

  it('registers second user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'second_user',
        email: 'second@example.com',
        password: 'Password123',
      })
      .expect(201);

    userTwoToken = response.body.accessToken;
  });

  it('logs in a registered user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'first@example.com',
        password: 'Password123',
      })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
  });

  it('rejects login with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'first@example.com',
        password: 'WrongPass999',
      })
      .expect(401);
  });

  it('returns unauthorized for protected profile endpoint without token', async () => {
    await request(app.getHttpServer()).get('/users/me').expect(401);
  });

  it('returns current profile with token', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${userOneToken}`)
      .expect(200);

    expect(response.body.email).toBe('first@example.com');
  });

  it('updates profile bio', async () => {
    const response = await request(app.getHttpServer())
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({ bio: 'I build APIs' })
      .expect(200);

    expect(response.body.bio).toBe('I build APIs');
  });

  it('rejects creating comment without auth', async () => {
    await request(app.getHttpServer())
      .post('/comments')
      .send({ postId: 'post-1', content: 'No token request' })
      .expect(401);
  });

  it('rejects invalid comment payload', async () => {
    await request(app.getHttpServer())
      .post('/comments')
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({ postId: 'post-1', content: 'a' })
      .expect(400);
  });

  it('creates a comment', async () => {
    const response = await request(app.getHttpServer())
      .post('/comments')
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({ postId: 'post-1', content: 'This is my first comment' })
      .expect(201);

    expect(response.body.id).toBeDefined();
    expect(response.body.likes).toEqual([]);
    createdCommentId = response.body.id;
  });

  it('lists comments with filter', async () => {
    const response = await request(app.getHttpServer())
      .get('/comments')
      .query({ postId: 'post-1', limit: 5 })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('gets comment by id', async () => {
    const response = await request(app.getHttpServer())
      .get(`/comments/${createdCommentId}`)
      .expect(200);

    expect(response.body.id).toBe(createdCommentId);
  });

  it('updates comment by owner', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/comments/${createdCommentId}`)
      .set('Authorization', `Bearer ${userOneToken}`)
      .send({ content: 'Edited comment content' })
      .expect(200);

    expect(response.body.content).toBe('Edited comment content');
  });

  it('rejects comment update by non-owner', async () => {
    await request(app.getHttpServer())
      .patch(`/comments/${createdCommentId}`)
      .set('Authorization', `Bearer ${userTwoToken}`)
      .send({ content: 'Unauthorized edit' })
      .expect(403);
  });

  it('likes comment', async () => {
    const response = await request(app.getHttpServer())
      .post(`/comments/${createdCommentId}/like`)
      .set('Authorization', `Bearer ${userTwoToken}`)
      .expect(201);

    expect(response.body.likes).toHaveLength(1);
  });

  it('unlikes comment', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/comments/${createdCommentId}/like`)
      .set('Authorization', `Bearer ${userTwoToken}`)
      .expect(200);

    expect(response.body.likes).toEqual([]);
  });

  it('returns feed with author details', async () => {
    const response = await request(app.getHttpServer())
      .get('/feed')
      .query({ limit: 10 })
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].author).toBeDefined();
  });

  it('rejects deleting comment by non-owner', async () => {
    await request(app.getHttpServer())
      .delete(`/comments/${createdCommentId}`)
      .set('Authorization', `Bearer ${userTwoToken}`)
      .expect(403);
  });

  it('deletes comment by owner', async () => {
    await request(app.getHttpServer())
      .delete(`/comments/${createdCommentId}`)
      .set('Authorization', `Bearer ${userOneToken}`)
      .expect(200);
  });

  it('returns not found for deleted comment', async () => {
    await request(app.getHttpServer()).get(`/comments/${createdCommentId}`).expect(404);
  });
});
