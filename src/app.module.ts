import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { UserVerification } from './users/entities/user-verification';
import { MailerModule } from '@nestjs-modules/mailer';
import { Mail } from './shared/services/mail/mail';
import { MjmlAdapter } from '@nestjs-modules/mailer/dist/adapters/mjml.adapter';
import { UserTokensDetails } from './users/entities/user-tokens-details';
import { JwtModule } from '@nestjs/jwt';
import { Role } from './users/entities/role.entity';
// import { TwilioModule } from 'nestjs-twilio';
// import { MessageService } from './shared/services/message/message';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: +configService.get('DB_PORT'),
          database: configService.get<string>('DB_NAME'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          entities: [User, UserVerification, UserTokensDetails, Role],
          synchronize:
            configService.get<string>('NODE_ENV') === 'development'
              ? true
              : false,
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_PORT'),
          auth: {
            user: configService.get('MAIL_USERNAME'),
            pass: configService.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: 'node_universe <nodeuniverse@email.com>',
        },
        preview: true,
        template: {
          dir: __dirname + '/templates',
          adapter: new MjmlAdapter(''),
        },
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          privateKey: configService.get('PRIVATE_KEY'),
          publicKey: configService.get('PUBLIC_KEY'),
          secretOrPrivateKey: configService.get('PRIVATE_KEY'),
          signOptions: {
            algorithm: 'RS256',
            expiresIn: configService.get('JWT_EXPIRES_IN'),
            issuer: configService.get('ISSUER'),
            audience: configService.get('AUDIENCE'),
          },
        };
      },
    }),
    // TwilioModule.forRootAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService) => ({
    //     accountSid: configService.get('ACCOUNT_SID'),
    //     authToken: configService.get('AUTH_TOKEN'),
    //   }),
    // }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    Mail,
    // MessageService,
  ],
})
export class AppModule {}
