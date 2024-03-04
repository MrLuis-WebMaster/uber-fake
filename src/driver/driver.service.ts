import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DriverEntity } from './driver.entity';
import { RiderEntity } from '../rider/rider.entity';
import { calculateDistance } from '../libs/utils/calculateDistance.util';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(DriverEntity)
    private driverModel: typeof DriverEntity,
    @InjectModel(RiderEntity)
    private riderModel: typeof RiderEntity,
  ) {}

  async getClosestActiveDriver({
    latitude,
    longitude,
  }: {
    latitude: string;
    longitude: string;
  }): Promise<DriverEntity | null> {
    try {
      const driversWithLocations = await this.driverModel.findAll({
        where: { isAvailable: true },
      });

      let closestDriver: DriverEntity | null = null;
      let minDistance = Number.MAX_VALUE;

      for (const driver of driversWithLocations) {
        const driverCoordinates = driver.location;
        const distance = calculateDistance(
          { latitude, longitude },
          driverCoordinates,
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestDriver = driver;
        }
      }

      return closestDriver;
    } catch (error) {
      throw new NotFoundException('Error al buscar el conductor más cercano.');
    }
  }

  async calculatePrice(
    location: { latitude: string; longitude: string },
    driverId: number,
  ): Promise<number> {
    try {
      const driver = await this.driverModel.findByPk(driverId);

      if (!driver) {
        throw new NotFoundException(
          `Conductor con ID ${driverId} no encontrado.`,
        );
      }

      const distance = calculateDistance(location, driver.location);
      const minutes = 60;
      const price = distance * 1000 + minutes * 200 + 3500;
      return price;
    } catch (error) {
      throw new BadRequestException('Error al calcular el precio.');
    }
  }

  async finishDriver(
    location: { latitude: string; longitude: string },
    driverId: number,
  ): Promise<[affectedCount: number]> {
    try {
      const driverUpdated = await this.driverModel.update(
        { id: driverId },
        { where: { location } },
      );

      if (driverUpdated[0] === 0) {
        throw new NotFoundException(
          `Conductor con ID ${driverId} no encontrado.`,
        );
      }

      await this.riderModel.update(
        { driverId },
        { where: { paymentSource: null, driverId: null } },
      );

      return driverUpdated;
    } catch (error) {
      throw new BadRequestException('Error al finalizar el conductor.');
    }
  }
}
