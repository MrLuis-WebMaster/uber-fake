import { Module } from '@nestjs/common';
import { RiderModule } from './rider/rider.module';
import { DriverModule } from './driver/driver.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './core/database/database.module';
import { TransactionService } from './transaction/transaction.service';
import { UserService } from './user/user.service';
import { RiderService } from './rider/rider.service';
import { DriverService } from './driver/driver.service';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RiderModule,
    UserModule,
    DriverModule,
    TransactionModule,
  ],
  providers: [TransactionService, UserService, RiderService, DriverService],
})
export class AppModule {}
