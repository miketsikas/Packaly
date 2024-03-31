/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  height: { type: Number, required: true },
  length: { type: Number, required: true },
  width: { type: Number, required: true },
  weight: { type: Number, required: true },
});

const addressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  zipcode: { type: String, required: true, validate: /.../ },
  phonenumber: { type: String, required: true },
});

export const OrderSchema = new mongoose.Schema({
  dropoff: { type: addressSchema, required: true },
  pickup: { type: addressSchema, required: true },
  packages: { type: [packageSchema], required: true },
  status: {
    type: String,
    required: true,
    enum: [
      'CREATED',
      'PICKED_UP',
      'DELIVERED',
      'CANCELLED',
      'RETURNING',
      'RETURNED',
    ],
    default: 'CREATED',
  },
  price: { type: Number, required: true },
});
