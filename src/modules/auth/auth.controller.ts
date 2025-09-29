import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  // UploadedFile,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants/role-type.ts';
import { AuthUser } from '../../decorators/auth-user.decorator.ts';
import { Auth } from '../../decorators/http.decorators.ts';
// import { ApiFile } from '../../decorators/swagger.schema.ts';
// import type { IFile } from '../../interfaces/IFile.ts';
// import type { Reference } from '../../types.ts';
import { UserDto } from '../user/dtos/user.dto.ts';
import { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
import { AuthService } from './auth.service.ts';
import { LoginPayloadDto } from './dto/login-payload.dto.ts';
import { UserLoginDto } from './dto/user-login.dto.ts';
import { UserRegisterDto } from './dto/user-register.dto.ts';
import { RefreshTokenDto } from './dto/refresh-token.dto.ts';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    const userEntity = await this.authService.validateUser(userLoginDto);

    const token = await this.authService.createAccessToken({
      userId: userEntity.id,
      role: userEntity.role,
    });

    const refreshToken = await this.authService.createRefreshToken({
      userId: userEntity.id,
      role: userEntity.role,
    });
    return new LoginPayloadDto(userEntity.toDto(), token, refreshToken);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto, description: 'Successfully Registered' })
  // @ApiFile({ name: 'avatar' })
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    // @UploadedFile() file?: Reference<IFile>,
  ): Promise<UserDto> {
    const createdUser = await this.userService.createUser(
      userRegisterDto,
      // file,
    );

    return createdUser.toDto({
      isActive: true,
    });
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginPayloadDto, description: 'Successfully refresh token' })
  async refreshToken(
    @Body() refreshTokenData: RefreshTokenDto,
  ): Promise<LoginPayloadDto> {
    const { refreshToken } = refreshTokenData;
    const payload = await this.authService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid refresh token');
    }

    const user = await this.userService.findOne({id: payload.userId});
    if (!user) {
      throw new Error('User not found');
    }
    const token = await this.authService.createAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refresh = await this.authService.createRefreshToken({
      userId: user.id,
      role: user.role,
    });

    return new LoginPayloadDto(user.toDto(), token, refresh);
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.ADMIN, RoleType.USER])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  async getCurrentUser(@AuthUser() user: UserEntity): Promise<UserDto> {
    return await this.authService.getMe(user.id).then(u => u.toDto());
  }
}
