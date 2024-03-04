import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';
import { DEVELOPMENT, PRODUCTION, SEQUELIZE } from '../constants';
import { UserEntity } from '../../user/user.entity';
import { DriverEntity } from 'src/driver/driver.entity';
import { RiderEntity } from 'src/rider/rider.entity';

let config: any;
switch (process.env.NODE_ENV) {
  case DEVELOPMENT:
    config = databaseConfig.development;
    break;
  case PRODUCTION:
    config = databaseConfig.production;
    break;
  default:
    config = databaseConfig.development;
}

if (process.env.NODE_ENV === 'production') {
  config.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

export const sequelize = new Sequelize(config);

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      sequelize.addModels([UserEntity, DriverEntity, RiderEntity]);
      sequelize.sync({ alter: true });
      return sequelize;
    },
  },
];
