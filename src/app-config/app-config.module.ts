import { Module } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				API_LOG_LEVEL: Joi.string().default('info'),
				API_PASSWORD_KEY_LENGTH: Joi.number().default(32),
				API_PASSWORD_SALT_LENGTH: Joi.number().default(8),
				API_JWT_SECRET: Joi.string().required(),
				DB_TYPE: Joi.string().required(),
				DB_NAME: Joi.string().required(),
				DB_HOST: Joi.string().default('task-db'),
				DB_INTERNAL_PORT: Joi.number().required(),
				DB_USER: Joi.string().required(),
				DB_PASS: Joi.string().required(),
			}),
		}),
	],
	providers: [AppConfigService],
	exports: [AppConfigService],
})
export class AppConfigModule {}
