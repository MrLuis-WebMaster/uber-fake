import { IsNotEmpty } from 'class-validator';

export class LocationDto {
  @IsNotEmpty()
  readonly latitude: string;
  @IsNotEmpty()
  readonly longitude: string;
}
