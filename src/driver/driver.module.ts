import { Module, forwardRef } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { driverProvider } from './driver.provider';
import { RiderModule } from 'src/rider/rider.module';
import { WompiModule } from 'src/wompi/wompi.module';

@Module({
  imports: [forwardRef(() => RiderModule), forwardRef(() => WompiModule)],
  providers: [DriverService, ...driverProvider],
  exports: [DriverService, ...driverProvider],
  controllers: [DriverController],
})
export class DriverModule {}
