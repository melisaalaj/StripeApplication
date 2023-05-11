import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from './entities/food-entity';
import { Repository } from 'typeorm';
import { StripeService } from 'src/stripe/stripe.service';
import { CreateFoodDto } from './dtos/create-food.dto';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food) private foodRepository: Repository<Food>,
    private readonly stripeService: StripeService,
  ) {}

  async create(createFood: CreateFoodDto): Promise<Food> {
    const stripeProduct = await this.stripeService.createProduct(
      createFood.name,
      createFood.price,
    );

    return await this.foodRepository.save(
      this.foodRepository.create({
        ...createFood,
        productId: stripeProduct.product.id,
      }),
    );
  }

  async findById(id: string): Promise<Food> {
    return this.foodRepository.findOne({ where: { id: parseInt(id) } });
  }
}
