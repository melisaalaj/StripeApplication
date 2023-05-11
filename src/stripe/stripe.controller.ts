import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { AddCreditCardDto } from './dto/create-CreditCard.dto';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('charge')
  async charge(@Body() body: AddCreditCardDto) {
    return await this.stripeService.charge(body);
  }

  @UseGuards(AuthGuard)
  @Post('chargeWithUser')
  async chargeWithUser(
    @Body() body: AddCreditCardDto,
    @Req() request: RequestWithUser,
  ) {
    console.log(request);
    return await this.stripeService.chargeWithUser(
      body,
      request.user.stripeCustomerId,
    );
  }
}
