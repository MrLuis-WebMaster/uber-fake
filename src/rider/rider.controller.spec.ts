import { Test, TestingModule } from '@nestjs/testing';
import { RiderController } from './rider.controller';
import { WompiService } from '../wompi/wompi.service';
import { RiderService } from './rider.service';
import { DriverService } from '../driver/driver.service';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

const mockWompiService = {
  savePaymentSource: jest.fn(),
};

const mockRiderService = {
  assignDriverToRider: jest.fn(),
};

const mockDriverService = {
  getClosestActiveDriver: jest.fn(),
};

describe('RiderController', () => {
  let controller: RiderController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiderController],
      providers: [
        { provide: WompiService, useValue: mockWompiService },
        { provide: RiderService, useValue: mockRiderService },
        { provide: DriverService, useValue: mockDriverService },
      ],
    }).compile();

    controller = module.get<RiderController>(RiderController);
    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /rider/request', () => {
    it('should return rider data on successful request', async () => {
      mockWompiService.savePaymentSource.mockResolvedValue({
        id: 1,
        name: 'John Doe',
      });
      mockDriverService.getClosestActiveDriver.mockResolvedValue({
        id: 2,
        name: 'Jane Doe',
      });
      mockRiderService.assignDriverToRider.mockResolvedValue({
        id: 1,
        name: 'John Doe',
        driverId: 2,
      });

      const response = await request(app.getHttpServer())
        .post('/rider/request')
        .send({
          token: 'mockToken',
          email: 'john@example.com',
          location: { latitude: '12', longitude: '34' },
        })
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual({ id: 1, name: 'John Doe' });
    });
  });
});
