import { RiderEntity } from './rider.entity';
import { RIDER_REPOSITORY } from '../core/constants';

export const riderProvider = [
  {
    provide: RIDER_REPOSITORY,
    useValue: RiderEntity,
  },
];
