import { Table, Column, DataType, Model, HasMany } from 'sequelize-typescript';
import { DriverEntity } from '../driver/driver.entity';
import { RiderEntity } from '../rider/rider.entity';

export enum UserRole {
  RIDER = 'RIDER',
  DRIVER = 'DRIVER',
}

@Table({ tableName: 'users', timestamps: false })
export class UserEntity extends Model<UserEntity> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fullName: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.ENUM({ values: Object.keys(UserRole) }),
    allowNull: false,
  })
  role: UserRole;

  @HasMany(() => RiderEntity)
  riders: RiderEntity[];

  @HasMany(() => DriverEntity)
  drivers: DriverEntity[];
}
