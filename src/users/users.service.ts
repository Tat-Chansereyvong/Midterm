import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity, PublicUser } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];
  private nextId = 1;

  async create(username: string, email: string, password: string): Promise<PublicUser> {
    const normalizedEmail = email.toLowerCase().trim();

    if (this.users.some((user) => user.email === normalizedEmail)) {
      throw new ConflictException('Email is already in use');
    }
    if (this.users.some((user) => user.username === username)) {
      throw new ConflictException('Username is already in use');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();

    const user: UserEntity = {
      id: String(this.nextId++),
      username,
      email: normalizedEmail,
      passwordHash,
      bio: '',
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);
    return this.toPublicUser(user);
  }

  async validateUser(email: string, password: string): Promise<PublicUser> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = this.users.find((entry) => entry.email === normalizedEmail);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.toPublicUser(user);
  }

  getPublicUserById(id: string): PublicUser {
    const user = this.users.find((entry) => entry.id === id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return this.toPublicUser(user);
  }

  updateProfile(id: string, bio?: string): PublicUser {
    const user = this.users.find((entry) => entry.id === id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (bio !== undefined) {
      user.bio = bio;
    }
    user.updatedAt = new Date().toISOString();

    return this.toPublicUser(user);
  }

  private toPublicUser(user: UserEntity): PublicUser {
    const { passwordHash: _passwordHash, ...publicUser } = user;
    return publicUser;
  }
}
