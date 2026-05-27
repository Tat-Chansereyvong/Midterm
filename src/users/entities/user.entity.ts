export interface UserEntity {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export type PublicUser = Omit<UserEntity, 'passwordHash'>;
