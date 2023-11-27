// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { TwilioService } from 'nestjs-twilio';

// interface SendMessageOptions {
//   method: 'SMS' | 'WhatsApp';
//   code: string;
//   to?: string;
// }

// @Injectable()
// export class MessageService {
//   constructor(
//     private readonly twilioService: TwilioService,
//     private readonly configService: ConfigService,
//   ) {}

//   async sendMessage(options: SendMessageOptions) {
//     await this.twilioService.client.messages.create({
//       to:
//         this.configService.get('NODE_ENV') === 'development'
//           ? `${
//               options.method === 'SMS'
//                 ? this.configService.get('TWILIO_TEST_NUMBER')
//                 : `whatsapp:${this.configService.get('TWILIO_TEST_NUMBER')}`
//             } `
//           : options.to,
//       from:
//         this.configService.get('NODE_ENV') === 'development'
//           ? `${
//               options.method === 'SMS'
//                 ? this.configService.get('TWILIO_TEST_NUMBER')
//                 : `whatsapp:${this.configService.get('TWILIO_TEST_NUMBER')}`
//             } `
//           : `${
//               options.method === 'SMS'
//                 ? this.configService.get('TWILIO_FROM_NUMBER')
//                 : `whatsapp:${this.configService.get('TWILIO_FROM_NUMBER')}`
//             } `,
//       body: `Your ${options.method} verification code is ${options.code}`,
//     });
//   }
// }
