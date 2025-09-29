import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { type JwtPayload } from 'jsonwebtoken';
import { validateHash } from '../../common/utils.ts';
import type { RoleType } from '../../constants/role-type.ts';
import { TokenType } from '../../constants/token-type.ts';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception.ts';
import { ApiConfigService } from '../../shared/services/api-config.service.ts';
import type { UserEntity } from '../user/user.entity.ts';
import { UserService } from '../user/user.service.ts';
import { TokenPayloadDto } from './dto/token-payload.dto.ts';
import type { UserLoginDto } from './dto/user-login.dto.ts';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ApiConfigService,
    private userService: UserService,
  ) {}
  async getMe(userId: number): Promise<UserEntity> {
    if(!userId) {
      throw new UserNotFoundException();
    }
    const user = await this.userService.findOne({ id: userId });
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload | null> {
    try {
      const payload = this.jwtService.verify(token, {
        publicKey: this.configService.authConfig.publicKey,
        algorithms: ['RS256'],
      });

      if (payload.type !== TokenType.REFRESH_TOKEN) {
        return null;
      }

      return payload;
    } catch (err) {
      return null;
    }
  }

  async createAccessToken(data: {
    role: RoleType;
    userId: number;
  }): Promise<TokenPayloadDto> {
    const payload = {
      userId: data.userId,
      type: TokenType.ACCESS_TOKEN,
      role: data.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      privateKey: this.configService.authConfig.privateKey,
      algorithm: 'RS256',
    });

    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      token,
    });
  }

  async createRefreshToken(data: {
    role: RoleType;
    userId: number;
  }): Promise<TokenPayloadDto> {
    const payload = {
      userId: data.userId,
      type: TokenType.REFRESH_TOKEN,
      role: data.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.authConfig.jwtRefreshExpirationTime,
      privateKey: this.configService.authConfig.privateKey,
      algorithm: 'RS256',
    });

    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtRefreshExpirationTime,
      token,
    });
  }

  async validateUser(userLoginDto: UserLoginDto): Promise<UserEntity> {
    const user = await this.userService.findOne({
      email: userLoginDto.email,
    });

    const isPasswordValid = await validateHash(
      userLoginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UserNotFoundException();
    }

    return user!;
  }
}
