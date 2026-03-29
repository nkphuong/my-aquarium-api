export class PasswordResetRequestedEvent {
  userId: number;
  email: string;
  fullname?: string;
  resetToken: string;
}
