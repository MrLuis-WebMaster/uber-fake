import {
  Table,
  Column,
  DataType,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { RiderEntity } from '../rider/rider.entity';
import { UserEntity } from '../user/user.entity';

@Table({ tableName: 'drivers', timestamps: true })
export class DriverEntity extends Model<DriverEntity> {
  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  location: { latitude: string; longitude: string } | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isAvailable: boolean;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @HasMany(() => RiderEntity)
  riders: RiderEntity[];
}
