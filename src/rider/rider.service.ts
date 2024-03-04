import { Injectable, NotFoundException } from '@nestjs/common';
import { RiderEntity } from './rider.entity';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from '../user/user.entity';
import { DriverEntity } from '../driver/driver.entity';
import { Op } from 'sequelize';

@Injectable()
export class RiderService {
  constructor(
    @InjectModel(RiderEntity)
    private riderEntity: typeof RiderEntity,
    @InjectModel(DriverEntity)
    private driverEntity: typeof DriverEntity,
  ) {}
  async savePaymentSourceForUser(
    user: UserEntity,
    paymentSource: number,
  ): Promise<RiderEntity> {
    return this.riderEntity.create({
      paymentSource,
      userId: user.id,
    });
  }
  async assignDriverToRider(
    driverId: number,
    riderId: number,
    location: { latitude: string; longitude: string },
  ) {
    const driver = await this.driverEntity.findByPk(driverId);
    if (!driver) {
      throw new NotFoundException(`Driver with ID ${driverId} not found.`);
    }
    const rider = await this.riderEntity.findByPk(riderId);
    if (!rider) {
      throw new NotFoundException(`Rider with ID ${riderId} not found.`);
    }
    rider.driverId = driver.id;
    driver.location = location;
    driver.isAvailable = false;
    await rider.save();
    await driver.save();
    return rider;
  }
  async getUserByDriverIdAndCheckingPaymentSource(
    driverId: number,
  ): Promise<RiderEntity> {
    const rider = await this.riderEntity.findOne({
      where: { driverId, paymentSource: { [Op.not]: null } },
      include: [UserEntity],
    });

    if (!rider) {
      throw new NotFoundException(
        `Rider with driver ID ${driverId} not found.`,
      );
    }

    const user = rider.user;

    if (!user) {
      throw new NotFoundException(
        `User not found for rider with driver ID ${driverId}.`,
      );
    }

    return rider;
  }
}
