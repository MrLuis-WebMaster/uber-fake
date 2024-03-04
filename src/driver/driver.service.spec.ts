import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { DriverService } from './driver.service';
import { DriverEntity } from './driver.entity';
import { RiderEntity } from '../rider/rider.entity';
import { BadRequestException } from '@nestjs/common';

jest.mock('./driver.entity');
const mockDriverEntity = DriverEntity as jest.Mocked<typeof DriverEntity>;

jest.mock('../rider/rider.entity');
const mockRiderEntity = RiderEntity as jest.Mocked<typeof RiderEntity>;

describe('DriverService', () => {
  let service: DriverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriverService,
        {
          provide: getModelToken(DriverEntity),
          useValue: mockDriverEntity,
        },
        {
          provide: getModelToken(RiderEntity),
          useValue: mockRiderEntity,
        },
      ],
    }).compile();

    service = module.get<DriverService>(DriverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getClosestActiveDriver', () => {
    it('should return the closest active driver', async () => {
      const mockDrivers = [
        {
          id: 1,
          location: { latitude: '12.34', longitude: '56.78' },
          isAvailable: true,
        },
        {
          id: 2,
          location: { latitude: '13.45', longitude: '57.89' },
          isAvailable: true,
        },
      ] as DriverEntity[];

      mockDriverEntity.findAll.mockResolvedValue(mockDrivers);

      const result = await service.getClosestActiveDriver({
        latitude: '12.36',
        longitude: '56.80',
      });

      expect(result).toEqual(mockDrivers[0]);
      expect(mockDriverEntity.findAll).toHaveBeenCalledWith({
        where: { isAvailable: true },
      });
    });

    it('should return null if no active drivers are available', async () => {
      mockDriverEntity.findAll.mockResolvedValue([]);

      const result = await service.getClosestActiveDriver({
        latitude: '12.36',
        longitude: '56.80',
      });

      expect(result).toBeNull();

      expect(mockDriverEntity.findAll).toHaveBeenCalledWith({
        where: { isAvailable: true },
      });
    });
  });

  describe('calculatePrice', () => {
    it('should calculate the price based on location and driver', async () => {
      const mockDriver = {
        id: 1,
        location: { latitude: '12.34', longitude: '56.78' },
      } as DriverEntity;
      const mockLocation = { latitude: '12.36', longitude: '56.80' };

      mockDriverEntity.findByPk.mockResolvedValue(mockDriver);

      const result = await service.calculatePrice(mockLocation, 1);

      expect(result).toBeCloseTo(18608.890900266742);

      expect(mockDriverEntity.findByPk).toHaveBeenCalledWith(1);
    });
  });

  describe('finishDriver', () => {
    it('should finish the driver request and update rider and driver', async () => {
      const mockLocation = { latitude: '12.36', longitude: '56.80' };
      const mockRiderId = 1;

      mockRiderEntity.update(
        { driverId: mockRiderId },
        { where: { paymentSource: null, driverId: null } },
      );
      mockDriverEntity.update(
        { id: mockRiderId },
        { where: { location: mockLocation } },
      );

      mockDriverEntity.update.mockRejectedValue(
        new BadRequestException('Error al finalizar el conductor.'),
      );

      await expect(
        service.finishDriver(mockLocation, mockRiderId),
      ).rejects.toThrowError(BadRequestException);

      expect(mockRiderEntity.update).toHaveBeenCalledWith(
        { driverId: mockRiderId },
        { where: { paymentSource: null, driverId: null } },
      );
      expect(mockDriverEntity.update).toHaveBeenCalledWith(
        { id: mockRiderId },
        { where: { location: mockLocation } },
      );
    });
  });
});
