import { Body, Controller, Post } from '@nestjs/common';
import { FoodService } from './food.service';
import { CreateFoodDto } from './dtos/create-food.dto';
import { Food } from './entities/food-entity';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {}

  @Post('create')
  async create(@Body() createFood: CreateFoodDto): Promise<Food> {
    return await this.foodService.create(createFood);
  }
}
