import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { PublicUser } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
  ): Promise<{ accessToken: string; user: PublicUser }> {
    const user = await this.usersService.create(
      dto.username,
      dto.email,
      dto.password,
    );
    return this.issueToken(user);
  }

  async login(
    dto: LoginDto,
  ): Promise<{ accessToken: string; user: PublicUser }> {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    return this.issueToken(user);
  }

  private issueToken(user: PublicUser): {
    accessToken: string;
    user: PublicUser;
  } {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      username: user.username,
    });

    return { accessToken, user };
  }
}
