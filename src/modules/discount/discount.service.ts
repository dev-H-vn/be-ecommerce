import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountsEntity } from 'modules/discount/entities/discount.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountsEntity)
    private discountsRepository: Repository<DiscountsEntity>,
  ) {}

  async create(createDiscount: CreateDiscountDto) {
    console.log(
      '🐉 ~ DiscountService ~ create ~ createDiscountDto ~ 🚀\n',
      createDiscount,
    );

    const {
      discountStartDate,
      discountEndDate,
      discountCode,
      discountAppliesToIds,
    } = createDiscount;

    if (
      new Date() >= new Date(discountEndDate) ||
      new Date() > new Date(discountStartDate)
    )
      throw new BadRequestException(
        'Start date and end date must be in the future!',
      );
    if (new Date(discountStartDate) >= new Date(discountEndDate))
      throw new BadRequestException('Start date muse be before end date!');

    const foundDiscount = await this.discountsRepository
      .createQueryBuilder('discounts')
      .where('discounts.discountAppliesToIds && :discountAppliesToIds', {
        discountAppliesToIds,
      })
      //   .andWhere('discounts.discountCode = :discountCode', {
      //     discountCode,
      //   })
      .getOne();

    if (foundDiscount) throw new BadRequestException('Discount exist!');

    const newDiscord = await this.discountsRepository.save(createDiscount);

    console.log(
      '🐉 ~ DiscountService ~ create ~ foundDiscount ~ 🚀\n',
      foundDiscount,
    );

    return newDiscord;
  }

  findAll() {
    return `This action returns all discount`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discount`;
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return `This action updates a #${id} discount`;
  }

  remove(id: number) {
    return `This action removes a #${id} discount`;
  }
}
