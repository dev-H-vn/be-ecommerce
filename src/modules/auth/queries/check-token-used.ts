import { NotFoundException } from '@nestjs/common';
import type { ICommand, IQueryHandler } from '@nestjs/cqrs';
import { QueryHandler } from '@nestjs/cqrs';
import { KeyEntity } from 'modules/auth/key.entity';

export class CheckKeyUsedQuery implements ICommand {
  constructor(
    public readonly refreshToken: string,
    public readonly keyRecord: KeyEntity,
  ) {}
}

@QueryHandler(CheckKeyUsedQuery)
export class CheckTokenHandler implements IQueryHandler<CheckKeyUsedQuery> {
  constructor() {} // private keyEntity: Repository<KeyEntity>, // @InjectRepository(KeyEntity)

  async execute(refreshTokenQuery: CheckKeyUsedQuery) {
    const { refreshToken, keyRecord } = refreshTokenQuery;

    if (!keyRecord)
      throw new NotFoundException('Something wrong happen!! please re-login');

    return keyRecord.refreshTokenUsed.includes(refreshToken) || false;
  }
}
