import { Module, forwardRef } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { RiderModule } from 'src/rider/rider.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [forwardRef(() => RiderModule), forwardRef(() => UserModule)],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
