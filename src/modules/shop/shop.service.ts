import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ShopRegisterDto } from 'modules/auth/dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopEntity } from 'modules/shop/shop.entity';
import { Repository } from 'typeorm';
import { generateHash } from 'common/utils';
import { AuthService } from 'modules/auth/auth.service';
import crypto from 'crypto-js'
import { generateKeyPairSync } from 'crypto';

@Injectable()
export class ShopService {
      constructor(
            private authService: AuthService,

    @InjectRepository(ShopEntity)
    private shopRepository: Repository<ShopEntity>
  ) {}
  async register(createShopDto: ShopRegisterDto) {

    const holderShop = await this.shopRepository.findOne({
      where: { email:  },
    });

    const passWordHash  = generateHash(password);


    const newShop = await this.shopRepository.create({email ,shopName , password : passWordHash})

    if(newShop) {
        const {privateKey , publicKey} = generateKeyPairSync('rsa' , {modulusLength :4096})

        const publicKeyString = await this.authService.createKeyToken({publicKey , userId})

        if(!publicKeyString) {
             throw new BadRequestException('publicKeyString error')
        }
    }

    return 'This action adds a new shop';
  }

  findAll() {
    return `This action returns all shop`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

  update(id: number, updateShopDto: UpdateShopDto) {
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
