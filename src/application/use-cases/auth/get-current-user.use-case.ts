import { Injectable } from '@nestjs/common';
import { UseCase } from '@application/use-cases/base.use-case';
import { UserDto } from '@application/dtos/auth.dto';
import { UserRepository } from '@infrastructure/repositories/user.repository';
import { EntityNotFoundException } from '@domain/exceptions/domain.exception';

@Injectable()
export class GetCurrentUserUseCase implements UseCase<number, UserDto> {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new EntityNotFoundException('User', userId);
    }

    return {
      id: user.id,
      authId: user.authId,
      fullname: user.fullname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
