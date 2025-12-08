import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { GetCurrentUserUseCase } from '@application/use-cases/auth/get-current-user.use-case';
import { LoginDto, RegisterDto } from '@application/dtos/auth.dto';
import { ResponseDto } from '@presentation/dto/response.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.registerUseCase.execute(registerDto);
      return ResponseDto.success(result, 'Registration successful');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.loginUseCase.execute(loginDto);
      return ResponseDto.success(result, 'Login successful');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser('id') userId: number) {
    try {
      const user = await this.getCurrentUserUseCase.execute(userId);
      return ResponseDto.success(user);
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }
}
