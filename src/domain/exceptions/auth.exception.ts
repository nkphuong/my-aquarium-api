import { DomainException } from './domain.exception';

export class AuthenticationException extends DomainException {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationException';
  }
}

export class UnauthorizedException extends DomainException {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

export class TokenExpiredException extends DomainException {
  constructor(message: string = 'Token has expired') {
    super(message);
    this.name = 'TokenExpiredException';
  }
}

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}
