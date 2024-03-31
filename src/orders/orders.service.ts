/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
@Injectable()
export class OrdersService {
  constructor(@InjectModel('Order') private orderModel: Model<Order>) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<{ orderId: string, status: string, price: number }> {
    
    const price = this.calculatePrice(createOrderDto.packages).toFixed(2);

    const createdOrder = new this.orderModel({
      ...createOrderDto,
      price: price,
    });

    const savedOrder = await createdOrder.save();

    return {
      orderId: savedOrder._id.toString(),
      status: savedOrder.status,
      price: savedOrder.price, 
    };
  }

  calculatePrice(packages: any[]): number {
    let totalPrice = 0;
    packages.forEach(pkg => {
        const volume = pkg.height * pkg.length * pkg.width;
        let volumeCharge = 0;
        if (volume > 5000) {
            volumeCharge = ((Math.ceil((volume - 5000) / 5000)) * 0.5) + 0.5;
        }
        const weightCharge = pkg.weight * 0.10;
        totalPrice += 1 + volumeCharge + weightCharge;
    });
    return totalPrice;
  }




  async searchOrders(address: string, zipcode: string): Promise<string[]> {

    const cleanZipcode = zipcode.replace(/\s/g, '');

    const orders = await this.orderModel
    .find({
        'dropoff.address': { $regex: address, $options: 'i' },
        'dropoff.zipcode': { $regex: '^' + cleanZipcode.split('').join('\\s*') + '$', $options: 'i' },
    })
    .select('_id')
    .exec();
    
    const orderIds = orders.map(order => order._id.toString());
    return orderIds;
  }

  async updateOrderStatus(
    orderId: string,
    newStatus:
      | 'CREATED'
      | 'PICKED_UP'
      | 'DELIVERED'
      | 'CANCELLED'
      | 'RETURNING'
      | 'RETURNED',
  ): Promise<{ orderId: string, newStatus: string, oldStatus: string }> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  
    const oldStatus = order.status; 
  
    const isValidTransition = this.validateStatusTransition(
      oldStatus,
      newStatus,
    );
    if (!isValidTransition) {
      throw new ConflictException(
        `Invalid status transition from ${oldStatus} to ${newStatus}`,
      );
    }
  
    order.status = newStatus;
    await order.save();
  
    return { orderId, newStatus, oldStatus };
  }

  validateStatusTransition(
    currentStatus: string,
    newStatus: string,
  ): boolean {
    const transitions = {
      CREATED: ['PICKED_UP', 'CANCELLED'],
      PICKED_UP: ['DELIVERED', 'RETURNING'],
      RETURNING: ['RETURNED'],
    };

    const validTransitions = transitions[currentStatus];
    if (!validTransitions) {
      return false;
    }

    return validTransitions.includes(newStatus);
  }
}
