import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { RiderService } from '../rider/rider.service';
import { UserService } from '../user/user.service';

const mockRiderService = {
  savePaymentSourceForUser: jest.fn(),
};

const mockUserService = {
  getUserByEmailAndRoleRider: jest.fn(),
};

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: RiderService,
          useValue: mockRiderService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAcceptanceToken', () => {
    it('should return acceptance token', async () => {
      const mockResponse = {
        data: {
          data: {
            presigned_acceptance: { acceptance_token: 'mock-acceptance-token' },
          },
        },
      };

      jest
        .spyOn(service, 'getAcceptanceToken')
        .mockResolvedValue(
          mockResponse.data.data.presigned_acceptance.acceptance_token,
        );

      const result = await service.getAcceptanceToken();
      expect(result).toEqual('mock-acceptance-token');
    });

    it('should throw an error if fetchingPublic fails', async () => {
      jest
        .spyOn(service, 'getAcceptanceToken')
        .mockRejectedValue(
          new Error('No se pudo obtener el token de aceptación.'),
        );

      await expect(service.getAcceptanceToken()).rejects.toThrowError(
        'No se pudo obtener el token de aceptación.',
      );
    });
  });
});
