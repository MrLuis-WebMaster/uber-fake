import { DRIVER_REPOSITORY } from '../core/constants';
import { DriverEntity } from './driver.entity';

export const driverProvider = [
  {
    provide: DRIVER_REPOSITORY,
    useValue: DriverEntity,
  },
];
