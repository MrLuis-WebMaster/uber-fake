import { Module, forwardRef } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { driverProvider } from './driver.provider';
import { RiderModule } from 'src/rider/rider.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [forwardRef(() => RiderModule), forwardRef(() => TransactionModule)],
  providers: [DriverService, ...driverProvider],
  exports: [DriverService, ...driverProvider],
  controllers: [DriverController],
})
export class DriverModule {}
