import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserEntity, UserRole } from './user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';

const mockUserEntity = {
  findOne: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(UserEntity),
          useValue: mockUserEntity,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByEmailAndRoleRider', () => {
    it('should return a user when found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: UserRole.RIDER,
      };
      mockUserEntity.findOne.mockResolvedValue(mockUser);

      const result =
        await service.getUserByEmailAndRoleRider('test@example.com');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserEntity.findOne.mockResolvedValue(null);
      await expect(
        service.getUserByEmailAndRoleRider('nonexistent@example.com'),
      ).rejects.toThrowError(
        new NotFoundException(
          'User with email nonexistent@example.com not found',
          'UserNotFound',
        ),
      );
    });
  });
});
