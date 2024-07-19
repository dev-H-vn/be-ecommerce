import { Injectable } from '@nestjs/common';
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
    role: RoleType;
  }): Promise<string | null> {
    const { publicKey, userId, role } = data;
    const publicKeySting = publicKey.toString();
    const token = await this.keyRepository.save({
      ownerId: userId,
      publicKey: publicKeySting,
      role: role,
    });

    return token ? publicKeySting : null;
  }

  async createTokenPair(data: {
    publicKey: string;
    privateKey: string;
    role: RoleType;
    userId: Uuid;
  }): Promise<TokenPayloadDto> {
    const expiresIn = this.configService.authConfig.jwtExpirationTime;
    const accessToken = await this.jwtService.signAsync(
      {
        userId: data.userId,
        type: TokenType.ACCESS_TOKEN,
        role: data.role,
      },
      { expiresIn: '2d', privateKey: data.privateKey },
    );
    const refetchToken = await this.jwtService.signAsync(
      {
        userId: data.userId,
        type: TokenType.REFRESH_TOKEN,
        role: data.role,
      },
      { expiresIn: '2d', privateKey: data.privateKey },
    );
    await this.jwtService.verifyAsync(accessToken, {
      publicKey: data.publicKey,
    });
    return new TokenPayloadDto({
      accessToken,
      expiresIn,
      refetchToken,
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
