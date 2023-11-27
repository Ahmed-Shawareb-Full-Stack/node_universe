import { Controller, Get, Headers, Ip } from '@nestjs/common';
import { AppService } from './app.service';
// import { MessageService } from './shared/services/message/message';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    // private readonly messageService: MessageService,
  ) {}

  @Get()
  getHello(@Headers() headers): string {
    console.log(headers);
    return this.appService.getHello();
  }

  // @Get('/send-message')
  // async sendMessage() {
  //   const res = await this.messageService.sendMessage({
  //     code: '123456',
  //     method: 'SMS',
  //   });
  //   console.log(res);
  // }
}
