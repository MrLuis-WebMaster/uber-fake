import { Module, forwardRef } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';
import { riderProvider } from './rider.provider';
import { TransactionModule } from 'src/transaction/transaction.module';
import { DriverModule } from 'src/driver/driver.module';

@Module({
  imports: [
    forwardRef(() => TransactionModule),
    forwardRef(() => DriverModule),
  ],
  providers: [RiderService, ...riderProvider],
  exports: [RiderService, ...riderProvider],
  controllers: [RiderController],
})
export class RiderModule {}
