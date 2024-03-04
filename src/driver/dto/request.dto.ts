import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../libs/dto/location.dto';

export class RequestDto {
  @IsNotEmpty()
  readonly driverId: number;
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly location: LocationDto;
}
