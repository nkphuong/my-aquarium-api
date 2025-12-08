import { ValueObject } from './base.value-object';
import { ValidationException } from '@domain/exceptions/domain.exception';

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  private constructor(props: EmailProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  static create(email: string): Email {
    const normalizedEmail = email.toLowerCase().trim();
    if (!Email.isValid(normalizedEmail)) {
      throw new ValidationException('Invalid email format');
    }
    return new Email({ value: normalizedEmail });
  }

  private static isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
