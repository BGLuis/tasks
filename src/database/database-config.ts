import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfigService } from 'src/app-config/app-config.service';

export const config = (
	configService: AppConfigService,
): TypeOrmModuleOptions => {
	return {
		type: 'mysql',
		host: configService.DbHost,
		port: configService.DbPort,
		username: configService.DbUsername,
		password: configService.DbPassword,
		database: configService.DbName,
		entities: [__dirname + '/../**/*.entity{.ts,.js}'],
		synchronize: true,
	};
};
