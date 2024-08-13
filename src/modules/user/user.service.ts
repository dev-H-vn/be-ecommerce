import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { type FindOptionsWhere, Repository } from 'typeorm';

import { AwsS3Service } from '../../shared/services/aws-s3.service';
import { ValidatorService } from '../../shared/services/validator.service';
import { UserEntity } from './user.entity';
import { RegisterDto } from 'modules/auth/dto/register.dto';
import { v4 as uuidV4 } from 'uuid';
import { generateHash, generateKeyPair, validateHash } from 'common/utils';
import { AuthService } from 'modules/auth/auth.service';
import { LoginDto } from 'modules/auth/dto/login.dto';
@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
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

  async register(userRegister: RegisterDto): Promise<UserEntity> {
    const { email, password, userName, role } = userRegister;

    const holderUser = await this.userRepository.findOne({
      where: { email },
    });
    if (holderUser) {
      throw new BadRequestException('User Already registered!');
    }

    const passWordHash = generateHash(password);
    const newUser = await this.userRepository.create({
      id: uuidV4(),
      email,
      userName: userName,
      password: passWordHash,
      role: role,
    });
    if (newUser) {
      const { privateKey, publicKey } = generateKeyPair();

      //create token pair
      const tokens = await this.authService.createTokenPair({
        privateKey: privateKey,
        publicKey: publicKey,
        role: role,
        userId: newUser.id,
      });
      console.log('🐉 ~ ShopService ~ register ~ tokens ~  🚀\n', tokens);

      const publicKeyString = await this.authService.createKeyToken({
        publicKey,
        privateKey,
        userId: newUser.id,
        role: role,
        refreshToken: tokens.refetchToken,
      });
      if (!publicKeyString) {
        throw new BadRequestException('publicKeyString error');
      }
      await this.userRepository.save(newUser);
    }

    return newUser;
  }

  async login(loginDto: LoginDto) {
    const { email, password, userName, role } = loginDto;

    const foundUser = await this.userRepository.findOne({
      where: {
        ...(email && { email: email }),
        ...(userName && { userName: userName }),
      },
    });
    if (!foundUser) {
      throw new BadRequestException('User not registered!');
    }

    const passWordHash = validateHash(password, foundUser.password);
    if (!passWordHash) throw new BadRequestException('Authentication error!');

    const { privateKey, publicKey } = generateKeyPair();
    //create token pair
    const tokens = await this.authService.createTokenPair({
      privateKey: privateKey.toString(),
      publicKey: publicKey,
      role: role,
      userId: foundUser.id,
    });
    const publicKeyString = await this.authService.createKeyToken({
      privateKey,
      publicKey,
      userId: foundUser.id,
      role: role,
      refreshToken: tokens.refetchToken,
    });
    if (!publicKeyString) {
      throw new BadRequestException('publicKeyString error');
    }

    return { shop: foundUser, tokens };
  }
}
