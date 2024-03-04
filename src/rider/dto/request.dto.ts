import { IsEmail, IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from '../../libs/dto/location.dto';

export class RequestDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
  @IsNotEmpty()
  readonly token: string;
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly location: LocationDto;
}
