import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type { IAccountManager } from '../contracts/account.manager.interface';
import type { IUserAccess } from '../contracts/user.access.interface';
import type { IUserTokenAccess } from '../contracts/user-token.access.interface';
import type { ISecurityUtility } from '@utilities/security/security.utility.interface';
import type { IAuthConfigUtility } from '@utilities/auth-config/auth-config.utility.interface';
import type { IEventUtility } from '@utilities/event/event.utility.interface';
import { RegisterRequestDTO } from '../dtos/register.request.dto';
import { AuthResponseDTO } from '../dtos/auth.response.dto';
import { RegisterResponseDTO } from '../dtos/register.response.dto';
import { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class AccountManager implements IAccountManager {
  constructor(
    @Inject('IUserAccess') private userAccess: IUserAccess,
    @Inject('IUserTokenAccess') private userTokenAccess: IUserTokenAccess,
    @Inject('ISecurityUtility') private securityUtil: ISecurityUtility,
    @Inject('IAuthConfigUtility') private authConfigUtil: IAuthConfigUtility,
    @Inject('IEventUtility') private eventUtility: IEventUtility,
  ) { }

  public async register(
    data: RegisterRequestDTO,
  ): Promise<AuthResponseDTO | RegisterResponseDTO> {
    const existingUser = await this.userAccess.getByCredentials(data.email);
    if (existingUser) {
      throw new ConflictException('Account already exists.');
    }

    const hashedPassword = await this.securityUtil.hashPassword(data.password);

    const user = new User();
    user.fill({
      email: data.email,
      password: hashedPassword,
      fullname: data.fullName,
    });

    const savedUser = await this.userAccess.addMember(user);

    this.eventUtility.emit('user.registered', {
      id: savedUser.id,
      email: savedUser.email,
      fullname: savedUser.fullname,
      needsEmailVerification: savedUser.needsEmailVerification,
    });

    if (savedUser.needsEmailVerification) {
      const response = new RegisterResponseDTO();
      response.message = 'Please check your email to verify your account.';
      response.email = savedUser.email;
      response.requiresVerification = true;
      return response;
    }

    const secret = this.authConfigUtil.getSecret('user');
    const expiresIn = this.authConfigUtil.getAccessTokenExpiration('user');
    const accessToken = this.securityUtil.signJwt(
      { sub: savedUser.id },
      secret,
      expiresIn,
    );
    const refreshToken = this.securityUtil.generateRefreshToken();
    const refreshTokenHash = this.securityUtil.hashToken(refreshToken);
    const expiresAt = this.authConfigUtil.getRefreshTokenExpirationDate('user');

    await this.userTokenAccess.addToken(
      user,
      'user',
      refreshTokenHash,
      expiresAt,
    );

    const response = new AuthResponseDTO();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    response.expireAt = expiresAt;
    response.member = {
      id: savedUser.id,
      email: savedUser.email,
      fullname: savedUser.fullname,
    };
    return response;
  }

  public async getCurrentUser(userId: number): Promise<UserProfileResponseDTO> {
    const member = await this.userAccess.getById(userId);

    if (!member) {
      throw new NotFoundException('User not found.');
    }

    return member;
  }
}
