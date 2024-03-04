import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from './driver.controller';
import { RiderService } from '../rider/rider.service';
import { WompiService } from '../wompi/wompi.service';
import { DriverService } from './driver.service';
import { RequestDto } from './dto/request.dto';

const mockRiderService = {
  getUserByDriverId: jest.fn(),
};

const mockWompiService = {
  createTransaction: jest.fn(),
};

const mockDriverService = {
  calculatePrice: jest.fn(),
  finishDriver: jest.fn(),
};

describe('DriverController', () => {
  let controller: DriverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverController],
      providers: [
        {
          provide: RiderService,
          useValue: mockRiderService,
        },
        {
          provide: WompiService,
          useValue: mockWompiService,
        },
        {
          provide: DriverService,
          useValue: mockDriverService,
        },
      ],
    }).compile();

    controller = module.get<DriverController>(DriverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('finishDriver', () => {
    it('should finish the driver request successfully', async () => {
      const requestDto: RequestDto = {
        location: { latitude: '123', longitude: '456' },
        driverId: 1,
      };

      mockDriverService.calculatePrice.mockResolvedValue(100);
      mockRiderService.getUserByDriverId.mockResolvedValue({
        user: { email: 'rider@example.com' },
        paymentSource: 123,
      });

      await expect(controller.finishDriver(requestDto)).resolves.toEqual(
        requestDto,
      );

      expect(mockDriverService.calculatePrice).toHaveBeenCalledWith(
        requestDto.location,
        requestDto.driverId,
      );
      expect(mockRiderService.getUserByDriverId).toHaveBeenCalledWith(
        requestDto.driverId,
      );
      expect(mockDriverService.finishDriver).toHaveBeenCalledWith(
        requestDto.location,
        requestDto.driverId,
      );
      expect(mockWompiService.createTransaction).toHaveBeenCalledWith(
        100,
        'rider@example.com',
        123,
      );
    });

    it('should handle errors gracefully', async () => {
      const requestDto: RequestDto = {
        location: { latitude: '123', longitude: '456' },
        driverId: 1,
      };

      mockDriverService.calculatePrice.mockRejectedValue(
        new Error('Failed to calculate price'),
      );

      await expect(controller.finishDriver(requestDto)).rejects.toThrowError(
        'Http Exception',
      );

      expect(mockDriverService.calculatePrice).toHaveBeenCalledWith(
        requestDto.location,
        requestDto.driverId,
      );
      expect(mockRiderService.getUserByDriverId).toHaveBeenCalled();
      expect(mockDriverService.finishDriver).toHaveBeenCalled();
      expect(mockWompiService.createTransaction).toHaveBeenCalled();
    });
  });
});
