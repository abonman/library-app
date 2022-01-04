import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthTokenGuard } from './auth.token.guard';
import { AuthService } from './auth.service';
import { AuthTokenStrategy } from './auth.token.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {expiresIn: '10000s'}
      })
    })
  ],
  providers: [AuthService, AuthTokenStrategy, AuthTokenGuard],
  exports: [AuthService]
})
export class AuthModule {}