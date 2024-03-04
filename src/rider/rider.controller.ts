import { Body, Controller, Post, HttpException } from '@nestjs/common';
import { RequestDto } from './dto/request.dto';
import { TransactionService } from '../transaction/transaction.service';
import { RiderService } from './rider.service';
import { DriverService } from '../driver/driver.service';

@Controller('rider')
export class RiderController {
  constructor(
    private readonly TransactionService: TransactionService,
    private readonly riderService: RiderService,
    private readonly driverService: DriverService,
  ) {}

  @Post('request')
  async requestDriver(@Body() requestDto: RequestDto) {
    try {
      const rider = await this.TransactionService.savePaymentSource(
        requestDto.token,
        requestDto.email,
      );

      const driver = await this.driverService.getClosestActiveDriver(
        requestDto.location,
      );

      await this.riderService.assignDriverToRider(
        driver.id,
        rider.id,
        requestDto.location,
      );
      return rider;
    } catch (error) {
      throw new HttpException(error?.message, error.status);
    }
  }
}
