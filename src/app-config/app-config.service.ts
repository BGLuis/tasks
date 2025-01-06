import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

@Injectable()
export class AppConfigService {
	constructor(
		private readonly config: ConfigService,
		private readonly logger: Logger,
	) {
		this.logger.debug(
			`application log level: ${this.config.get<string>('API_LOG_LEVEL')}`,
		);
		this.logger.debug(
			`database type: ${this.config.get<string>('DB_TYPE')}`,
		);
		this.logger.debug(
			`database name: ${this.config.get<string>('DB_NAME')}`,
		);
		this.logger.debug(
			`database host: ${this.config.get<string>('DB_HOST')}`,
		);
		this.logger.debug(
			`database port: ${this.config.get<number>('DB_INTERNAL_PORT')}`,
		);
		this.logger.debug(
			`using database user: ${this.config.get<string>('DB_USER')}`,
		);
		this.logger.debug(
			`using database password: ${this.config.get<string>('DB_PASS')}`,
		);
		this.logger.debug(
			`password encryption size: ${this.config.get<string>('API_PASSWORD_KEY_LENGTH')}`,
		);
		this.logger.debug(
			`salt size: ${this.config.get<string>('API_PASSWORD_SALT_LENGTH')}`,
		);
		this.logger.debug(
			`jwt secret: ${this.config.get<string>('API_JWT_SECRET')}`,
		);
	}

	get LogLevel(): string {
		return this.config.get<string>('API_LOG_LEVEL');
	}

	get DbType(): string {
		return this.config.get<string>('DB_TYPE');
	}

	get DbName(): string {
		return this.config.get<string>('DB_NAME');
	}

	get DbHost(): string {
		return this.config.get<string>('DB_HOST');
	}

	get DbPort(): number {
		return this.config.get<number>('DB_INTERNAL_PORT');
	}

	get DbUsername(): string {
		return this.config.get<string>('DB_USER');
	}

	get DbPassword(): string {
		return this.config.get<string>('DB_PASS');
	}

	get PasswordKeyLength(): number {
		return this.config.get<number>('API_PASSWORD_KEY_LENGTH');
	}

	get SaltLength(): number {
		return this.config.get<number>('API_PASSWORD_SALT_LENGTH');
	}

	get JwtSecret(): string {
		return this.config.get<string>('API_JWT_SECRET');
	}
}
