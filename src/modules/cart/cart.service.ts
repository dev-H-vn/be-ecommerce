import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from 'modules/product/entities/product.entity';
import { CartsEntity } from 'modules/cart/entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    @InjectRepository(CartsEntity)
    private cardsRepository: Repository<CartsEntity>,
  ) {}

  async create(req: RequestType, createCartDto: CreateCartDto) {
    const { clientId } = req;
    const { productId, quantity } = createCartDto.product;

    const foundProduct = await this.productRepository.findOneBy({
      id: productId,
    });
    if (!foundProduct) throw new NotFoundException('Product not found!');

    if (quantity <= 0) {
      return await this.removeProduct(req, productId);
    }

    let foundCart = await this.cardsRepository.findOne({
      where: { cardUserId: clientId },
    });
    console.log('🐉 ~ CartService ~ create ~ foundCart ~  🚀\n', foundCart);
    if (!foundCart) {
      foundCart = await this.cardsRepository.save({
        cardUserId: clientId,
      });
    }
    const existingProduct = foundCart?.cardProducts.find(
      (product) => product.id === productId,
    );
    if (existingProduct && existingProduct.productQuantity) {
      // Update the product quantity if it already exists
      existingProduct.productQuantity += quantity;
    } else {
      // If the product does not exist, create a new one
      const newProduct = { ...foundProduct, productQuantity: quantity };
      foundCart?.cardProducts.push(newProduct);
    }
    // Update the product count
    foundCart.cardCountProducts = foundCart?.cardProducts.length;
    // Save the cart with the updated products
    return this.cardsRepository.save(foundCart);
  }

  async findAll(req: RequestType) {
    const { clientId } = req;
    let foundCart = await this.cardsRepository.findOne({
      where: { cardUserId: clientId },
    });
    return foundCart;
  }

  async removeProduct(req: RequestType, productId: Uuid) {
    const { clientId } = req;
    let foundCart = await this.cardsRepository.findOne({
      where: { cardUserId: clientId },
    });
    if (!foundCart) {
      throw new NotFoundException("User's cart not found");
    }
    foundCart.cardProducts = foundCart?.cardProducts.filter(
      (product) => product.id !== productId,
    );
    this.cardsRepository.save(foundCart);
    return foundCart;
  }
}
