import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleType } from 'constant';
import { AuthGuard } from 'guards/auth.guard';
import { LoginDto } from 'modules/auth/dto/login.dto';
import { RegisterDto } from 'modules/auth/dto/register.dto';
import {
  RefreshTokenDTO,
  TokenPayloadDto,
} from 'modules/auth/dto/token-payload.dto';
import { ShopEntity } from 'modules/shop/shop.entity';
import { ShopService } from 'modules/shop/shop.service';

import { UserEntity } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

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

    if (role === RoleType.SHOP) {
      return this.shopService.register(registerDto);
    }

    return this.userService.register(registerDto);
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

    if (role === RoleType.SHOP) {
      return this.shopService.login(loginDto);
    }

    return this.userService.login(loginDto);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async refreshToken(
    @Req() request: RequestType,
    @Body() refreshToken: RefreshTokenDTO,
  ): Promise<TokenPayloadDto | undefined> {
    return this.authService.handleRefreshToken(request, refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    type: LoginDto,
    description: 'User info with access token',
  })
  async logout(@Req() request: RequestType): Promise<any> {
    return this.authService.logout(request);
  }
}
