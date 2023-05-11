import { IsNotEmpty, IsString } from 'class-validator';

export class AddCreditCardDto {
  @IsString()
  @IsNotEmpty()
  cardNumber: string;

  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsString()
  @IsNotEmpty()
  zip: string;
}
