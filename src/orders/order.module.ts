import { Module } from '@nestjs/common';
import { orderController } from './order.controller';


@Module({
  imports: [],
  controllers: [orderController],
  providers: [],
})
export class ProductModule {}
