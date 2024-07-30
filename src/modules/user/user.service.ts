import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import { FileNotImageException, UserNotFoundException } from '../../exceptions';
import { IFile } from '../../interfaces';
import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserRegisterDto } from '../auth/dto/user-register.dto';
import { type UserDto } from './dtos/user.dto';
import { type UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { generateHash } from 'common/utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private validatorService: ValidatorService,
    private awsS3Service: AwsS3Service,
    private commandBus: CommandBus,
  ) {}

  findOne(findData: FindOptionsWhere<UserEntity>): Promise<UserEntity | null> {
    return this.userRepository.findOneBy(findData);
  }

  async findByUsernameOrEmail(
    options: Partial<{ username: string; email: string }>,
  ): Promise<UserEntity | null> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (options.email) {
      queryBuilder.orWhere('user.email = :email', {
        email: options.email,
      });
    }

    if (options.username) {
      queryBuilder.orWhere('user.username = :username', {
        username: options.username,
      });
    }

    return queryBuilder.getOne();
  }

  @Transactional()
  async createUser(
    userRegisterDto: UserRegisterDto,
    file?: IFile,
  ): Promise<UserEntity> {
    const user = this.userRepository.create(userRegisterDto);

    if (file && !this.validatorService.isImage(file.mimetype)) {
      throw new FileNotImageException();
    }

    if (file) {
      user.avatar = await this.awsS3Service.uploadImage(file);
    }

    user.password = generateHash(user.password);
    await this.userRepository.save(user);
    return user;
  }

  async getUsers(pageOptionsDto: UsersPageOptionsDto): Promise<any> {
    // const queryBuilder = this.userRepository.createQueryBuilder('user');
    // const [items, pageMetaDto] = await queryBuilder.paginate(pageOptionsDto);
    // return items.toPageDto(pageMetaDto);
  }

  async getUser(userId: Uuid): Promise<UserDto> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.where('user.id = :userId', { userId });

    const userEntity = await queryBuilder.getOne();

    if (!userEntity) {
      throw new UserNotFoundException();
    }

    return userEntity.toDto();
  }
}
