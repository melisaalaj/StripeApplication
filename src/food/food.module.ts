import { Module, forwardRef } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food-entity';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [TypeOrmModule.forFeature([Food]) ],
  controllers: [FoodController],
  providers: [FoodService, StripeService],
  exports: [FoodService],
})
export class FoodModule {}
