import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { CardsEntity } from 'modules/card/entities/card.entity';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CardsEntity)
    private cardsRepository: Repository<CardsEntity>,
  ) {}

  async create(req: RequestType, createCardDto: CreateCardDto) {
    const { clientId } = req;
    const { productId, quantity, shopId } = createCardDto.product;

    const foundProduct = await this.productRepository.findOneBy({
      id: productId,
    });
    if (!foundProduct) throw new NotFoundException('Product not found!');

    if (quantity <= 0) {
      //delete
    }

    const resp = await this.cardsRepository.save({});

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
