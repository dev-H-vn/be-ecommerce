import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountsEntity } from 'modules/discount/entities/discount.entity';
import { Repository } from 'typeorm';
import {
  DiscountPageOptionsDto,
  ProductPageOptionsDto,
} from 'modules/user/dtos/users-page-options.dto';

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
      .andWhere('discounts.discountCode = :discountCode', {
        // want use condition or then ro use orWhere
        discountCode,
      })
      .getOne(); // condition || _ or
    console.log(
      '🐉 ~ DiscountService ~ create ~ foundDiscount ~ 🚀\n',
      foundDiscount,
    );
    if (foundDiscount) throw new BadRequestException('Discount exist!');

    const newDiscord = await this.discountsRepository.save(createDiscount);
    return newDiscord;
  }

  async findAllDiscountForProduct(
    id: Uuid,
    pageOptionsDto: DiscountPageOptionsDto,
  ) {
    const { order, page, skip, take, q } = pageOptionsDto;
    const foundDiscount = await this.discountsRepository
      .createQueryBuilder('discounts')
      .where(':discountAppliesToId = ANY(discounts.discountAppliesToIds)', {
        discountAppliesToId: id,
      })
      .orderBy('discounts.createdAt', order) // Order by createdAt field
      .skip(skip) // Skip the number of records for pagination
      .take(take) // Limit the number of records for pagination
      .getMany();
    console.log(
      '🐉 ~ DiscountService ~ findAllDiscountForProduct ~ id ~ 🚀\n',
      id,
      foundDiscount,
    );
    return foundDiscount;
  }

  findAll() {
    return `This action returns all discount`;
  }

  update(id: number, updateDiscountDto: UpdateDiscountDto) {
    return `This action updates a #${id} discount`;
  }

  remove(id: number) {
    return `This action removes a #${id} discount`;
  }
}
