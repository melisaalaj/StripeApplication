import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { AddCreditCardDto } from './dto/create-CreditCard.dto';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
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
    try {
      const token = await this.stripe.tokens.create({
        card: {
          number: body.cardNumber,
          cvc: body.cvc,
          exp_month: '12',
          exp_year: '2026',
          address_zip: body.zip,
        },
      });

      console.log(token);

      const charge = await this.stripe.charges.create({
        amount: 2000,
        currency: 'usd',
        source: token.id,
        description: 'Example charge',
      });

      return charge;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async chargeWithUser(body: AddCreditCardDto, customerId: string) {
    const token = await this.stripe.tokens.create({
      card: {
        number: body.cardNumber,
        cvc: body.cvc,
        exp_month: body.exp_month,
        exp_year: body.exp_year,
        address_zip: body.zip,
      },
    });

    const source = await this.stripe.customers.createSource(customerId, {
      source: token.id,
    });

    const charge = await this.stripe.charges.create({
      amount: 2000,
      customer: customerId,
      currency: 'eur',
      source: source.id,
      description: 'Example charge',
    });

    return charge;
  }
}
