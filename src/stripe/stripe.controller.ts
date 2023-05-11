import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AddCreditCardDto } from './dto/create-CreditCard.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/auth/currentUser';
import { UserService } from 'src/user/user.service';
import { CreateFoodDto } from 'src/food/dtos/create-food.dto';
import { FoodService } from 'src/food/food.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly userService: UserService,
    private readonly foodService: FoodService,
  ) {}

  @Post('charge')
  async charge(@Body() body: AddCreditCardDto) {
    return await this.stripeService.charge(body);
  }

  @Post('createProduct')
  async createProduct(@Body() body: CreateFoodDto): Promise<any> {
    const { product, price } = await this.stripeService.createProduct(
      body.name,
      body.price,
    );

    return { product, price };
  }

  @UseGuards(AuthGuard)
  @Post('chargeByProduct/:productId')
  async chargeByProduct(
    @Body() card: AddCreditCardDto,
    @Param('productId') productId: string,
    @CurrentUser() user: any,
  ) {
    const currentUser = await this.userService.findByEmail(user.email);
    const product = await this.foodService.findById(productId);

    return await this.stripeService.chargeByProduct(
      card,
      product.productId,
      product.price,
      currentUser.stripeCustomerId,
    );
  }
}
