import { Module, forwardRef } from '@nestjs/common';
import { WompiService } from './wompi.service';
import { RiderModule } from 'src/rider/rider.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [forwardRef(() => RiderModule), forwardRef(() => UserModule)],
  providers: [WompiService],
  exports: [WompiService],
})
export class WompiModule {}
