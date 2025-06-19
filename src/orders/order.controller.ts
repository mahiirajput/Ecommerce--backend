import { Controller, Delete, Get, Param, Put } from "@nestjs/common";
import { OrderService } from "./order.service";


@Controller('order')
export class orderController{
    
    constructor(private readonly OrderService:OrderService) {}

    @Get('/view/:id')
    async getOrder(@Param('id') id){
        return await this.OrderService.findOrderById(id)
    }

    @Get('/view')
    async getAll(){
        return await this.OrderService.findAll();
    }
    @Put('/update/:id/:status')
    async blockUser(@Param('id') id,@Param('status') status){
        return await this.OrderService.updateOrder(id,status)
    }
}