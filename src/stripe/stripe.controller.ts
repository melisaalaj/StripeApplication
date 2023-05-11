import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AddCreditCardDto } from './dto/create-CreditCard.dto';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CurrentUser } from 'src/auth/currentUser';
import { UserService } from 'src/user/user.service';

@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly userService: UserService,
  ) {}

  @Post('charge')
  async charge(@Body() body: AddCreditCardDto) {
    return await this.stripeService.charge(body);
  }

  @UseGuards(AuthGuard)
  @Post('chargeWithUser')
  async chargeWithUser(
    @Body() body: AddCreditCardDto,
    @CurrentUser() user: any,
  ) {
    const currentUser = await this.userService.findByEmail(user.email);
    console.log(currentUser);
    return await this.stripeService.chargeWithUser(
      body,
      currentUser.stripeCustomerId,
    );
  }
}
