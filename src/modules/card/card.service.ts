import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'modules/product/entities/product.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}
  async create(req: RequestType, createCardDto: CreateCardDto) {
    const { clientId } = req;
    const { product } = createCardDto;

    const foundShop = await this.productRepository.findOneBy({
      id: product.shopId,
    });
    if (!foundShop) throw new NotFoundException('Product not found!');
    console.log(
      '🐉 ~ CardService ~ create ~ createCardDto ~ 🚀\n',
      createCardDto,
    );
    return 'This action adds a new card';
  }

  findAll() {
    return `This action returns all card`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
