import { Test, TestingModule } from '@nestjs/testing';
import { DriverController } from './driver.controller';
import { RiderService } from '../rider/rider.service';
import { TransactionService } from '../transaction/transaction.service';
import { DriverService } from './driver.service';
import { RequestDto } from './dto/request.dto';

const mockRiderService = {
  getUserByDriverId: jest.fn(),
};

const mockTransactionService = {
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
          provide: TransactionService,
          useValue: mockTransactionService,
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
    });
  });
});
