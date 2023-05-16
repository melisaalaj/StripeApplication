import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Food } from 'src/food/entities/food-entity';
import { FoodService } from 'src/food/food.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([Food])],
  providers: [StripeService, UserService, FoodService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
