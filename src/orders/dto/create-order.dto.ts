/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
  ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdjustLength } from './customValidators/zipcode';

class PackageDto {
  @IsNotEmpty()
  height: number;

  @IsNotEmpty()
  length: number;

  @IsNotEmpty()
  width: number;

  @IsNotEmpty()
  weight: number;
}

class AddressDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @AdjustLength(6, { message: 'Zipcode must be 6 characters long excluding whitespaces' })
  zipcode: string;

  @IsPhoneNumber(null)
  phonenumber: string;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => AddressDto)
  pickup: AddressDto;

  @ValidateNested()
  @Type(() => AddressDto)
  dropoff: AddressDto;

  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'At least one package is required.' })
  @Type(() => PackageDto)
  packages: PackageDto[];
}
