import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('user') {}

@Injectable()
export class AdminAuthGuard extends AuthGuard('admin') {}
