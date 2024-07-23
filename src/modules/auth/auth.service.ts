import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { RoleType } from '../../constant';
import { TokenType } from '../../constant';
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
    refreshToken: string;
  }): Promise<string | null> {
    const { publicKey, userId, role, refreshToken } = data;
    // const publicKeySting = publicKey.toString();
    // const token = await this.keyRepository.save({
    //   ownerId: userId,
    //   publicKey: publicKeySting,
    //   role: role,
    // });
    // return token ? publicKeySting : null;

    const token = await this.keyRepository.save({
      ownerId: userId,
      publicKey,
      role: role,
      refreshToken,
      refreshTokenUsed: [],
    });
    return token ? token.publicKey : null;
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

    // const verifyKey = await this.jwtService.verifyAsync(accessToken.trim(), {
    //   publicKey: data.publicKey,
    // });
    // console.log(
    //   '🐉 ~ AuthService ~ verifyKey ~ 🚀\n',
    //   { verifyKey },
    //   data.publicKey,
    //   accessToken,
    // );
    return new TokenPayloadDto({
      accessToken,
      expiresIn,
      refetchToken,
    });
  }

  async logout(req: Request & { keyStore: string }) {
    const { keyStore } = req;
    if (!keyStore) {
      throw new NotFoundException('Not found keyStore');
    }
    await this.keyRepository.delete({ id: keyStore as Uuid });
    return 'logged out';
  }

  async validateToken(
    accessToken: string,
    clientId: Uuid,
  ): Promise<{
    keyVerified: any;
    foundKey: KeyEntity;
  }> {
    const foundKey = await this.keyRepository.findOne({
      where: { ownerId: clientId },
    });
    if (!foundKey) {
      throw new NotFoundException('Not found keyStore');
    }
    const { publicKey } = foundKey;
    const keyVerified = await this.jwtService.verifyAsync(accessToken, {
      publicKey: publicKey,
    });
    return { keyVerified, foundKey };
  }
}
