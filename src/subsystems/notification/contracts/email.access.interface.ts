export interface SendEmailParams {
  to: string;
  subject: string;
  template: string;
  data: Record<string, string>;
}

export interface IEmailAccess {
  sendEmail(params: SendEmailParams): Promise<void>;
}
