import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

export interface MailDetails {
  from?: string;
  to: string | string[];
  subject?: string;
  text?: string;
  html?: string;
  template?: string;
  templateData?: any;
}

@Injectable()
export class Mail {
  constructor(private readonly mailService: MailerService) {}

  async send(mailInput: MailDetails) {
    await this.mailService.sendMail({
      to: mailInput.to,
      from: mailInput.from,
      subject: mailInput.subject,
      text: mailInput.text,
      html: mailInput.html,
      template: __dirname + mailInput.template,
      context: mailInput.templateData,
    });
  }
}
