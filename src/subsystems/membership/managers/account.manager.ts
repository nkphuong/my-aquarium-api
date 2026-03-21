import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import type { IAccountManager } from '../contracts/account.manager.interface';
import type { IMemberAccess } from '../contracts/member.access.interface';
import type { IUserTokenAccess } from '../contracts/user-token.access.interface';
import type { ISecurityUtility } from '@utilities/security/security.utility.interface';
import type { IEventUtility } from '@utilities/event/event.utility.interface';
import { RegisterRequestDTO } from '../dtos/register.request.dto';
import { AuthResponseDTO } from '../dtos/auth.response.dto';
import { RegisterResponseDTO } from '../dtos/register.response.dto';
import { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';
import { User } from '../entities/user.entity';
// import { UserRegisteredEvent } from '@subsystems/notification/events/user-registered.event';

@Injectable()
export class AccountManager implements IAccountManager {
  constructor(
    @Inject('IMemberAccess') private memberAccess: IMemberAccess,
    @Inject('IUserTokenAccess') private userTokenAccess: IUserTokenAccess,
    @Inject('ISecurityUtility') private securityUtil: ISecurityUtility,
    @Inject('IEventUtility') private eventUtility: IEventUtility,
  ) {}

  public async register(
    data: RegisterRequestDTO,
  ): Promise<AuthResponseDTO | RegisterResponseDTO> {
    const existingUser = await this.memberAccess.getMemberByCredentials(
      data.email,
    );
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

    const savedUser = await this.memberAccess.addMember(user);

    // const event = new UserRegisteredEvent();
    // event.userId = savedUser.id;
    // event.email = savedUser.email;
    // event.fullname = savedUser.fullname;
    // this.eventUtility.emit('user.registered', event);

    if (savedUser.needsEmailVerification) {
      const response = new RegisterResponseDTO();
      response.message = 'Please check your email to verify your account.';
      response.email = savedUser.email;
      response.requiresVerification = true;
      return response;
    }

    const accessToken = this.securityUtil.generateToken(savedUser.id);
    const refreshToken = this.securityUtil.generateRefreshToken();
    const refreshTokenHash = this.securityUtil.hashToken(refreshToken);
    const expiresAt = this.securityUtil.getRefreshTokenExpirationDate();

    await this.userTokenAccess.addToken(
      savedUser.id,
      'user',
      refreshTokenHash,
      expiresAt,
    );

    const response = new AuthResponseDTO();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;
    response.expireAt = expiresAt;
    response.member = savedUser;
    return response;
  }

  public async getCurrentUser(userId: number): Promise<UserProfileResponseDTO> {
    const member = await this.memberAccess.getMemberById(userId);

    if (!member) {
      throw new NotFoundException('User not found.');
    }

    return member;
  }
}
