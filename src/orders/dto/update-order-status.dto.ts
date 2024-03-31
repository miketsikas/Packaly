/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  @IsIn([
    'CREATED',
    'PICKED_UP',
    'DELIVERED',
    'CANCELLED',
    'RETURNING',
    'RETURNED',
  ])
  status:
    | 'CREATED'
    | 'PICKED_UP'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURNING'
    | 'RETURNED';
}
