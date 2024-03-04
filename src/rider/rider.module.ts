import { Module, forwardRef } from '@nestjs/common';
import { RiderService } from './rider.service';
import { RiderController } from './rider.controller';
import { riderProvider } from './rider.provider';
import { WompiModule } from 'src/wompi/wompi.module';
import { DriverModule } from 'src/driver/driver.module';

@Module({
  imports: [forwardRef(() => WompiModule), forwardRef(() => DriverModule)],
  providers: [RiderService, ...riderProvider],
  exports: [RiderService, ...riderProvider],
  controllers: [RiderController],
})
export class RiderModule {}
