/* eslint-disable prettier/prettier */
import { ConflictException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { getModelToken } from '@nestjs/mongoose';
import { TestingModule, Test } from '@nestjs/testing';

describe('OrdersService', () => {
  let ordersService: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken('Order'),
          useValue: {
            findById: jest.fn().mockImplementation((orderId: string) => {
              return { _id: orderId, status: 'CREATED', save: jest.fn() };
            }),
            save: jest.fn().mockResolvedValue({ _id: 'some_order_id', status: 'PICKED_UP' }), 
          },
        },
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
  });

  describe('updateOrderStatus', () => {
    it('should update order status and return the updated status', async () => {
      const orderId = 'some_order_id';
      const newStatus = 'PICKED_UP';
    
      const result = await ordersService.updateOrderStatus(orderId, newStatus);
    
      expect(result.orderId).toBe(orderId);
      expect(result.newStatus).toBe(newStatus);
    });

    it('should throw ConflictException for invalid status transition', async () => {
      const orderId = 'some_order_id';
      const newStatus = 'DELIVERED';

      await expect(ordersService.updateOrderStatus(orderId, newStatus)).rejects.toThrowError(ConflictException);
    });
  });

  describe('validateStatusTransition', () => {
    it('should return true for valid status transition', () => {
      const currentStatus = 'CREATED';
      const newStatus = 'PICKED_UP';

      const result = ordersService.validateStatusTransition(currentStatus, newStatus);

      expect(result).toBe(true);
    });

    it('should return false for invalid status transition', () => {
      const currentStatus = 'CREATED';
      const newStatus = 'DELIVERED';

      const result = ordersService.validateStatusTransition(currentStatus, newStatus);

      expect(result).toBe(false);
    });
  });

  describe('calculatePrice', () => {
    it('should calculate the price correctly for packages with volume less than 5000', () => {
      const packages = [{ height: 10, length: 10, width: 30, weight: 40 }];
      const totalPrice = ordersService.calculatePrice(packages);
      expect(totalPrice).toBe(5);
    });

    it('should calculate the price correctly for packages with volume greater than 5000', () => {
      const packages = [{ height: 50, length: 50, width: 50, weight: 50 }];
      const totalPrice = ordersService.calculatePrice(packages);
      expect(totalPrice).toBe(18.5); 
    });

    it('should calculate the price correctly for multiple packages', () => {
      const packages = [
        { height: 10, length: 20, width: 30, weight: 40 },
        { height: 50, length: 50, width: 50, weight: 50 }
      ];
      const totalPrice = ordersService.calculatePrice(packages);
      expect(totalPrice).toBe(24.5);
    });

    it('should calculate the price correctly for multiple packages', () => {
      const packages = [
        { height: 10, length: 20, width: 30, weight: 40 },  
        { height: 50, length: 50, width: 50, weight: 50 },
        { height: 100, length: 50, width: 50, weight: 50 }
      ];
      const totalPrice = ordersService.calculatePrice(packages);
      expect(totalPrice).toBe(55.5);
    });
  });
});

