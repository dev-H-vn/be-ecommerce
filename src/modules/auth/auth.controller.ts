import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constant';
import { Auth, AuthUser } from '../../decorators';
import { IFile } from '../../interfaces';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { ShopRegisterDto } from 'modules/auth/dto/register.dto';
import { ShopService } from 'modules/shop/shop.service';
import { ShopDto } from 'modules/shop/dto/shop.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private shopService: ShopService,
  ) {}

  @Post('register/shop')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ShopRegisterDto,
    description: 'Successfully Registered',
  })
  async shopRegister(
    @Body() shopRegisterDto: ShopRegisterDto,
  ): Promise<ShopDto> {
    return await this.shopService.register(shopRegisterDto);
  }

  //   @Post('login')
  //   @HttpCode(HttpStatus.OK)
  //   @ApiOkResponse({
  //     type: LoginPayloadDto,
  //     description: 'User info with access token',
  //   })
  //   async userLogin(
  //     @Body() userLoginDto: UserLoginDto,
  //   ): Promise<LoginPayloadDto> {
  //     const userEntity = await this.authService.validateUser(userLoginDto);

  //     const token = await this.authService.createAccessToken({
  //       userId: userEntity.id,
  //       role: userEntity.role,
  //     });
  //     console.log('userLoginDto', userEntity.toDto(), token);

  //     return new LoginPayloadDto(userEntity.toDto(), token);
  //   }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @UploadedFile() file?: IFile,
  ): Promise<UserDto> {
    return await this.userService.createUser(userRegisterDto, file);
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.USER, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): UserDto {
    return user.toDto();
  }
}
