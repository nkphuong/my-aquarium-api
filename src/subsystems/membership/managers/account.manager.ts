import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import type { IAccountManager } from '../contracts/account.manager.interface';
import type { IUserAccess } from '../contracts/user.access.interface';
import type { IUserTokenAccess } from '../contracts/user-token.access.interface';
import type { IAuthAccess } from '../contracts/auth.access.interface';
import type { ISecurityUtility } from '@utilities/security/security.utility.interface';
import type { IAuthConfigUtility } from '@utilities/auth-config/auth-config.utility.interface';
import type { IEventUtility } from '@utilities/event/event.utility.interface';
import { RegisterRequestDTO } from '../dtos/register.request.dto';
import { AuthResponseDTO } from '../dtos/auth.response.dto';
import { RegisterResponseDTO } from '../dtos/register.response.dto';
import { UserProfileResponseDTO } from '../dtos/user-profile.response.dto';
import { AdminUserProfileResponseDTO } from '../dtos/admin-user-profile.response.dto';
import { AdminCreateUserRequestDTO } from '../dtos/admin-create-user.request.dto';
import { AdminUpdateUserRequestDTO } from '../dtos/admin-update-user.request.dto';
import { ListUsersQueryDTO } from '../dtos/list-users-query.dto';
import { PaginatedResult, type PaginationMeta } from '@core/types/pagination';
import { User } from '../entities/user.entity';

@Injectable()
export class AccountManager implements IAccountManager {
  constructor(
    @Inject('IUserAccess') private userAccess: IUserAccess,
    @Inject('IUserTokenAccess') private userTokenAccess: IUserTokenAccess,
    @Inject('AUTH_ACCESSORS')
    private authAccessors: Map<string, IAuthAccess>,
    @Inject('ISecurityUtility') private securityUtil: ISecurityUtility,
    @Inject('IAuthConfigUtility') private authConfigUtil: IAuthConfigUtility,
    @Inject('IEventUtility') private eventUtility: IEventUtility,
  ) {}

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

    const needsVerification = savedUser.needsEmailVerification;

    let verificationToken: string | undefined;

    if (needsVerification) {
      const expireInHours =
        this.authConfigUtil.getAccountVerificationExpireInHours();
      const { token, tokenHash, expiresAt } =
        this.securityUtil.generateTimedToken(expireInHours);
      verificationToken = token;
      await this.userTokenAccess.addToken(
        user,
        'user',
        tokenHash,
        expiresAt,
        'email_verification',
      );
    }

    this.eventUtility.emit('user.registered', {
      userId: savedUser.id,
      email: savedUser.email,
      fullname: savedUser.fullname,
      needsEmailVerification: needsVerification,
      ...(verificationToken !== undefined && { verificationToken }),
    });

    if (needsVerification) {
      const response = new RegisterResponseDTO();
      response.message = 'Please check your email to verify your account.';
      response.email = savedUser.email;
      response.requiresVerification = true;
      return response;
    }

    const guardType = this.authConfigUtil.getGuardType();
    const tokens = this.securityUtil.generateAuthTokenPair(guardType, {
      sub: savedUser.id,
      email: savedUser.email,
    });

    await this.userTokenAccess.addToken(
      user,
      'user',
      tokens.refreshTokenHash,
      tokens.refreshTokenExpiresAt,
    );

    const response = new AuthResponseDTO();
    response.accessToken = tokens.accessToken;
    response.refreshToken = tokens.refreshToken;
    response.expireAt = tokens.accessTokenExpiresAt;
    response.member = {
      id: savedUser.id,
      email: savedUser.email,
      fullname: savedUser.fullname,
    };
    return response;
  }

  public async getCurrentUser(
    userId: number,
    type: string = 'user',
  ): Promise<UserProfileResponseDTO> {
    const guardType = this.authConfigUtil.getGuardType(type);
    const accessor = this.authAccessors.get(guardType);
    if (!accessor) {
      throw new NotFoundException('Invalid account type.');
    }

    const member = await accessor.getById(userId);
    if (!member) {
      throw new NotFoundException('User not found.');
    }

    return member;
  }

  // --- Email verification ---

  public async verifyEmail(token: string): Promise<{ message: string }> {
    const tokenHash = this.securityUtil.hashToken(token);
    const storedToken =
      await this.userTokenAccess.findByHashWithOwner(tokenHash);

    if (!storedToken || storedToken.type !== 'email_verification') {
      throw new BadRequestException('Invalid verification link.');
    }
    if (storedToken.expiresAt < new Date()) {
      throw new BadRequestException('Verification link has expired.');
    }

    await this.userAccess.verifyEmail(storedToken.tokenableId);
    await this.userTokenAccess.revokeToken(storedToken.id);

    return { message: 'Email verified successfully.' };
  }

  public async resendVerificationEmail(
    email: string,
    previousToken: string,
  ): Promise<{ message: string }> {
    const genericMessage =
      'If your email is registered and unverified, a new link has been sent.';

    const tokenHash = this.securityUtil.hashToken(previousToken);
    const existingToken = await this.userTokenAccess.findByHashAndEmail(
      tokenHash,
      email,
    );

    if (!existingToken) {
      throw new BadRequestException('Invalid verification link.');
    }

    if (existingToken.expiresAt > new Date()) {
      throw new BadRequestException(
        'Your current verification link is still valid.',
      );
    }

    const expireInHours =
      this.authConfigUtil.getAccountVerificationExpireInHours();
    const {
      token: verificationToken,
      tokenHash: newTokenHash,
      expiresAt,
    } = this.securityUtil.generateTimedToken(expireInHours);

    await this.userTokenAccess.revokeToken(existingToken.id);
    const user = await this.userAccess.getByEmail(email);
    if (!user) {
      return { message: genericMessage };
    }

    await this.userTokenAccess.addToken(
      user,
      'user',
      newTokenHash,
      expiresAt,
      'email_verification',
    );

    this.eventUtility.emit('user.registered', {
      userId: existingToken.owner.id,
      email: existingToken.owner.email,
      fullname: existingToken.owner.fullname,
      needsEmailVerification: true,
      verificationToken,
    });

    return { message: genericMessage };
  }

  // --- Password reset ---

  public async forgotPassword(email: string): Promise<{ message: string }> {
    const genericMessage = 'Send reset password link successfully.';

    const result = await this.userAccess.getByCredentials(email);

    if (!result) {
      throw new NotFoundException('User not found.');
    }

    await this.userTokenAccess.revokeByUserIdAndType(
      result.credentials.id,
      'password_reset',
    );

    const expireInHours = this.authConfigUtil.getPasswordResetExpireInHours();
    const {
      token: resetToken,
      tokenHash,
      expiresAt,
    } = this.securityUtil.generateTimedToken(expireInHours);

    await this.userTokenAccess.addToken(
      result.entity,
      'user',
      tokenHash,
      expiresAt,
      'password_reset',
    );

    this.eventUtility.emit('password.reset.requested', {
      userId: result.credentials.id,
      email: result.credentials.email,
      fullname: result.credentials.fullname,
      resetToken,
      expiresAt,
    });

    return { message: genericMessage };
  }

  public async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const tokenHash = this.securityUtil.hashToken(token);
    const storedToken =
      await this.userTokenAccess.findByHashWithOwner(tokenHash);

    if (
      !storedToken ||
      storedToken.type !== 'password_reset' ||
      storedToken.expiresAt < new Date()
    ) {
      throw new BadRequestException('Invalid or expired reset link.');
    }

    const hashedPassword = await this.securityUtil.hashPassword(newPassword);
    await this.userAccess.updatePassword(
      storedToken.tokenableId,
      hashedPassword,
    );
    await this.userTokenAccess.revokeToken(storedToken.id);

    return { message: 'Password reset successfully.' };
  }

  // --- Admin user management ---

  public async listUsers(
    query: ListUsersQueryDTO,
  ): Promise<PaginatedResult<AdminUserProfileResponseDTO>> {
    const { items, total } = await this.userAccess.listUsers({
      page: query.page,
      limit: query.limit,
      search: query.search,
      isVerified: query.isVerified,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    });

    const lastPage = Math.ceil(total / query.limit) || 1;
    const meta: PaginationMeta = {
      total,
      lastPage,
      currentPage: query.page,
      perPage: query.limit,
      prev: query.page > 1 ? query.page - 1 : null,
      next: query.page < lastPage ? query.page + 1 : null,
    };

    return PaginatedResult.create(
      items.map((user) => this.toAdminUserProfile(user)),
      meta,
    );
  }

  public async getUser(id: number): Promise<AdminUserProfileResponseDTO> {
    const user = await this.userAccess.findEntityById(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.toAdminUserProfile(user);
  }

  public async createUser(
    data: AdminCreateUserRequestDTO,
  ): Promise<AdminUserProfileResponseDTO> {
    const existingUser = await this.userAccess.getByCredentials(data.email);
    if (existingUser) {
      throw new ConflictException('A user with this email already exists.');
    }

    const hashedPassword = await this.securityUtil.hashPassword(data.password);

    const user = new User();
    user.fill({
      email: data.email,
      password: hashedPassword,
      fullname: data.fullname,
      ...(data.status !== undefined && { status: data.status }),
    });

    await this.userAccess.addMember(user);
    return this.toAdminUserProfile(user);
  }

  public async updateUser(
    id: number,
    data: AdminUpdateUserRequestDTO,
  ): Promise<AdminUserProfileResponseDTO> {
    const updateData: Partial<User> = {};

    if (data.email !== undefined) {
      const existing = await this.userAccess.getByCredentials(data.email);
      if (existing && existing.credentials.id !== id) {
        throw new ConflictException('A user with this email already exists.');
      }
      updateData.email = data.email;
    }

    if (data.password !== undefined) {
      updateData.password = await this.securityUtil.hashPassword(data.password);
    }

    if (data.fullname !== undefined) {
      updateData.fullname = data.fullname;
    }

    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    if (data.isVerified !== undefined) {
      updateData.verifiedAt = data.isVerified ? new Date() : undefined;
    }

    const updated = await this.userAccess.updateUser(id, updateData);
    if (!updated) {
      throw new NotFoundException('User not found.');
    }
    return this.toAdminUserProfile(updated);
  }

  public async deleteUser(id: number): Promise<void> {
    const deleted = await this.userAccess.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException('User not found.');
    }
  }

  // --- Private helpers ---

  private toAdminUserProfile(entity: User): AdminUserProfileResponseDTO {
    const dto = new AdminUserProfileResponseDTO();
    dto.id = entity.id;
    dto.email = entity.email;
    dto.fullname = entity.fullname ?? null;
    dto.status = entity.status;
    dto.verifiedAt = entity.verifiedAt ?? null;
    dto.lastLoginAt = entity.lastLoginAt ?? null;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
