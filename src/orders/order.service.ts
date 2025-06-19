
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderStatus } from './schemas/order.schema'

@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<Order>) { }
    async findOrderById(id: string): Promise<object | string> {
        const existingOrder = await this.orderModel.findById(id);
        if (!existingOrder) return 'Order not found'
        return existingOrder
    }

    async findAll(): Promise<object | string> {
        const existingOrder = await this.orderModel.find({});
        if (!existingOrder) return 'Order not found'

        return existingOrder
    }
  
    async updateOrder(id :string,status:string): Promise<string>{
        const existingOrder = await this.orderModel.findByIdAndUpdate(
            {
                id
            },
            {
                status:status
            }
        
        );
        if (!existingOrder) return 'Order not found'
        return 'successfully update Order'
    }


}
