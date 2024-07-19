import { BadRequestException, Injectable } from '@nestjs/common';
import { ShopRegisterDto } from 'modules/auth/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopEntity } from 'modules/shop/shop.entity';
import { Repository } from 'typeorm';
import { generateHash } from 'common/utils';
import { AuthService } from 'modules/auth/auth.service';
import crypto from 'crypto';
import { RoleType } from 'constant';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ShopService {
  constructor(
    private authService: AuthService,

    @InjectRepository(ShopEntity)
    private shopRepository: Repository<ShopEntity>,
  ) {}

  async register(createShopDto: ShopRegisterDto) {
    const { email, password, shopName } = createShopDto;

    const holderShop = await this.shopRepository.findOne({
      where: { email: email },
    });
    if (holderShop) {
      throw new BadRequestException('Shop Already registered!');
    }

    const passWordHash = generateHash(password);
    const newShop = await this.shopRepository.create({
      id: uuidV4(),
      email,
      shopName,
      password: passWordHash,
    });
    if (newShop) {
      const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'spki',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8',
          format: 'pem',
        },
      });

      const publicKeyString = await this.authService.createKeyToken({
        publicKey,
        userId: newShop.id,
        role: RoleType.SHOP,
      });
      if (!publicKeyString) {
        throw new BadRequestException('publicKeyString error');
      }
      //create token pair
      const tokens = await this.authService.createTokenPair({
        privateKey: privateKey.toString(),
        publicKey: publicKeyString,
        role: RoleType.SHOP,
        userId: newShop.id,
      });
      this.shopRepository.save({
        ...newShop,
        refreshToken: tokens.refetchToken,
      });
    }

    return newShop;
  }

  findAll() {
    return `This action returns all shop`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

  //   update(id: number, updateShopDto: UpdateShopDto) {
  //     return `This action updates a #${id} shop`;
  //   }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
