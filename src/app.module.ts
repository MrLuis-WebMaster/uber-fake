import { Module } from '@nestjs/common';
import { RiderModule } from './rider/rider.module';
import { DriverModule } from './driver/driver.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './core/database/database.module';
import { WompiService } from './wompi/wompi.service';
import { UserService } from './user/user.service';
import { RiderService } from './rider/rider.service';
import { DriverService } from './driver/driver.service';
import { ConfigModule } from '@nestjs/config';
import { WompiModule } from './wompi/wompi.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RiderModule,
    UserModule,
    DriverModule,
    WompiModule,
  ],
  providers: [WompiService, UserService, RiderService, DriverService],
})
export class AppModule {}
