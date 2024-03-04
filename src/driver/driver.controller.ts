import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RiderService } from '../rider/rider.service';
import { WompiService } from '../wompi/wompi.service';
import { DriverService } from './driver.service';
import { RequestDto } from './dto/request.dto';

@Controller('driver')
export class DriverController {
  constructor(
    private readonly wompiService: WompiService,
    private readonly riderService: RiderService,
    private readonly driverService: DriverService,
  ) {}

  @Post('finish-request')
  async finishDriver(@Body() requestDto: RequestDto) {
    try {
      const price = await this.driverService.calculatePrice(
        requestDto.location,
        requestDto.driverId,
      );

      const rider = await this.riderService.getUserByDriverId(
        requestDto.driverId,
      );

      await this.driverService.finishDriver(
        requestDto.location,
        requestDto.driverId,
      );

      await this.wompiService.createTransaction(
        price,
        rider.user.email,
        rider.paymentSource,
      );

      return requestDto;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error interno del servidor',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
