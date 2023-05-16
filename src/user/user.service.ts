import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private stripeService: StripeService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const stripeCustomer = await this.stripeService.createCustomer(
      createUserDto.name,
      createUserDto.email,
    );

    return await this.userRepository.save(
      this.userRepository.create({
        ...createUserDto,
        stripeCustomerId: stripeCustomer.id,
      }),
    );
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!user) {
      throw new UnprocessableEntityException('This user does not exist!');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
  //   const user = await this.findOne(userId);
  //   await this.userRepository.update(user.id, updateUserDto);
  //   return await this.findOne(userId);
  // }

  async remove(userId: string): Promise<void> {
    const user = await this.findOne(userId);
    await this.userRepository.remove(user);
  }

  findUserByName() {
    
  }
}
