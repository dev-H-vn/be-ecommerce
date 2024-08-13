import { Inject, Injectable } from '@nestjs/common';
import { OrdersRepositories } from 'modules/order/repositories/order.repositories';
import { CheckoutDto, CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDERS_REPOSITORIES')
    private repositories: OrdersRepositories,
  ) {}

  async orderProducts(request: RequestType, checkoutDto: CheckoutDto) {
    const { orders, checkout_order } = await this.getCheckoutPreview(
      request,
      checkoutDto,
    );
    return 'This action adds a new order';
  }

  async getCheckoutPreview(request: RequestType, checkoutDto: CheckoutDto) {
    const { orders } = checkoutDto;
    let checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      shopDiscount: 0,
      discount: 0,
      totalDiscount: 0,
      totalCheckOut: 0,
    };

    for (const order of orders) {
      const {
        discounts: discountsInput,
        itemsProduct,
        shopDiscounts,
        shopId,
      } = order;
      const productIds = itemsProduct.map((product) => product.productId);
      const discountsIds = discountsInput.map(
        (discount) => discount.discountId,
      );
      const shopDiscountIds = shopDiscounts.map(
        (shopDiscount) => shopDiscount.discountId,
      );

      const products = await this.repositories.productRepository
        .createQueryBuilder('products')
        .where('products.id IN (:...productIds)', { productIds })
        .getMany();
      console.log(
        '🐉 ~ OrderService ~ getCheckoutPreview ~ products ~  🚀\n',
        products,
      );
      const discounts =
        discountsIds.length > 0 &&
        (await this.repositories.discountRepository
          .createQueryBuilder('discounts')
          .where('discounts.id IN (:...discountsIds)', { discountsIds })
          .getMany());
      console.log(
        '🐉 ~ OrderService ~ getCheckoutPreview ~ discounts ~  🚀\n',
        discounts,
        discountsIds,
      );
      const shopDiscount =
        shopDiscountIds.length > 0 &&
        (await this.repositories.discountRepository
          .createQueryBuilder('discounts')
          .where('discounts.id IN (:...shopDiscountIds)', { shopDiscountIds })
          .andWhere('discounts.discountShopId = :shopId', {
            shopId,
          })
          .getMany());
      console.log(
        '🐉 ~ OrderService ~ getCheckoutPreview ~ shopDiscount ~  🚀\n',
        shopDiscount,
        shopDiscountIds,
      );

      checkout_order = {
        ...checkout_order,
        totalPrice:
          checkout_order.totalPrice +
          products.reduce((accumulator, product) => {
            const productInput = itemsProduct.find(
              (item) => item.productId === product.id,
            );
            return (
              accumulator + product.productPrice * (productInput?.quantity || 1)
            );
          }, 0),
        feeShip: 0,
        shopDiscount: shopDiscount
          ? checkout_order.shopDiscount +
            shopDiscount.reduce(
              (accumulator, discount) =>
                accumulator + Number(discount.discountValue),
              0,
            )
          : checkout_order.shopDiscount,
        discount: discounts
          ? checkout_order.discount +
            discounts.reduce(
              (accumulator, discount) =>
                accumulator + Number(discount.discountValue),
              0,
            )
          : checkout_order.discount,
      };
    }

    const totalDiscount = checkout_order.discount + checkout_order.shopDiscount;
    const totalCheckOut =
      checkout_order.totalPrice - totalDiscount + checkout_order.feeShip;
    console.log(
      '🐉 ~ OrderService ~ getCheckoutPreview ~ totalCheckOut ~  🚀\n',
      checkout_order.totalPrice,
      checkout_order.totalDiscount,
      totalDiscount,
    );

    return {
      orders,
      checkout_order: {
        ...checkout_order,
        totalCheckOut: totalCheckOut <= 0 ? 0 : totalCheckOut,
        totalDiscount: totalDiscount,
      } as typeof checkout_order,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
