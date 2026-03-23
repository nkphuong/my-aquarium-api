import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import type { ILoggingUtility } from '@utilities/logging/logging.utility.interface';
import type {
  IEmailAccess,
  SendEmailParams,
} from '../contracts/email.access.interface';
import { BaseAccessor } from '@core/accessors/base.accessor';

@Injectable()
export class EmailAccess extends BaseAccessor implements IEmailAccess {
  private transporter: Transporter;

  constructor(
    @Inject('ILoggingUtility') logger: ILoggingUtility,
    private readonly configService: ConfigService,
  ) {
    super(logger);

    const defaultMailer = this.configService.get<string>('mail.default');
    const mailerConfig = this.configService.get<{
      host: string;
      port: number;
      secure: boolean;
      auth?: { user: string; pass: string };
    }>(`mail.mailers.${defaultMailer}`);

    const transportOptions: nodemailer.TransportOptions &
      Record<string, unknown> = {
      host: mailerConfig?.host,
      port: mailerConfig?.port,
      secure: mailerConfig?.secure,
    };

    if (mailerConfig?.auth?.user) {
      transportOptions.auth = {
        user: mailerConfig?.auth.user,
        pass: mailerConfig?.auth.pass,
      };
    }

    this.transporter = nodemailer.createTransport(transportOptions);
  }

  private loadTemplate(name: string, data: Record<string, string>): string {
    const templatePath = path.join(__dirname, 'templates', `${name}.html`);
    let html = fs.readFileSync(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(data)) {
      html = html.replaceAll(`{{${key}}}`, value);
    }

    return html;
  }

  async sendEmail(params: SendEmailParams): Promise<void> {
    const from = {
      address: this.configService.get<string>('mail.from.address'),
      name: this.configService.get<string>('mail.from.name'),
    };

    const html = this.loadTemplate(params.template, params.data);

    await this.transporter.sendMail({
      from: `"${from.name}" <${from.address}>`,
      to: params.to,
      subject: params.subject,
      html,
    });

    this.logger.logInfo(
      `Email sent to ${params.to}: ${params.subject}`,
      'EmailAccess',
    );
  }
}
