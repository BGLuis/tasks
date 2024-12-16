import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { PasswordEncryption } from 'src/encryption/password-encryption.provider';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from 'src/app-config/app-config.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
	imports: [
		EncryptionModule,
		AppConfigModule,
		PassportModule,
		TypeOrmModule.forFeature([User]),
		JwtModule.registerAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: async (configService: AppConfigService) => ({
				secret: configService.JwtSecret,
				signOptions: { expiresIn: '60m' },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, PasswordEncryption, JwtStrategy],
})
export class AuthModule {}
