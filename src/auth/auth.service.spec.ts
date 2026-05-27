import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('registers and logs in a user', async () => {
    const registerResult = await service.register({
      username: 'alice',
      email: 'alice@example.com',
      password: 'Password123',
    });

    expect(registerResult.accessToken).toBeDefined();
    expect(registerResult.user.email).toBe('alice@example.com');

    const loginResult = await service.login({
      email: 'alice@example.com',
      password: 'Password123',
    });

    expect(loginResult.accessToken).toBeDefined();
    expect(loginResult.user.username).toBe('alice');
  });

  it('rejects login with wrong password', async () => {
    await service.register({
      username: 'bob',
      email: 'bob@example.com',
      password: 'Password123',
    });

    await expect(
      service.login({
        email: 'bob@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
