/* eslint-disable prettier/prettier */
interface Package {
  height: number;
  length: number;
  width: number;
  weight: number;
}

interface Address {
  address: string;
  city: string;
  country: string;
  email: string;
  name: string;
  zipcode: string;
  phonenumber: string;
}

export interface Order {
  id?: string;
  pickup: Address;
  dropoff: Address;
  packages: Package[];
  status:
    | 'CREATED'
    | 'PICKED_UP'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'RETURNING'
    | 'RETURNED';
  price: number;
}
