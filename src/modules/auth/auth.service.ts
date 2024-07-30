import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { InjectRepository } from '@nestjs/typeorm';
import { KeyEntity } from 'modules/auth/key.entity';
import { Repository } from 'typeorm';
import type { RoleType } from '../../constant';
import { TokenType } from '../../constant';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserService } from '../user/user.service';
import { RefreshTokenDTO, TokenPayloadDto } from './dto/token-payload.dto';
import { QueryBus } from '@nestjs/cqrs';
import { CheckKeyUsedQuery } from 'modules/auth/queries/check-token-used';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
    @InjectRepository(KeyEntity)
    private keyRepository: Repository<KeyEntity>,
    private readonly queryBus: QueryBus,
  ) {}

  async createKeyToken(data: {
    privateKey: string;
    publicKey: string;
    userId: Uuid;
    role: RoleType;
    refreshToken: string;
  }): Promise<string | null> {
    const { privateKey, publicKey, userId, role, refreshToken } = data;
    // const publicKeySting = publicKey.toString();
    // const token = await this.keyRepository.save({
    //   ownerId: userId,
    //   publicKey: publicKeySting,
    //   role: role,
    // });
    // return token ? publicKeySting : null;

    const existingKey = await this.keyRepository.findOne({
      where: { ownerId: userId },
    });
    if (existingKey) {
      await this.keyRepository.delete(existingKey.id);
    }

    const token = await this.keyRepository.save({
      ownerId: userId,
      privateKey,
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
      { expiresIn: '7d', privateKey: data.privateKey },
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

  async handleRefreshToken(
    req: RequestType,
    refetchToken: RefreshTokenDTO,
  ): Promise<TokenPayloadDto | undefined> {
    const { refetchToken: inputRefetchToken } = refetchToken;
    try {
      //   check if token used
      const { keyRecord } = req;
      const checkTokenUsed = new CheckKeyUsedQuery(
        inputRefetchToken,
        keyRecord,
      );
      const isTokenFound = await this.queryBus.execute(checkTokenUsed);
      if (isTokenFound) {
        await this.keyRepository.delete({ id: keyRecord.id as Uuid });
        throw new ForbiddenException(
          'Something wrong happen!! please re-login => xoa key',
        );
      }
      const holderToken = await this.keyRepository.findOneBy({
        refreshToken: inputRefetchToken,
      });
      if (!holderToken)
        throw new NotFoundException('Something wrong happen!! please re-login');

      const { userId } = await this.jwtService.verifyAsync(inputRefetchToken, {
        publicKey: holderToken.publicKey,
      });
      if (!userId) throw new NotFoundException('token refresh invalid!!');

      const newToken = await this.createTokenPair({
        privateKey: holderToken.privateKey,
        publicKey: holderToken.publicKey,
        role: holderToken.role,
        userId: holderToken.ownerId,
      });

      const updatedToken = await this.keyRepository.update(
        { id: holderToken.id },
        {
          refreshToken: newToken.refetchToken,
          refreshTokenUsed: [
            ...holderToken.refreshTokenUsed,
            inputRefetchToken,
          ],
        },
      );
      if (updatedToken.affected && updatedToken.affected > 0) {
        return newToken;
      }
    } catch (error: any) {
      throw new BadRequestException(error.message || 'refresh token failed!!');
    }
  }

  async logout(req: RequestType) {
    const { keyStore } = req;
    if (!keyStore) {
      throw new NotFoundException('Not found keyStore');
    }
    await this.keyRepository.delete({ id: keyStore as Uuid });
    return 'logged out';
  }

  async validateToken(
    token: string,
    clientId: Uuid,
  ): Promise<{
    keyVerified: any;
    foundKey: KeyEntity;
  }> {
    const foundKey = await this.keyRepository.findOne({
      where: { ownerId: clientId },
    });
    if (!foundKey) {
      throw new NotFoundException('Something wrong happen!! please re-login');
    }
    const { publicKey } = foundKey;
    const keyVerified = await this.jwtService.verifyAsync(token, {
      publicKey: publicKey,
    });
    return { keyVerified, foundKey };
  }
}
