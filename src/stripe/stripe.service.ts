import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { AddCreditCardDto } from './dto/create-CreditCard.dto';
import { FoodService } from 'src/food/food.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  public async createCustomer(name: string, email: string) {
    return this.stripe.customers.create({
      name,
      email,
    });
  }

  async charge(body: AddCreditCardDto) {
    const token = await this.stripe.tokens.create({
      card: {
        number: body.cardNumber,
        cvc: body.cvc,
        exp_month: body.exp_month,
        exp_year: body.exp_year,
        address_zip: body.zip,
      },
    });

    const charge = await this.stripe.charges.create({
      amount: 2000,
      currency: 'usd',
      source: token.id,
      description: 'Example charge',
    });

    return charge;
  }

  async createProduct(name: string, amount: number) {
    const product = await this.stripe.products.create({
      name: name,
      type: 'service',
    });

    const price = await this.stripe.prices.create({
      unit_amount: amount,
      currency: 'eur',
      product: product.id,
    });

    return { product, price };
  }

  async chargeByProduct(
    card: AddCreditCardDto,
    productId: string,
    amount: number,
    customerId: string,
  ) {
    const token = await this.stripe.tokens.create({
      card: {
        number: card.cardNumber,
        cvc: card.cvc,
        exp_month: card.exp_month,
        exp_year: card.exp_year,
        address_zip: card.zip,
      },
    });

    const source = await this.stripe.customers.createSource(customerId, {
      source: token.id,
    });

    const charge = await this.stripe.charges.create({
      amount: amount,
      customer: customerId,
      currency: 'eur',
      source: source.id,
      description: 'Your description',
      metadata: { productId: productId },
    });

    return charge;
  }
}
