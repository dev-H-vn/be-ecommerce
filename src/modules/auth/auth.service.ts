import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { validateHash } from '../../common/utils';
import type { RoleType } from '../../constant';
import { TokenType } from '../../constant';
import { UserNotFoundException } from '../../exceptions';
import { ApiConfigService } from '../../shared/services/api-config.service';
import type { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import type { UserLoginDto } from './dto/user-login.dto';
import { Repository } from 'typeorm';
import { KeyEntity } from 'modules/auth/key.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
    @InjectRepository(KeyEntity)
    private keyRepository: Repository<KeyEntity>,
  ) {}

  async createKeyToken(data: {
    publicKey: string;
    userId: Uuid;
  }): Promise<string | null> {
    const { publicKey, userId } = data;
    const publicKeySting = publicKey.toString();
    const token = await this.keyRepository.create({
      ownerKey: userId,
      publicKey: publicKeySting,
    });

    return token ? publicKey : null;
  }

  async createAccessToken(data: {
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      }),
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      userName: userLoginDto.userName,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user!;
  }
}
