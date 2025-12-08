import { Email } from './email.value-object';
import { ValidationException } from '@domain/exceptions/domain.exception';

describe('Email Value Object', () => {
  describe('create', () => {
    it('should create email with valid format', () => {
      const email = Email.create('test@example.com');
      expect(email.value).toBe('test@example.com');
    });

    it('should trim whitespace from email', () => {
      const email = Email.create('  test@example.com  ');
      expect(email.value).toBe('test@example.com');
    });

    it('should convert email to lowercase', () => {
      const email = Email.create('TEST@EXAMPLE.COM');
      expect(email.value).toBe('test@example.com');
    });

    it('should throw ValidationException for email without @', () => {
      expect(() => Email.create('invalid.email.com')).toThrow(
        ValidationException,
      );
      expect(() => Email.create('invalid.email.com')).toThrow(
        'Invalid email format',
      );
    });

    it('should throw ValidationException for email without domain', () => {
      expect(() => Email.create('test@')).toThrow(ValidationException);
      expect(() => Email.create('test@')).toThrow('Invalid email format');
    });

    it('should throw ValidationException for empty string', () => {
      expect(() => Email.create('')).toThrow(ValidationException);
      expect(() => Email.create('')).toThrow('Invalid email format');
    });

    it('should throw ValidationException for email with spaces', () => {
      expect(() => Email.create('test @example.com')).toThrow(
        ValidationException,
      );
      expect(() => Email.create('test @example.com')).toThrow(
        'Invalid email format',
      );
    });

    it('should throw ValidationException for email with only @ symbol', () => {
      expect(() => Email.create('@')).toThrow(ValidationException);
    });

    it('should throw ValidationException for email without username', () => {
      expect(() => Email.create('@example.com')).toThrow(ValidationException);
    });
  });

  describe('value getter', () => {
    it('should return email value', () => {
      const email = Email.create('test@example.com');
      expect(email.value).toBe('test@example.com');
    });

    it('should return trimmed and lowercase email', () => {
      const email = Email.create('  TEST@EXAMPLE.COM  ');
      expect(email.value).toBe('test@example.com');
    });
  });

  describe('equals', () => {
    it('should return true for equal emails', () => {
      const email1 = Email.create('test@example.com');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should return false for different emails', () => {
      const email1 = Email.create('test1@example.com');
      const email2 = Email.create('test2@example.com');
      expect(email1.equals(email2)).toBe(false);
    });

    it('should compare case-insensitively', () => {
      const email1 = Email.create('TEST@EXAMPLE.COM');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });

    it('should ignore whitespace in comparison', () => {
      const email1 = Email.create('  test@example.com  ');
      const email2 = Email.create('test@example.com');
      expect(email1.equals(email2)).toBe(true);
    });
  });
});
