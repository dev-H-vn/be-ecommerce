import { NotFoundException } from '@nestjs/common';
import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { KeyEntity } from 'modules/auth/key.entity';
import { Repository } from 'typeorm';

export class CheckKeyUsedQuery implements ICommand {
  constructor(
    public readonly refreshToken: string,
    public readonly keyStore: string,
  ) {}
}

@QueryHandler(CheckKeyUsedQuery)
export class CheckTokenHandler implements IQueryHandler<CheckKeyUsedQuery> {
  constructor(
    @InjectRepository(KeyEntity)
    private keyEntity: Repository<KeyEntity>,
  ) {}

  async execute(refreshTokenQuery: CheckKeyUsedQuery) {
    const { refreshToken, keyStore } = refreshTokenQuery;
    const foundKey = await this.keyEntity.findOneBy({ id: keyStore as Uuid });
    if (!foundKey)
      throw new NotFoundException('Something wrong happen!! please re-login');

    console.log(
      '🐉 ~ CheckTokenHandler ~ execute ~ foundKey ~ 🚀\n',
      keyStore,
      foundKey.refreshTokenUsed.includes(refreshToken),
    );
    return foundKey.refreshTokenUsed.includes(refreshToken) || false;
  }
}
