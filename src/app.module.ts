import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom.logger';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppConfigModule } from './app-config/app-config.module';
import { TaskModule } from './task/task.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from './app-config/app-config.service';

@Module({
	imports: [
		AppConfigModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				LOG_LEVEL: Joi.string().required(),
			}),
		}),
		LoggerModule.forRoot({ pinoHttp: { level: 'trace' } }),
		TaskModule,
	],
	controllers: [AppController],
	providers: [CustomLogger],
	exports: [CustomLogger],
})
export class AppModule {}
