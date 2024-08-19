import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from 'common/dto/page.dto';
import { DiscountsEntity } from 'modules/discount/entities/discount.entity';
import { DiscountPageOptionsDto } from 'modules/user/dtos/users-page-options.dto';
import { Repository } from 'typeorm';

import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountsEntity)
    private discountsRepository: Repository<DiscountsEntity>,
  ) {}

  async create(createDiscount: CreateDiscountDto) {
    const now = new Date();
    const {
      discountStartDate,
      discountEndDate,
      discountCode,
      discountAppliesToIds,
    } = createDiscount;

    if (
      now >= new Date(discountEndDate) ||
      new Date(now.setHours(now.getHours() - 1)) > new Date(discountStartDate)
    ) {
      throw new BadRequestException(
        'Start date and end date must be in the future!',
      );
    }

    if (new Date(discountStartDate) >= new Date(discountEndDate)) {
      throw new BadRequestException('Start date muse be before end date!');
    }

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

    if (foundDiscount) {
      throw new BadRequestException('Discount exist!');
    }

    return await this.discountsRepository.save(createDiscount);
  }

  async findAllDiscountForProduct(
    id: Uuid,
    pageOptionsDto: DiscountPageOptionsDto,
  ): Promise<PageDto<DiscountsEntity>> {
    const { order, page, skip, take, q } = pageOptionsDto;
    const [foundDiscounts, count] = await this.discountsRepository
      .createQueryBuilder('discounts')
      .where(':discountAppliesToId = ANY(discounts.discountAppliesToIds)', {
        discountAppliesToId: id,
      })
      .orderBy('discounts.createdAt', order) // Order by createdAt field
      .skip(skip) // Skip the number of records for pagination
      .take(take) // Limit the number of records for pagination
      .getManyAndCount();

    return { data: foundDiscounts, count };
  }

  async findAllDiscountForShop(
    id: Uuid,
    pageOptionsDto: DiscountPageOptionsDto,
  ): Promise<PageDto<DiscountsEntity>> {
    const { order, page, skip, take, q } = pageOptionsDto;
    const [foundDiscounts, count] = await this.discountsRepository
      .createQueryBuilder('discounts')
      .where('discounts.discountShopId = :discountShopId', {
        discountShopId: id,
      })
      .orderBy('discounts.createdAt', order) // Order by createdAt field
      .skip(skip) // Skip the number of records for pagination
      .take(take) // Limit the number of records for pagination
      .getManyAndCount();

    return { data: foundDiscounts, count };
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
