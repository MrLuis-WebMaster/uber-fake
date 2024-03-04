import { Test, TestingModule } from '@nestjs/testing';
import { RiderService } from './rider.service';
import { RiderEntity } from './rider.entity';
import { DriverEntity } from '../driver/driver.entity';
import { UserEntity } from '../user/user.entity';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';

const mockRiderEntity = {
  create: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
};

const mockDriverEntity = {
  findByPk: jest.fn(),
};

const mockUserEntity = {
  findOne: jest.fn(),
};

describe('RiderService', () => {
  let service: RiderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiderService,
        {
          provide: getModelToken(RiderEntity),
          useValue: mockRiderEntity,
        },
        {
          provide: getModelToken(DriverEntity),
          useValue: mockDriverEntity,
        },
        {
          provide: getModelToken(UserEntity),
          useValue: mockUserEntity,
        },
      ],
    }).compile();

    service = module.get<RiderService>(RiderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('savePaymentSourceForUser', () => {
    it('should save payment source for user', async () => {
      const mockRider = { id: 1, userId: 1, paymentSource: 12345 };
      mockRiderEntity.create.mockResolvedValue(mockRider);

      const mockUser = {
        id: 1,
        fullName: 'Rafael Aviatrix',
        email: 'rafaelaviatrix@gmail.com',
        phone: '0123456789',
        role: 'DRIVER',
      } as UserEntity;

      mockUserEntity.findOne.mockResolvedValue(mockUser);

      const result = await service.savePaymentSourceForUser(mockUser, 12345);
      expect(result).toEqual(mockRider);
    });
  });

  describe('assignDriverToRider', () => {
    it('should throw NotFoundException if driver not found', async () => {
      mockDriverEntity.findByPk.mockResolvedValue(null);
      await expect(
        service.assignDriverToRider(1, 1, { latitude: '56', longitude: '78' }),
      ).rejects.toThrowError(
        new NotFoundException('Driver with ID 1 not found.'),
      );
    });

    it('should throw NotFoundException if rider not found', async () => {
      mockRiderEntity.findByPk.mockResolvedValue(null);

      await expect(
        service.assignDriverToRider(1, 1, { latitude: '56', longitude: '78' }),
      ).rejects.toThrowError(
        new NotFoundException('Driver with ID 1 not found.'),
      );
    });
  });

  describe('getUserByDriverId', () => {
    it('should return rider with user when found', async () => {
      const mockRider = { id: 1, driverId: 1, user: { id: 1 } };
      mockRiderEntity.findOne.mockResolvedValue(mockRider);

      const result = await service.getUserByDriverId(1);
      expect(result).toEqual(mockRider);
    });

    it('should throw NotFoundException if rider not found', async () => {
      mockRiderEntity.findOne.mockResolvedValue(null);

      await expect(service.getUserByDriverId(1)).rejects.toThrowError(
        new NotFoundException('Rider with driver ID 1 not found.'),
      );
    });

    it('should throw NotFoundException if user not found for rider', async () => {
      mockRiderEntity.findOne.mockResolvedValue({
        id: 1,
        driverId: 1,
        user: null,
      });

      await expect(service.getUserByDriverId(1)).rejects.toThrowError(
        new NotFoundException('User not found for rider with driver ID 1.'),
      );
    });
  });
});
