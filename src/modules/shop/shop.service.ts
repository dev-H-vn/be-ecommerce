import { BadRequestException, Injectable } from '@nestjs/common';
import { ShopRegisterDto } from 'modules/auth/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopEntity } from 'modules/shop/shop.entity';
import { Repository } from 'typeorm';
import { generateHash, generateKeyPair, validateHash } from 'common/utils';
import { AuthService } from 'modules/auth/auth.service';
import { RoleType } from 'constant';
import { v4 as uuidV4 } from 'uuid';
import { ShopLoginDto } from 'modules/auth/dto/login.dto';

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
      const { privateKey, publicKey } = generateKeyPair();

      //create token pair
      const tokens = await this.authService.createTokenPair({
        privateKey: privateKey,
        publicKey: publicKey,
        role: RoleType.SHOP,
        userId: newShop.id,
      });
      console.log('🐉 ~ ShopService ~ register ~ tokens ~  🚀\n', tokens);

      const publicKeyString = await this.authService.createKeyToken({
        publicKey,
        userId: newShop.id,
        role: RoleType.SHOP,
        refreshToken: tokens.refetchToken,
      });
      if (!publicKeyString) {
        throw new BadRequestException('publicKeyString error');
      }
      await this.shopRepository.save(newShop);
    }

    return newShop;
  }

  async login(loginShopDto: ShopLoginDto) {
    const { email, password } = loginShopDto;

    const foundShop = await this.shopRepository.findOne({
      where: { email: email },
    });
    if (!foundShop) {
      throw new BadRequestException('Shop not registered!');
    }

    const passWordHash = validateHash(password, foundShop.password);
    if (!passWordHash) throw new BadRequestException('Authentication error!');

    const { privateKey, publicKey } = generateKeyPair();
    //create token pair
    const tokens = await this.authService.createTokenPair({
      privateKey: privateKey.toString(),
      publicKey: publicKey,
      role: RoleType.SHOP,
      userId: foundShop.id,
    });
    const publicKeyString = await this.authService.createKeyToken({
      publicKey,
      userId: foundShop.id,
      role: RoleType.SHOP,
      refreshToken: tokens.refetchToken,
    });
    if (!publicKeyString) {
      throw new BadRequestException('publicKeyString error');
    }

    return { shop: foundShop, tokens };
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
