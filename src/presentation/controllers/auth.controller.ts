import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '@application/services/auth.service';
import { LoginDto, RegisterDto } from '@application/dtos/auth.dto';
import { ResponseDto } from '@presentation/dto/response.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { CurrentUser } from '@presentation/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return ResponseDto.success(result, 'Registration successful');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return ResponseDto.success(result, 'Login successful');
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser('id') userId: number) {
    try {
      const user = await this.authService.getCurrentUser(userId);
      return ResponseDto.success(user);
    } catch (error) {
      return ResponseDto.error(error.message);
    }
  }
}
