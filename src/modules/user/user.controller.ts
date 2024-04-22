import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import {
  ApiPageOkResponse,
  Auth,
  AuthUser,
  ParseCustomControllerPipe,
  ParseTypeParamsPipe,
  UUIDParam,
} from '../../decorators';
import { UseLanguageInterceptor } from '../../interceptors/language-interceptor.service';
import { UserDto } from './dtos/user.dto';
import { UsersPageOptionsDto } from './dtos/users-page-options.dto';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { AdminGuard, AuthGuard } from 'guards/auth.guard';
import { TimeOutInterceptor } from 'interceptors/timeout.interceptor';
import { ExcludeNullInterceptor } from 'interceptors/exclude-null.interceptor';

@Controller('users')
@ApiTags('users')
@UseGuards(AuthGuard)
@UsePipes(ParseCustomControllerPipe)
@UseInterceptors(TimeOutInterceptor)
export class UserController {
  private logger: Logger;
  constructor(private userService: UserService) {
    this.logger = new Logger(UserController.name);
  }

  @Get('test-lifeCycle:id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @UseLanguageInterceptor()
  async admin(
    @Param('id', new ParseTypeParamsPipe('uuid')) id: Uuid,
    @AuthUser() user: UserEntity,
  ) {
    this.logger.log(`Method name: ${this.admin.name}`);
    return 'hello';
  }

  @Get()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ExcludeNullInterceptor)
  @ApiPageOkResponse({
    description: 'Get users list',
    type: PageDto,
  })
  getUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): object {
    return { a: null, b: 123, c: 'hihihaha' };
  }

  @Get(':id')
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get users list',
    type: UserDto,
  })
  getUser(@UUIDParam('id') userId: Uuid): Promise<UserDto> {
    // return this.userService.getUser(userId);
    throw new BadRequestException('Invalid App Version');
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN])
  @HttpCode(HttpStatus.OK)
  @UseGuards(AdminGuard)
  deleteUser(@Param('id') userId: number): string {
    return 'Delete user successfully.';
  }
}
