import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { DriverEntity } from '../driver/driver.entity';
import { UserEntity } from '../user/user.entity';

@Table({ tableName: 'riders', timestamps: true })
export class RiderEntity extends Model<RiderEntity> {
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  paymentSource: number;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @ForeignKey(() => DriverEntity)
  @Column({
    type: DataType.INTEGER,
  })
  driverId: number;

  @BelongsTo(() => DriverEntity)
  drivers: DriverEntity;

  @BelongsTo(() => UserEntity)
  user: UserEntity;
}
