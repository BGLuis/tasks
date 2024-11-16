import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom.logger';
import { AppConfigModule } from './app-config/app-config.module';
import { TaskModule } from './task/task.module';
import { config } from './database/database-config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigService } from './app-config/app-config.service';

@Module({
	imports: [
		AppConfigModule,
		LoggerModule.forRoot({ pinoHttp: { level: 'trace' } }),
		TypeOrmModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: config,
		}),
		TaskModule,
	],
	controllers: [AppController],
	providers: [CustomLogger],
	exports: [CustomLogger],
})
export class AppModule {}
