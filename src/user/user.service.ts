import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity, UserRole } from './user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity)
    private userEntity: typeof UserEntity,
  ) {}
  async getUserByEmailAndRoleRider(email: string): Promise<UserEntity> {
    const user = await this.userEntity.findOne({
      where: { email, role: UserRole.RIDER },
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
