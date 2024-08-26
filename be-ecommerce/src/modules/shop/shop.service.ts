import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateHash, generateKeyPair, validateHash } from 'common/utils';
import { RoleType } from 'constant';
import { AuthService } from 'modules/auth/auth.service';
import { LoginDto } from 'modules/auth/dto/login.dto';
import { RegisterDto } from 'modules/auth/dto/register.dto';
import { ShopEntity } from 'modules/shop/shop.entity';
import { Repository } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ShopService {
  constructor(
    private authService: AuthService,
    @InjectRepository(ShopEntity)
    private shopRepository: Repository<ShopEntity>,
  ) {}

  async register(createShopDto: RegisterDto) {
    const { email, password, userName } = createShopDto;

    const holderShop = await this.shopRepository.findOne({
      where: { email },
    });

    if (holderShop) {
      throw new BadRequestException('Shop Already registered!');
    }

    const passWordHash = generateHash(password);
    const newShop = await this.shopRepository.create({
      id: uuidV4(),
      email,
      shopName: userName,
      password: passWordHash,
    });

    if (newShop) {
      const { privateKey, publicKey } = generateKeyPair();

      //create token pair
      const tokens = await this.authService.createTokenPair({
        privateKey,
        publicKey,
        role: RoleType.SHOP,
        userId: newShop.id,
      });
      console.log('🐉 ~ ShopService ~ register ~ tokens ~  🚀\n', tokens);

      const publicKeyString = await this.authService.createKeyToken({
        publicKey,
        privateKey,
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

  async login(loginShopDto: LoginDto) {
    const { email, password } = loginShopDto;

    const foundShop = await this.shopRepository.findOne({
      where: { email },
    });

    if (!foundShop) {
      throw new BadRequestException('Shop not registered!');
    }

    const passWordHash = validateHash(password, foundShop.password);

    if (!passWordHash) {
      throw new BadRequestException('Authentication error!');
    }

    const { privateKey, publicKey } = generateKeyPair();
    //create token pair
    const tokens = await this.authService.createTokenPair({
      privateKey: privateKey.toString(),
      publicKey,
      role: RoleType.SHOP,
      userId: foundShop.id,
    });
    const publicKeyString = await this.authService.createKeyToken({
      privateKey,
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

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
