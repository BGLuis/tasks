import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom.logger';
import { AppConfigModule } from './app-config/app-config.module';
import { TaskModule } from './task/task.module';
import { config } from './database/database-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app-config/app-config.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { GroupModule } from './group/group.module';

@Module({
	imports: [
		AppConfigModule,
		LoggerModule.forRoot({
			pinoHttp: {
				level: 'trace',
				transport: {
					target: 'pino-pretty',
					options: {
						colorize: true,
						colorizeObjects: true,
					},
				},
			},
		}),
		TypeOrmModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: config,
		}),
		TaskModule,
		UserModule,
		AuthModule,
		EncryptionModule,
		GroupModule,
	],
	controllers: [AppController],
	providers: [CustomLogger],
	exports: [CustomLogger],
})
export class AppModule {}
