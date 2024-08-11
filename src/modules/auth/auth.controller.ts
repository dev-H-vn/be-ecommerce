import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constant';
import { Auth, AuthUser } from '../../decorators';
import { IFile } from '../../interfaces';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register.dto';
import { ShopService } from 'modules/shop/shop.service';
import { LoginDto } from 'modules/auth/dto/login.dto';
import {
  RefreshTokenDTO,
  TokenPayloadDto,
} from 'modules/auth/dto/token-payload.dto';
import { AuthGuard } from 'guards/auth.guard';
import { KeyEntity } from 'modules/auth/key.entity';
import { RegisterDto } from 'modules/auth/dto/register.dto';
import { ShopEntity } from 'modules/shop/shop.entity';

@ApiBearerAuth()
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private shopService: ShopService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: RegisterDto,
    description: 'Successfully Registered',
  })
  async shopRegister(
    @Body() registerDto: RegisterDto,
  ): Promise<ShopEntity | UserEntity> {
    const { role } = registerDto;
    if (role === 'SHOP') {
      return await this.shopService.register(registerDto);
    } else {
      return await this.userService.register(registerDto);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginDto,
    description: 'User info with access token',
  })
  async userLogin(@Body() loginDto: LoginDto): Promise<{
    shop: ShopEntity | UserEntity;
    tokens: TokenPayloadDto;
  }> {
    const { role } = loginDto;
    if (role === 'SHOP') {
      return await this.shopService.login(loginDto);
    } else {
      return await this.userService.login(loginDto);
    }
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async refreshToken(
    @Req() request: RequestType,
    @Body() refreshToken: RefreshTokenDTO,
  ): Promise<TokenPayloadDto | undefined> {
    return await this.authService.handleRefreshToken(request, refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: LoginDto,
    description: 'User info with access token',
  })
  async logout(@Req() request: RequestType): Promise<any> {
    return await this.authService.logout(request);
  }
}
