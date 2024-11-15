import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
	constructor(private readonly config: ConfigService) {}

	get LogLevel(): string {
		console.log(this.config.get<string>('LOG_LEVEL'));
		return this.config.get<string>('LOG_LEVEL');
	}

	get DbType(): string {
		console.log(this.config.get<string>('DB_TYPE'));
		return this.config.get<string>('DB_TYPE');
	}

	get DbName(): string {
		console.log(this.config.get<string>('DB_NAME'));
		return this.config.get<string>('DB_NAME');
	}

	get DbHost(): string {
		console.log(this.config.get<string>('DB_HOST'));
		return this.config.get<string>('DB_HOST');
	}

	get DbPort(): number {
		console.log(this.config.get<number>('DB_INTERNAL_PORT'));
		return this.config.get<number>('DB_INTERNAL_PORT');
	}

	get DbUsername(): string {
		console.log(this.config.get<string>('DB_USER'));
		return this.config.get<string>('DB_USER');
	}

	get DbPassword(): string {
		console.log(this.config.get<string>('DB_PASS'));
		return this.config.get<string>('DB_PASS');
	}
}
